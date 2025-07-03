import { Request, Response } from 'express';
import Vehicle from '../models/vehicle.model';
import User from '../models/user.model';
import SftpUsage from '../models/sftpUsage.model';

// Get dashboard statistics
export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get total counts
    const totalCars = await Vehicle.countDocuments();
    const totalUsers = await User.countDocuments();
    const featuredCars = await Vehicle.countDocuments({ isFeatured: true });
    const activeUsers = await User.countDocuments({ isActive: true });

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentCars = await Vehicle.countDocuments({ 
      createdAt: { $gte: thirtyDaysAgo } 
    });
    
    const recentLogins = await User.countDocuments({
      lastLogin: { $gte: thirtyDaysAgo }
    });

    res.status(200).json({
      totalCars,
      totalUsers,
      featuredCars,
      activeUsers,
      recentCars,
      recentLogins,
      pendingActions: 0 // You can implement this based on your business logic
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error fetching dashboard statistics' });
  }
};

// Get user permissions by ID
export const getUserPermissions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id).select('name email role permissions isActive');
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    res.status(500).json({ message: 'Server error fetching user permissions' });
  }
};

// Get top brands
export const getTopBrands = async (req: Request, res: Response): Promise<void> => {
  try {
    const topBrands = await Vehicle.aggregate([
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
      },
      {
        $project: {
          name: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    res.status(200).json(topBrands);
  } catch (error) {
    console.error('Error fetching top brands:', error);
    res.status(500).json({ message: 'Server error fetching top brands' });
  }
};

// Get recent activity
export const getRecentActivity = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;

    // Get recent vehicles (as activity items)
    const recentVehicles = await Vehicle.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('make model year createdAt updatedAt');

    // Transform to activity format
    const activities = recentVehicles.map((vehicle, index) => ({
      id: index + 1,
      action: 'Added a new car',
      car: `${vehicle.make} ${vehicle.model} ${vehicle.year}`,
      user: 'Admin User', // You can track this with user sessions
      time: vehicle.createdAt ? getTimeAgo(vehicle.createdAt) : 'Unknown time',
      avatar: 'AU'
    }));

    res.status(200).json(activities);
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({ message: 'Server error fetching recent activity' });
  }
};

// Get user activity stats
export const getUserActivityStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const inactiveUsers = totalUsers - activeUsers;

    res.status(200).json({
      active: activeUsers,
      inactive: inactiveUsers,
      total: totalUsers
    });
  } catch (error) {
    console.error('Error fetching user activity stats:', error);
    res.status(500).json({ message: 'Server error fetching user activity stats' });
  }
};

// Get most active users (based on last login)
export const getMostActiveUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 5;

    const activeUsers = await User.find({ 
      isActive: true,
      lastLogin: { $exists: true } // Only get users who have logged in
    })
      .sort({ lastLogin: -1 })
      .limit(limit)
      .select('name email lastLogin');

    // Transform to required format (mock actions for now)
    const mostActive = activeUsers.map((user, index) => ({
      name: user.name,
      actions: Math.floor(Math.random() * 100) + 50, // Mock data - you can implement real tracking
      lastLogin: user.lastLogin || new Date()
    }));

    res.status(200).json(mostActive);
  } catch (error) {
    console.error('Error fetching most active users:', error);
    res.status(500).json({ message: 'Server error fetching most active users' });
  }
};

// Helper function to format time ago
const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
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

// Get SFTP usage statistics
export const getSftpUsageStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const days = parseInt(req.query.days as string) || 7;
    
    // Get date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    // Get daily usage aggregated by date
    const dailyUsage = await SftpUsage.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
          operationType: 'upload'
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" }
          },
          totalUploads: { $sum: "$uploadsCount" },
          totalSizeMB: { $sum: "$totalSizeMB" },
          totalSizeGB: { $sum: { $divide: ["$totalSizeMB", 1024] } },
          images: { $sum: "$fileTypes.images" },
          documents: { $sum: "$fileTypes.documents" },
          others: { $sum: "$fileTypes.others" }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Get total statistics
    const totalStats = await SftpUsage.aggregate([
      {
        $match: {
          operationType: 'upload'
        }
      },
      {
        $group: {
          _id: null,
          totalFiles: { $sum: "$uploadsCount" },
          totalSizeMB: { $sum: "$totalSizeMB" },
          totalSizeGB: { $sum: { $divide: ["$totalSizeMB", 1024] } },
          totalImages: { $sum: "$fileTypes.images" },
          totalDocuments: { $sum: "$fileTypes.documents" },
          totalOthers: { $sum: "$fileTypes.others" }
        }
      }
    ]);

    // Format data for chart (last 7 days)
    const chartData = [];
    const chartLabels = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      const dayData = dailyUsage.find(d => d._id === dateStr);
      chartLabels.push(dayName);
      chartData.push(dayData ? Math.round(dayData.totalSizeGB * 100) / 100 : 0);
    }

    res.status(200).json({
      chartData: {
        labels: chartLabels,
        data: chartData
      },
      dailyUsage,
      totalStats: totalStats[0] || {
        totalFiles: 0,
        totalSizeMB: 0,
        totalSizeGB: 0,
        totalImages: 0,
        totalDocuments: 0,
        totalOthers: 0
      }
    });
  } catch (error) {
    console.error('Error fetching SFTP usage stats:', error);
    res.status(500).json({ message: 'Server error fetching SFTP usage statistics' });
  }
};

// Get recent SFTP uploads
export const getRecentSftpUploads = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;

    const recentUploads = await SftpUsage.find({
      operationType: 'upload'
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('fileName fileSize totalSizeMB createdAt');

    const formattedUploads = recentUploads.map(upload => ({
      fileName: upload.fileName,
      fileSize: `${Math.round(upload.totalSizeMB * 100) / 100} MB`,
      uploadedAt: getTimeAgo(upload.createdAt)
    }));

    res.status(200).json(formattedUploads);
  } catch (error) {
    console.error('Error fetching recent SFTP uploads:', error);
    res.status(500).json({ message: 'Server error fetching recent SFTP uploads' });
  }
}; 