import express from 'express';
import { sendContactMessage, sendCarInquiry } from '../controllers/contact.controller';

const router = express.Router();

// @route   POST /api/contact/message
// @desc    Send contact form message
// @access  Public
router.post('/message', sendContactMessage);

// @route   POST /api/contact/car-inquiry
// @desc    Send car inquiry message
// @access  Public
router.post('/car-inquiry', sendCarInquiry);

export default router; 