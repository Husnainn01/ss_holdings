import express from 'express';
import {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle
} from '../controllers/vehicle.controller';
import {
  getDashboardStats,
  getVehicleStats,
  toggleFeaturedStatus
} from '../controllers/admin.controller';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus
} from '../controllers/user.controller';
import { vehicleValidation, userUpdateValidation } from '../middleware/validation.middleware';
import { protect } from '../middleware/auth.middleware';
import { hasPermission } from '../middleware/permission.middleware';
import { PERMISSIONS } from '../models/user.model';
import { hybridUploadMiddleware } from '../utils/hybridUpload.middleware';

const router = express.Router();

// All routes in this file require authentication
router.use(protect);

// Dashboard routes
// GET /api/admin/dashboard/stats - Get dashboard statistics
router.get('/dashboard/stats', hasPermission([PERMISSIONS.VIEW_DASHBOARD]), getDashboardStats);

// GET /api/admin/dashboard/vehicle-stats - Get vehicle statistics
router.get('/dashboard/vehicle-stats', hasPermission([PERMISSIONS.VIEW_STATISTICS]), getVehicleStats);

// Vehicle management routes
// GET /api/admin/vehicles - Get all vehicles with pagination for admin
router.get('/vehicles', hasPermission([PERMISSIONS.VIEW_VEHICLES]), getVehicles);

// GET /api/admin/vehicles/:id - Get vehicle by ID for admin
router.get('/vehicles/:id', hasPermission([PERMISSIONS.VIEW_VEHICLES]), getVehicleById);

// POST /api/admin/vehicles - Create new vehicle
router.post('/vehicles', 
  hasPermission([PERMISSIONS.CREATE_VEHICLE]), 
  hybridUploadMiddleware('images', 10),  // Use SFTP upload middleware
  createVehicle
);

// PUT /api/admin/vehicles/:id - Update vehicle
router.put('/vehicles/:id', 
  hasPermission([PERMISSIONS.EDIT_VEHICLE]), 
  hybridUploadMiddleware('images', 10),  // Use SFTP upload middleware
  updateVehicle
);

// DELETE /api/admin/vehicles/:id - Delete vehicle
router.delete('/vehicles/:id', 
  hasPermission([PERMISSIONS.DELETE_VEHICLE]), 
  deleteVehicle
);

// PATCH /api/admin/vehicles/:id/toggle-featured - Toggle featured status
router.patch('/vehicles/:id/toggle-featured', 
  hasPermission([PERMISSIONS.FEATURE_VEHICLE]), 
  toggleFeaturedStatus
);

// User management routes
// GET /api/admin/users - Get all users with pagination
router.get('/users', hasPermission([PERMISSIONS.VIEW_USERS]), getUsers);

// GET /api/admin/users/:id - Get user by ID
router.get('/users/:id', hasPermission([PERMISSIONS.VIEW_USERS]), getUserById);

// PUT /api/admin/users/:id - Update user
router.put('/users/:id', 
  hasPermission([PERMISSIONS.EDIT_USER]), 
  userUpdateValidation, 
  updateUser
);

// DELETE /api/admin/users/:id - Delete user
router.delete('/users/:id', 
  hasPermission([PERMISSIONS.DELETE_USER]), 
  deleteUser
);

// PATCH /api/admin/users/:id/toggle-status - Toggle user active status
router.patch('/users/:id/toggle-status', 
  hasPermission([PERMISSIONS.EDIT_USER]), 
  toggleUserStatus
);

export default router; 