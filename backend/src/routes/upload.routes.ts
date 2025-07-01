import express from 'express';
import { uploadImage, deleteImage } from '../controllers/upload.controller';
import { hybridUploadMiddleware } from '../utils/hybridUpload.middleware';
import { protect, adminOnly } from '../middleware/auth.middleware';

const router = express.Router();

// POST /api/uploads - Upload an image (admin only)
router.post('/', protect, adminOnly, hybridUploadMiddleware('image', 1), uploadImage);

// DELETE /api/uploads/:key - Delete an image (admin only)
router.delete('/:key', protect, adminOnly, deleteImage);

export default router; 