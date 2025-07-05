import { Request, Response } from 'express';
import ShippingSchedule, { IShippingSchedule } from '../models/shippingSchedule.model';

interface AuthRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    permissions: string[];
  };
}

interface ShippingScheduleQuery {
  page?: string;
  limit?: string;
  fromPort?: string;
  toCountry?: string;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Get all shipping schedules with pagination and filtering
export const getShippingSchedules = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = '1',
      limit = '10',
      fromPort,
      toCountry,
      status,
      search,
      sortBy = 'nextDeparture',
      sortOrder = 'asc'
    }: ShippingScheduleQuery = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build filter object
    const filter: any = { isActive: true };
    
    if (fromPort && fromPort !== 'all') {
      filter.fromPort = fromPort;
    }
    
    if (toCountry && toCountry !== 'all') {
      filter.toCountry = toCountry;
    }
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    if (search) {
      filter.$or = [
        { fromPort: { $regex: search, $options: 'i' } },
        { toPort: { $regex: search, $options: 'i' } },
        { fromCountry: { $regex: search, $options: 'i' } },
        { toCountry: { $regex: search, $options: 'i' } },
        { carrier: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute queries
    const [schedules, total] = await Promise.all([
      ShippingSchedule.find(filter)
        .populate('createdBy', 'name email')
        .populate('updatedBy', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      ShippingSchedule.countDocuments(filter)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    res.status(200).json({
      success: true,
      message: 'Shipping schedules retrieved successfully',
      data: {
        schedules,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems: total,
          itemsPerPage: limitNum,
          hasNextPage,
          hasPrevPage
        }
      }
    });
  } catch (error) {
    console.error('Error fetching shipping schedules:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch shipping schedules',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// Get public shipping schedules (for frontend)
export const getPublicShippingSchedules = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = '1',
      limit = '10',
      fromPort,
      toCountry,
      search,
      sortBy = 'nextDeparture',
      sortOrder = 'asc'
    }: ShippingScheduleQuery = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build filter object (only active schedules for public)
    const filter: any = { isActive: true, status: 'active' };
    
    if (fromPort && fromPort !== 'all') {
      filter.fromPort = fromPort;
    }
    
    if (toCountry && toCountry !== 'all') {
      filter.toCountry = toCountry;
    }
    
    if (search) {
      filter.$or = [
        { fromPort: { $regex: search, $options: 'i' } },
        { toPort: { $regex: search, $options: 'i' } },
        { fromCountry: { $regex: search, $options: 'i' } },
        { toCountry: { $regex: search, $options: 'i' } },
        { carrier: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute queries
    const [schedules, total] = await Promise.all([
      ShippingSchedule.find(filter)
        .select('-createdBy -updatedBy -isActive')
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      ShippingSchedule.countDocuments(filter)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      message: 'Public shipping schedules retrieved successfully',
      data: {
        schedules,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems: total,
          itemsPerPage: limitNum
        }
      }
    });
  } catch (error) {
    console.error('Error fetching public shipping schedules:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch shipping schedules',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// Get shipping schedule by ID
export const getShippingScheduleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const schedule = await ShippingSchedule.findById(id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');
    
    if (!schedule) {
      res.status(404).json({
        success: false,
        message: 'Shipping schedule not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Shipping schedule retrieved successfully',
      data: schedule
    });
  } catch (error) {
    console.error('Error fetching shipping schedule:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch shipping schedule',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// Create new shipping schedule
export const createShippingSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const scheduleData = {
      ...req.body,
      createdBy: userId,
      updatedBy: userId
    };

    const schedule = new ShippingSchedule(scheduleData);
    await schedule.save();
    
    const populatedSchedule = await ShippingSchedule.findById(schedule._id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');
    
    res.status(201).json({
      success: true,
      message: 'Shipping schedule created successfully',
      data: populatedSchedule
    });
  } catch (error: any) {
    console.error('Error creating shipping schedule:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors
      });
      return;
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create shipping schedule',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Update shipping schedule
export const updateShippingSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const updateData = {
      ...req.body,
      updatedBy: userId
    };

    const schedule = await ShippingSchedule.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email')
     .populate('updatedBy', 'name email');
    
    if (!schedule) {
      res.status(404).json({
        success: false,
        message: 'Shipping schedule not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Shipping schedule updated successfully',
      data: schedule
    });
  } catch (error: any) {
    console.error('Error updating shipping schedule:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors
      });
      return;
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update shipping schedule',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Delete shipping schedule (soft delete)
export const deleteShippingSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const schedule = await ShippingSchedule.findByIdAndUpdate(
      id,
      { 
        isActive: false,
        updatedBy: userId
      },
      { new: true }
    );
    
    if (!schedule) {
      res.status(404).json({
        success: false,
        message: 'Shipping schedule not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Shipping schedule deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting shipping schedule:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete shipping schedule',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// Get unique ports and countries for filters
export const getShippingFilters = async (req: Request, res: Response): Promise<void> => {
  try {
    const [fromPorts, toPorts, toCountries] = await Promise.all([
      ShippingSchedule.distinct('fromPort', { isActive: true }),
      ShippingSchedule.distinct('toPort', { isActive: true }),
      ShippingSchedule.distinct('toCountry', { isActive: true })
    ]);

    res.status(200).json({
      success: true,
      message: 'Shipping filters retrieved successfully',
      data: {
        fromPorts: fromPorts.sort(),
        toPorts: toPorts.sort(),
        toCountries: toCountries.sort()
      }
    });
  } catch (error) {
    console.error('Error fetching shipping filters:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch shipping filters',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// Bulk update schedules status
export const bulkUpdateStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { scheduleIds, status } = req.body;
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    if (!scheduleIds || !Array.isArray(scheduleIds) || scheduleIds.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Schedule IDs are required'
      });
      return;
    }

    if (!['active', 'delayed', 'cancelled'].includes(status)) {
      res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
      return;
    }

    const result = await ShippingSchedule.updateMany(
      { _id: { $in: scheduleIds } },
      { 
        status,
        updatedBy: userId
      }
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} shipping schedules updated successfully`,
      data: {
        modifiedCount: result.modifiedCount
      }
    });
  } catch (error) {
    console.error('Error bulk updating shipping schedules:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update shipping schedules',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
}; 