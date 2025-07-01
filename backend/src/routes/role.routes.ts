import express from 'express';
import {
  getRoles,
  getPermissions,
  updateUserPermissions,
  updateUserRole
} from '../controllers/role.controller';
import { roleUpdateValidation, permissionsUpdateValidation } from '../middleware/validation.middleware';
import { protect } from '../middleware/auth.middleware';
import { hasPermission } from '../middleware/permission.middleware';
import { PERMISSIONS } from '../models/user.model';

const router = express.Router();

// All routes in this file require authentication
router.use(protect);

// GET /api/roles - Get all roles with their permissions
router.get('/', hasPermission([PERMISSIONS.VIEW_USERS]), getRoles);

// GET /api/roles/permissions - Get all available permissions
router.get('/permissions', hasPermission([PERMISSIONS.VIEW_USERS]), getPermissions);

// PUT /api/roles/user/:id/permissions - Update user permissions
router.put('/user/:id/permissions', 
  hasPermission([PERMISSIONS.EDIT_USER]), 
  permissionsUpdateValidation, 
  updateUserPermissions
);

// PUT /api/roles/user/:id/role - Update user role
router.put('/user/:id/role', 
  hasPermission([PERMISSIONS.EDIT_USER]), 
  roleUpdateValidation, 
  updateUserRole
);

export default router; 