import express from 'express';
import {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getFeaturedVehicles,
  getRecentVehicles,
  getVehicleLocations,
  getModelsByMake
} from '../controllers/vehicle.controller';
import { vehicleValidation } from '../middleware/validation.middleware';
import { protect, adminOnly } from '../middleware/auth.middleware';
import { hybridUploadMiddleware } from '../utils/hybridUpload.middleware';

const router = express.Router();

// Public routes
// GET /api/vehicles - Get all vehicles with filtering, pagination, and sorting
router.get('/', getVehicles);

// GET /api/vehicles/featured/list - Get featured vehicles
router.get('/featured/list', getFeaturedVehicles);

// GET /api/vehicles/recent/list - Get recently added vehicles
router.get('/recent/list', getRecentVehicles);

// GET /api/vehicles/locations/list - Get unique vehicle locations
router.get('/locations/list', getVehicleLocations);

// GET /api/vehicles/models/:make - Get models by make
router.get('/models/:make', getModelsByMake);

// GET /api/vehicles/:id - Get vehicle by ID
router.get('/:id', getVehicleById);

// Protected routes (admin only)
// POST /api/vehicles - Create new vehicle (admin endpoint)
router.post('/', protect, adminOnly, hybridUploadMiddleware('images', 40), createVehicle);

// POST /api/admin/vehicles - Create new vehicle (admin endpoint - alternative path)
router.post('/admin/vehicles', protect, adminOnly, hybridUploadMiddleware('images', 40), createVehicle);

// PUT /api/vehicles/:id - Update vehicle
router.put('/:id', protect, adminOnly, hybridUploadMiddleware('images', 40), updateVehicle);

// PUT /api/admin/vehicles/:id - Update vehicle (admin endpoint - alternative path)
router.put('/admin/vehicles/:id', protect, adminOnly, hybridUploadMiddleware('images', 40), updateVehicle);

// DELETE /api/vehicles/:id - Delete vehicle
router.delete('/:id', protect, adminOnly, deleteVehicle);

export default router; 