import { Request, Response, NextFunction } from 'express';
import { PERMISSIONS, ROLES } from '../models/user.model';

/**
 * Middleware to check if a user has the required permissions
 * @param requiredPermissions - Array of permissions required to access the route
 */
export const hasPermission = (requiredPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const user = (req as any).user;
      
      // If no user is set in the request, deny access
      if (!user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }
      
      // Admin role has all permissions
      if (user.role === ROLES.ADMIN) {
        next();
        return;
      }
      
      // Check if user has all required permissions
      const hasAllPermissions = requiredPermissions.every(permission => 
        user.permissions && user.permissions.includes(permission)
      );
      
      if (hasAllPermissions) {
        next();
      } else {
        res.status(403).json({ 
          message: 'You do not have permission to perform this action',
          requiredPermissions
        });
      }
    } catch (error) {
      console.error('Permission middleware error:', error);
      res.status(500).json({ message: 'Server error checking permissions' });
    }
  };
};

/**
 * Middleware to check if a user has at least one of the required permissions
 * @param requiredPermissions - Array of permissions, where having any one is sufficient
 */
export const hasAnyPermission = (requiredPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const user = (req as any).user;
      
      // If no user is set in the request, deny access
      if (!user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }
      
      // Admin role has all permissions
      if (user.role === ROLES.ADMIN) {
        next();
        return;
      }
      
      // Check if user has at least one of the required permissions
      const hasPermission = requiredPermissions.some(permission => 
        user.permissions && user.permissions.includes(permission)
      );
      
      if (hasPermission) {
        next();
      } else {
        res.status(403).json({ 
          message: 'You do not have permission to perform this action',
          requiredPermissions
        });
      }
    } catch (error) {
      console.error('Permission middleware error:', error);
      res.status(500).json({ message: 'Server error checking permissions' });
    }
  };
}; 