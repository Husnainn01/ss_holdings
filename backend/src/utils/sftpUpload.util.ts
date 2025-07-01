import Client from 'ssh2-sftp-client';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as crypto from 'crypto';
import config from '../config/config';

// SFTP configuration
const SFTP_CONFIG = {
  host: '136.0.157.42',
  port: 22, // Standard SFTP port
  username: 'ssholdings',
  password: 'ka;M;QK}3}Nrxza3',
  retries: 3,
  retry_factor: 2,
  retry_minTimeout: 2000
};

// Remote directory path on the server
// The path should be the absolute path on the server WITHOUT the cdn.ss.holdings duplication
const REMOTE_BASE_PATH = '/home/ssholdings/public_html';
const REMOTE_UPLOADS_PATH = `${REMOTE_BASE_PATH}/uploads`;

// Public URL base for accessing the uploaded files
const PUBLIC_URL_BASE = 'https://cdn.ss.holdings/uploads';

/**
 * Upload a file to the SFTP server
 * @param localFilePath Path to the local file
 * @param remoteDir Remote directory (relative to REMOTE_UPLOADS_PATH)
 * @returns Object with URL and file information
 */
export const uploadFileToSFTP = async (
  localFilePath: string,
  remoteDir: string = 'vehicles'
): Promise<{ url: string; key: string; publicId: string }> => {
  const sftp = new Client();
  
  try {
    console.log('========== SFTP UPLOAD STARTED ==========');
    console.log(`Local file path: ${localFilePath}`);
    console.log(`Remote directory: ${remoteDir}`);
    console.log(`Connecting to SFTP server: ${SFTP_CONFIG.host}:${SFTP_CONFIG.port}`);
    console.log(`Using credentials: ${SFTP_CONFIG.username} / ********`);
    
    // Connect to the SFTP server
    await sftp.connect(SFTP_CONFIG);
    console.log('SFTP connection successful');
    
    // Check if base directory exists
    try {
      const baseExists = await sftp.exists(REMOTE_BASE_PATH);
      console.log(`Base directory ${REMOTE_BASE_PATH} exists: ${baseExists}`);
      
      if (!baseExists) {
        throw new Error(`Base directory ${REMOTE_BASE_PATH} does not exist on the server`);
      }
    } catch (baseErr: any) {
      console.error(`Error checking base directory: ${baseErr.message}`);
      throw baseErr;
    }
    
    // Check if uploads directory exists
    try {
      const uploadsExists = await sftp.exists(REMOTE_UPLOADS_PATH);
      console.log(`Uploads directory ${REMOTE_UPLOADS_PATH} exists: ${uploadsExists}`);
      
      if (!uploadsExists) {
        console.log(`Creating uploads directory: ${REMOTE_UPLOADS_PATH}`);
        await sftp.mkdir(REMOTE_UPLOADS_PATH, true);
        console.log(`Created uploads directory: ${REMOTE_UPLOADS_PATH}`);
      }
    } catch (uploadsErr: any) {
      console.error(`Error checking/creating uploads directory: ${uploadsErr.message}`);
      throw uploadsErr;
    }
    
    // List the contents of the remote base directory to verify connection
    try {
      const list = await sftp.list(REMOTE_BASE_PATH);
      console.log(`Contents of ${REMOTE_BASE_PATH}:`, list.map(item => item.name).join(', '));
    } catch (listErr: any) {
      console.error(`Error listing ${REMOTE_BASE_PATH}:`, listErr.message);
      console.error('Will try to create the directory structure');
    }
    
    // Generate a unique filename to avoid collisions
    const fileExt = path.extname(localFilePath);
    const uniqueId = crypto.randomBytes(8).toString('hex');
    const fileName = `${uniqueId}${fileExt}`;
    
    // Ensure the remote directory exists
    const remoteDirPath = `${REMOTE_UPLOADS_PATH}/${remoteDir}`;
    console.log(`Ensuring remote directory exists: ${remoteDirPath}`);
    await ensureRemoteDir(sftp, remoteDirPath);
    
    // Verify the file exists locally before uploading
    if (!fs.existsSync(localFilePath)) {
      throw new Error(`Local file does not exist: ${localFilePath}`);
    }
    
    const fileStats = fs.statSync(localFilePath);
    console.log(`Local file size: ${fileStats.size} bytes`);
    
    // Upload the file
    const remoteFilePath = `${remoteDirPath}/${fileName}`;
    console.log(`Uploading file from ${localFilePath} to ${remoteFilePath}`);
    await sftp.put(localFilePath, remoteFilePath);
    
    // Verify the file was uploaded successfully
    try {
      const remoteStats = await sftp.stat(remoteFilePath);
      console.log(`Remote file size: ${remoteStats.size} bytes`);
      if (remoteStats.size !== fileStats.size) {
        console.warn(`Warning: Remote file size (${remoteStats.size}) does not match local file size (${fileStats.size})`);
      }
    } catch (statErr: any) {
      console.error(`Error checking remote file: ${remoteFilePath}`, statErr.message);
    }
    
    // Set file permissions to ensure it's readable by web server
    try {
      await sftp.chmod(remoteFilePath, 0o644);
      console.log(`Set permissions for file: ${remoteFilePath}`);
    } catch (chmodErr: any) {
      console.warn(`Warning: Could not set permissions for ${remoteFilePath}: ${chmodErr.message}`);
    }
    
    // Generate the public URL
    const publicUrl = `${PUBLIC_URL_BASE}/${remoteDir}/${fileName}`;
    console.log(`File uploaded successfully. Public URL: ${publicUrl}`);
    
    // Also log a direct HTTP URL for testing
    const httpUrl = `http://${SFTP_CONFIG.host}/uploads/${remoteDir}/${fileName}`;
    console.log(`Alternative HTTP URL for testing: ${httpUrl}`);
    
    console.log('========== SFTP UPLOAD COMPLETED ==========');
    
    return {
      url: publicUrl,
      key: `${remoteDir}/${fileName}`,
      publicId: uniqueId
    };
  } catch (err: any) {
    console.error('========== SFTP UPLOAD ERROR ==========');
    console.error('SFTP upload error:', err);
    
    // Enhanced error reporting
    if (err.code) {
      console.error(`Error code: ${err.code}`);
    }
    
    if (err.message && err.message.includes('connect')) {
      console.error('Connection failed. The SFTP server might be down or not accessible from your network.');
      console.error('Please check the SFTP server address and port.');
    } else if (err.message && err.message.includes('authentication')) {
      console.error('Authentication failed. Please check your username and password.');
    } else if (err.message && err.message.includes('permission')) {
      console.error('Permission denied or directory not found.');
    }
    
    throw new Error(`Failed to upload file to SFTP server: ${err.message}`);
  } finally {
    sftp.end();
  }
};

/**
 * Delete a file from the SFTP server
 * @param fileKey The key of the file to delete (e.g., 'vehicles/abc123.jpg')
 * @returns True if successful, false otherwise
 */
export const deleteFileFromSFTP = async (fileKey: string): Promise<boolean> => {
  const sftp = new Client();
  
  try {
    console.log(`Connecting to SFTP server to delete file: ${fileKey}`);
    await sftp.connect(SFTP_CONFIG);
    
    const remotePath = `${REMOTE_UPLOADS_PATH}/${fileKey}`;
    console.log(`Deleting file: ${remotePath}`);
    await sftp.delete(remotePath);
    console.log('File deleted successfully');
    return true;
  } catch (err: any) {
    console.error('SFTP delete error:', err);
    
    // Enhanced error reporting
    if (err.code) {
      console.error(`Error code: ${err.code}`);
    }
    
    if (err.message && err.message.includes('No such file')) {
      console.error('File not found.');
    } else if (err.message && err.message.includes('permission')) {
      console.error('Permission denied.');
    }
    
    return false;
  } finally {
    sftp.end();
  }
};

/**
 * Ensure a directory exists on the remote server
 * Creates it if it doesn't exist
 */
async function ensureRemoteDir(sftp: Client, dirPath: string): Promise<void> {
  try {
    console.log(`Checking if directory exists: ${dirPath}`);
    // Check if directory exists
    const exists = await sftp.exists(dirPath);
    
    if (exists) {
      console.log(`Directory exists: ${dirPath}`);
      return;
    }
    
    console.log(`Directory does not exist, creating: ${dirPath}`);
    // Create the directory and any parent directories
    await sftp.mkdir(dirPath, true);
    console.log(`Successfully created directory: ${dirPath}`);
    
    // Verify the directory was created
    const existsAfterCreate = await sftp.exists(dirPath);
    if (!existsAfterCreate) {
      throw new Error(`Failed to create directory: ${dirPath}`);
    }
    
    // Set permissions to ensure it's writable
    try {
      await sftp.chmod(dirPath, 0o755);
      console.log(`Set permissions for directory: ${dirPath}`);
    } catch (chmodErr: any) {
      console.warn(`Warning: Could not set permissions for ${dirPath}: ${chmodErr.message}`);
    }
  } catch (err: any) {
    console.error('Failed to create remote directory:', err);
    throw new Error(`Failed to create directory ${dirPath}: ${err.message}`);
  }
} 