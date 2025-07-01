import { Request, Response } from 'express';
import Vehicle from '../models/vehicle.model';
import User from '../models/user.model';

// Get dashboard statistics
export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get total vehicles count
    const totalVehicles = await Vehicle.countDocuments();
    
    // Get featured vehicles count
    const featuredVehicles = await Vehicle.countDocuments({ isFeatured: true });
    
    // Get vehicles by condition
    const newVehicles = await Vehicle.countDocuments({ condition: 'New' });
    const usedVehicles = await Vehicle.countDocuments({ condition: 'Used' });
    
    // Get total users count
    const totalUsers = await User.countDocuments();
    
    // Get recently added vehicles
    const recentVehicles = await Vehicle.find()
      .sort('-createdAt')
      .limit(5)
      .select('title make model year price createdAt');
    
    res.status(200).json({
      totalVehicles,
      featuredVehicles,
      newVehicles,
      usedVehicles,
      totalUsers,
      recentVehicles
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error fetching dashboard statistics' });
  }
};

// Get vehicle statistics
export const getVehicleStats = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get vehicles by make
    const vehiclesByMake = await Vehicle.aggregate([
      {
        $group: {
          _id: '$make',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);
    
    // Get vehicles by year
    const vehiclesByYear = await Vehicle.aggregate([
      {
        $group: {
          _id: '$year',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: -1 }
      },
      {
        $limit: 10
      }
    ]);
    
    // Get vehicles by body type
    const vehiclesByBodyType = await Vehicle.aggregate([
      {
        $group: {
          _id: '$bodyType',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    res.status(200).json({
      vehiclesByMake,
      vehiclesByYear,
      vehiclesByBodyType
    });
  } catch (error) {
    console.error('Error fetching vehicle stats:', error);
    res.status(500).json({ message: 'Server error fetching vehicle statistics' });
  }
};

// Toggle featured status
export const toggleFeaturedStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const vehicle = await Vehicle.findById(id);
    
    if (!vehicle) {
      res.status(404).json({ message: 'Vehicle not found' });
      return;
    }
    
    // Toggle the featured status
    vehicle.isFeatured = !vehicle.isFeatured;
    
    await vehicle.save();
    
    res.status(200).json({
      message: `Vehicle ${vehicle.isFeatured ? 'marked as featured' : 'removed from featured'}`,
      isFeatured: vehicle.isFeatured
    });
  } catch (error) {
    console.error('Error toggling featured status:', error);
    res.status(500).json({ message: 'Server error updating featured status' });
  }
}; 