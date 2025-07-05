import express from 'express';
import {
  getShippingSchedules,
  getPublicShippingSchedules,
  getShippingScheduleById,
  createShippingSchedule,
  updateShippingSchedule,
  deleteShippingSchedule,
  getShippingFilters,
  bulkUpdateStatus
} from '../controllers/shippingSchedule.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';
import { hasPermission } from '../middleware/permission.middleware';
import { Request, Response, NextFunction } from 'express';

const router = express.Router();

// Middleware to check if user is admin or editor
const adminOrEditor = (req: Request, res: Response, next: NextFunction): void => {
  const user = (req as any).user;
  
  if (!user) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  
  if (user.role === 'admin' || user.role === 'editor') {
    next();
  } else {
    res.status(403).json({ 
      message: 'Access denied. Admin or Editor role required.' 
    });
  }
};

// Public routes (no authentication required)
router.get('/public', getPublicShippingSchedules);
router.get('/filters', getShippingFilters);

// Protected routes (authentication required)
router.use(protect);

// Admin and Editor routes
router.get('/', adminOrEditor, getShippingSchedules);
router.get('/:id', adminOrEditor, getShippingScheduleById);
router.post('/', adminOrEditor, createShippingSchedule);
router.put('/:id', adminOrEditor, updateShippingSchedule);
router.patch('/bulk-status', adminOrEditor, bulkUpdateStatus);

// Admin only routes
router.delete('/:id', adminOnly, deleteShippingSchedule);

export default router; 