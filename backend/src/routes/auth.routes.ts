import express from 'express';
import { register, login, getCurrentUser, changePassword, updateProfile, verifyTurnstile } from '../controllers/auth.controller';
import { registerValidation, loginValidation, passwordChangeValidation, profileUpdateValidation } from '../middleware/validation.middleware';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// POST /api/auth/register - Register a new user
router.post('/register', registerValidation, register);

// POST /api/auth/login - Login a user
router.post('/login', loginValidation, login);

// GET /api/auth/me - Get current user profile (protected route)
router.get('/me', protect, getCurrentUser);

// PUT /api/auth/change-password - Change password (protected route)
router.put('/change-password', protect, passwordChangeValidation, changePassword);

// PUT /api/auth/update-profile - Update profile (protected route)
router.put('/update-profile', protect, profileUpdateValidation, updateProfile);

// POST /api/auth/verify-turnstile - Verify Turnstile token (public route)
router.post('/verify-turnstile', verifyTurnstile);

export default router; 