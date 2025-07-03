import multer from 'multer';
import path from 'path';
import fs from 'fs-extra';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { uploadFileToSFTP } from './sftpUpload.util';
import SftpUsage from '../models/sftpUsage.model';
import os from 'os';

// Create temporary directory for uploads
const tempDir = path.join(os.tmpdir(), 'ss-holdings-uploads');
fs.ensureDirSync(tempDir);

// Configure multer for temporary storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with original extension
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});

// File filter to allow only images
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

// Create multer upload instance for temporary storage
const multerUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Helper function to determine file type
const getFileType = (mimetype: string): 'images' | 'documents' | 'others' => {
  if (mimetype.startsWith('image/')) return 'images';
  if (mimetype.includes('pdf') || mimetype.includes('document') || mimetype.includes('text')) return 'documents';
  return 'others';
};

// Helper function to log SFTP usage
const logSftpUsage = async (files: Express.Multer.File[]) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const file of files) {
      const fileType = getFileType(file.mimetype);
      const fileSizeMB = file.size / (1024 * 1024);

      // Log individual file upload
      await SftpUsage.create({
        date: today,
        uploadsCount: 1,
        totalSizeBytes: file.size,
        totalSizeMB: fileSizeMB,
        fileTypes: {
          images: fileType === 'images' ? 1 : 0,
          documents: fileType === 'documents' ? 1 : 0,
          others: fileType === 'others' ? 1 : 0
        },
        operationType: 'upload',
        filePath: file.path,
        fileName: file.originalname,
        fileSize: file.size
      });
    }

    console.log(`SFTP Usage logged: ${files.length} files uploaded, ${files.reduce((sum, f) => sum + f.size, 0)} bytes`);
  } catch (error) {
    console.error('Error logging SFTP usage:', error);
  }
};

/**
 * Middleware to handle file uploads via SFTP
 * 1. First saves files to temporary storage using multer
 * 2. Then uploads files to SFTP server
 * 3. Adds file information to request object
 * 4. Cleans up temporary files
 */
export const sftpUploadMiddleware = (fieldName: string = 'images', maxCount: number = 40) => {
  // Use multer to handle the initial file upload to temp storage
  const multerMiddleware = multerUpload.array(fieldName, maxCount);

  return (req: Request, res: Response, next: NextFunction) => {
    multerMiddleware(req, res, async (err) => {
      if (err) {
        return next(err);
      }

      // If no files were uploaded, continue
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return next();
      }

      try {
        // Upload each file to SFTP server
        const uploadPromises = req.files.map(async (file: Express.Multer.File, index: number) => {
          // Upload to SFTP
          const sftpResult = await uploadFileToSFTP(file.path, 'vehicles');
          
          // Add additional information to the file object
          const enhancedFile = {
            ...file,
            path: sftpResult.url, // Replace local path with SFTP URL
            location: sftpResult.url, // For compatibility with S3-style code
            key: sftpResult.key,
            publicId: sftpResult.publicId,
            isMain: index === 0 // First file is main by default
          };
          
          // Clean up temporary file
          await fs.unlink(file.path);
          
          return enhancedFile;
        });
        
        // Wait for all uploads to complete
        const uploadedFiles = await Promise.all(uploadPromises);
        
        // Replace the files array with the enhanced files
        req.files = uploadedFiles;
        
        // Log SFTP usage
        await logSftpUsage(req.files);
        
        next();
      } catch (error: any) {
        // Clean up any temporary files
        if (req.files && Array.isArray(req.files)) {
          await Promise.all(req.files.map(file => fs.unlink(file.path).catch(() => {})));
        }
        
        console.error('SFTP upload middleware error:', error);
        return next(new Error(`File upload failed: ${error.message}`));
      }
    });
  };
};

export default sftpUploadMiddleware; 