import express from 'express';
import { register, login, getCurrentUser } from '../controllers/auth.controller';
import { registerValidation, loginValidation } from '../middleware/validation.middleware';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// POST /api/auth/register - Register a new user
router.post('/register', registerValidation, register);

// POST /api/auth/login - Login a user
router.post('/login', loginValidation, login);

// GET /api/auth/me - Get current user profile (protected route)
router.get('/me', protect, getCurrentUser);

export default router; 