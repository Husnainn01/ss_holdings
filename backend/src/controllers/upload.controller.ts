import { Request, Response } from 'express';
import fs from 'fs-extra';
import path from 'path';
import { deleteFileFromSFTP } from '../utils/sftpUpload.util';
import config from '../config/config';

// Upload image
export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if file exists
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    // File was uploaded successfully by the upload middleware
    const file = req.file as any; // Type assertion to access custom properties
    
    // Create response with file details
    const fileDetails = {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: file.location || file.path, // URL from upload
      key: file.key, // File key for future reference (for deletion)
      publicId: file.publicId, // Public ID for reference
      storageType: file.storageType || 'unknown' // Storage type (sftp or local)
    };

    res.status(200).json({
      message: 'File uploaded successfully',
      file: fileDetails
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Server error uploading file' });
  }
};

// Delete image
export const deleteImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { key } = req.params;
    
    if (!key) {
      res.status(400).json({ message: 'File key is required' });
      return;
    }

    // Check if this is a local file or SFTP file
    // If the key contains a slash, it's likely an SFTP path
    const isRemoteFile = key.includes('/');
    
    let deleted = false;
    
    if (isRemoteFile) {
      // Delete file from SFTP server
      deleted = await deleteFileFromSFTP(key);
    } else {
      // Delete local file
      try {
        const filePath = path.join(__dirname, '../../uploads', key);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          deleted = true;
        }
      } catch (err) {
        console.error('Error deleting local file:', err);
      }
    }

    if (!deleted) {
      res.status(404).json({ message: 'File not found or could not be deleted' });
      return;
    }

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ message: 'Server error deleting file' });
  }
}; 