import { Router } from 'express';
import {
  getOptionsByCategory,
  getAllOptions,
  getOption,
  createOption,
  updateOption,
  deleteOption,
  updateOptionsOrder,
  uploadBrandImage
} from '../controllers/options.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';
import multer from 'multer';
import path from 'path';

const router = Router();

// Configure multer to use memory storage instead of disk storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Public routes - for getting options for forms
router.get('/category/:category', getOptionsByCategory);

// Admin routes - require authentication and admin permissions
router.use(protect);
router.use(adminOnly);

// Admin CRUD routes
router.get('/', getAllOptions);
router.get('/:id', getOption);
router.post('/', createOption);
router.put('/:id', updateOption);
router.delete('/:id', deleteOption);
router.put('/bulk/order', updateOptionsOrder);

// Brand image upload route
router.post('/:id/upload-image', upload.single('image'), uploadBrandImage);

export default router; 