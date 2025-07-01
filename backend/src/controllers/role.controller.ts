import { Request, Response } from 'express';
import User, { ROLES, PERMISSIONS, ROLE_PERMISSIONS } from '../models/user.model';
import { validationResult } from 'express-validator';

// Get all roles with their permissions
export const getRoles = async (req: Request, res: Response): Promise<void> => {
  try {
    const roles = Object.keys(ROLES).map(key => ({
      name: ROLES[key as keyof typeof ROLES],
      permissions: ROLE_PERMISSIONS[ROLES[key as keyof typeof ROLES]]
    }));
    
    res.status(200).json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ message: 'Server error fetching roles' });
  }
};

// Get all available permissions
export const getPermissions = async (req: Request, res: Response): Promise<void> => {
  try {
    const permissions = Object.keys(PERMISSIONS).map(key => ({
      name: key,
      value: PERMISSIONS[key as keyof typeof PERMISSIONS]
    }));
    
    res.status(200).json(permissions);
  } catch (error) {
    console.error('Error fetching permissions:', error);
    res.status(500).json({ message: 'Server error fetching permissions' });
  }
};

// Update user permissions
export const updateUserPermissions = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    
    const { id } = req.params;
    const { permissions } = req.body;
    
    // Find user
    const user = await User.findById(id);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    // Prevent updating your own permissions
    if (id === (req as any).user.id) {
      res.status(400).json({ message: 'Cannot update your own permissions' });
      return;
    }
    
    // Validate that all permissions exist
    const validPermissions = Object.values(PERMISSIONS);
    const invalidPermissions = permissions.filter((p: string) => !validPermissions.includes(p));
    
    if (invalidPermissions.length > 0) {
      res.status(400).json({ 
        message: 'Invalid permissions provided',
        invalidPermissions
      });
      return;
    }
    
    // Update user permissions
    user.permissions = permissions;
    
    // Save updated user
    await user.save();
    
    // Return updated user without password
    const updatedUser = await User.findById(id).select('-password');
    
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user permissions:', error);
    res.status(500).json({ message: 'Server error updating user permissions' });
  }
};

// Update user role
export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    
    const { id } = req.params;
    const { role } = req.body;
    
    // Find user
    const user = await User.findById(id);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    // Prevent updating your own role
    if (id === (req as any).user.id) {
      res.status(400).json({ message: 'Cannot update your own role' });
      return;
    }
    
    // Validate role
    const validRoles = Object.values(ROLES);
    if (!validRoles.includes(role)) {
      res.status(400).json({ 
        message: 'Invalid role provided',
        validRoles
      });
      return;
    }
    
    // Update user role (permissions will be updated in the pre-save hook)
    user.role = role;
    
    // Save updated user
    await user.save();
    
    // Return updated user without password
    const updatedUser = await User.findById(id).select('-password');
    
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Server error updating user role' });
  }
}; 