import multer from 'multer';
import path from 'path';
import fs from 'fs-extra';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { uploadFileToSFTP } from './sftpUpload.util';
import os from 'os';
import config from '../config/config';

// Create temporary directory for uploads
const tempDir = path.join(os.tmpdir(), 'ss-holdings-uploads');
fs.ensureDirSync(tempDir);
console.log(`Temporary uploads directory: ${tempDir}`);

// File filter to allow only images
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    console.log(`Accepting file: ${file.originalname} (${file.mimetype})`);
    cb(null, true);
  } else {
    console.log(`Rejecting file: ${file.originalname} (${file.mimetype})`);
    cb(new Error('Only image files are allowed'));
  }
};

// Configure multer for temporary storage
const tempStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(`Storing file temporarily in: ${tempDir}`);
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with original extension
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    console.log(`Generated temporary filename: ${uniqueFilename} for ${file.originalname}`);
    cb(null, uniqueFilename);
  }
});

// Create multer upload instance for temporary storage
const multerTempUpload = multer({
  storage: tempStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

/**
 * Middleware to handle file uploads with SFTP
 * 1. First saves files to temporary storage using multer
 * 2. Uploads files to SFTP server
 * 3. Adds file information to request object
 * 4. Cleans up temporary files
 */
export const hybridUploadMiddleware = (fieldName: string = 'images', maxCount: number = 40) => {
  // Use multer to handle the initial file upload to temp storage
  const multerMiddleware = multerTempUpload.array(fieldName, maxCount);

  return (req: Request, res: Response, next: NextFunction) => {
    console.log(`Starting upload middleware for field: ${fieldName}, max count: ${maxCount}`);
    
    multerMiddleware(req, res, async (err) => {
      if (err) {
        console.error('Multer error:', err);
        return next(err);
      }

      // If no files were uploaded, continue
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        console.log('No files uploaded, continuing...');
        return next();
      }

      console.log(`Processing ${req.files.length} uploaded files`);

      try {
        // Upload each file to SFTP server
        const uploadPromises = req.files.map(async (file: Express.Multer.File, index: number) => {
          try {
            // Verify the file exists before uploading
            if (!fs.existsSync(file.path)) {
              throw new Error(`Temporary file does not exist: ${file.path}`);
            }
            
            const fileStats = fs.statSync(file.path);
            console.log(`File stats: size=${fileStats.size}, isFile=${fileStats.isFile()}`);
            
            console.log(`Uploading file to SFTP: ${file.originalname} (${file.path})`);
            const sftpResult = await uploadFileToSFTP(file.path, 'vehicles');
            
            console.log(`SFTP upload successful for ${file.originalname}.`);
            console.log(`URL: ${sftpResult.url}`);
            console.log(`Key: ${sftpResult.key}`);
            
            // Add additional information to the file object
            const enhancedFile = {
              ...file,
              path: sftpResult.url, // Replace local path with SFTP URL
              location: sftpResult.url, // For compatibility with S3-style code
              key: sftpResult.key,
              publicId: sftpResult.publicId,
              isMain: index === 0, // First file is main by default
              storageType: 'sftp'
            };
            
            // Clean up temporary file
            await fs.unlink(file.path);
            console.log(`Cleaned up temporary file: ${file.path}`);
            
            return enhancedFile;
          } catch (sftpError: any) {
            // SFTP upload failed, log detailed error
            console.error(`SFTP upload failed for ${file.originalname}:`, sftpError);
            console.error(`Error message: ${sftpError.message}`);
            console.error(`Error stack: ${sftpError.stack}`);
            
            // Clean up temporary file
            try {
              await fs.unlink(file.path);
              console.log(`Cleaned up temporary file: ${file.path}`);
            } catch (unlinkError) {
              console.error(`Failed to clean up temporary file: ${file.path}`, unlinkError);
            }
            
            // Re-throw the error to be caught by the outer try/catch
            throw new Error(`SFTP upload failed: ${sftpError.message}`);
          }
        });
        
        // Wait for all uploads to complete
        const uploadedFiles = await Promise.all(uploadPromises);
        console.log('All files processed successfully');
        
        // Log the final files array
        console.log('Final files array:', uploadedFiles.map(file => ({
          originalname: file.originalname,
          path: file.path,
          location: file.location,
          key: file.key,
          publicId: file.publicId,
          storageType: file.storageType
        })));
        
        // Replace the files array with the enhanced files
        req.files = uploadedFiles;
        
        next();
      } catch (error: any) {
        // Clean up any temporary files
        if (req.files && Array.isArray(req.files)) {
          console.log('Cleaning up temporary files due to error');
          await Promise.all(req.files.map(file => fs.unlink(file.path).catch(() => {})));
        }
        
        console.error('Upload middleware error:', error);
        console.error(`Error message: ${error.message}`);
        console.error(`Error stack: ${error.stack}`);
        return next(new Error(`File upload failed: ${error.message}`));
      }
    });
  };
};

export default hybridUploadMiddleware; 