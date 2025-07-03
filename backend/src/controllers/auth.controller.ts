import { Request, Response } from 'express';
import User from '../models/user.model';
import { validationResult } from 'express-validator';
import config from '../config/config';

const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (userId: string): string => {
  return jwt.sign(
    { id: userId },
    config.jwtSecret,
    { expiresIn: config.jwtExpiration }
  );
};

// Register a new user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists with this email' });
      return;
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role: role || 'user' // Default to 'user' if not specified
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id.toString());

    // Return user data (excluding password)
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('=== DEBUG: Login attempt ===');
    console.log('Database connection state:', require('mongoose').connection.readyState);
    console.log('Database name:', require('mongoose').connection.name);
    
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    // First, let's check if any users exist at all
    const totalUsers = await User.countDocuments({});
    console.log('Total users in database:', totalUsers);

    // Find user by email
    const user = await User.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('User not found for email:', email);
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    console.log('User details:', { 
      id: user._id, 
      email: user.email, 
      role: user.role, 
      isActive: user.isActive 
    });

    // Check if user is active
    if (!user.isActive) {
      console.log('User account is deactivated');
      res.status(401).json({ message: 'Account is deactivated' });
      return;
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch);
    
    if (!isMatch) {
      console.log('Password does not match');
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Update last login time
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id.toString());
    console.log('Token generated successfully');

    console.log('=== DEBUG: Login successful ===');

    // Return user data (excluding password)
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get current user profile
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // req.user is set by the auth middleware
    const userId = (req as any).user.id;
    
    const user = await User.findById(userId).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error fetching user data' });
  }
};

// Change password
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { currentPassword, newPassword } = req.body;
    const userId = (req as any).user.id;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      res.status(400).json({ message: 'Current password is incorrect' });
      return;
    }

    // Check if new password is different from current
    const isNewPasswordSame = await user.comparePassword(newPassword);
    if (isNewPasswordSame) {
      res.status(400).json({ message: 'New password must be different from current password' });
      return;
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error changing password' });
  }
};

// Update profile
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { name, email } = req.body;
    const userId = (req as any).user.id;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ message: 'Email is already taken' });
        return;
      }
    }

    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    // Return updated user without password
    const updatedUser = await User.findById(userId).select('-password');
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
}; 