import * as ftp from 'basic-ftp';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as crypto from 'crypto';

// FTP configuration
const FTP_CONFIG = {
  host: '136.0.157.42',
  user: 'ssholdings',
  password: 'ka;M;QK}3}Nrxza3',
  secure: false, // Set to true if using FTPS
  port: 22, // Default FTP port
  timeout: 30000 // 30 seconds timeout
};

// Remote directory path on the server
const REMOTE_BASE_PATH = '/home/ssholdings/public_html';
const REMOTE_UPLOADS_PATH = `${REMOTE_BASE_PATH}/uploads`;

// Public URL base for accessing the uploaded files
const PUBLIC_URL_BASE = 'https://ss.holdings/uploads';

/**
 * Upload a file to the FTP server
 * @param localFilePath Path to the local file
 * @param remoteDir Remote directory (relative to REMOTE_UPLOADS_PATH)
 * @returns Object with URL and file information
 */
export const uploadFileToFTP = async (
  localFilePath: string,
  remoteDir: string = 'vehicles'
): Promise<{ url: string; key: string; publicId: string }> => {
  const client = new ftp.Client();
  client.ftp.verbose = true; // Enable verbose logging for debugging
  
  try {
    console.log(`Connecting to FTP server: ${FTP_CONFIG.host}:${FTP_CONFIG.port}`);
    console.log(`Using credentials: ${FTP_CONFIG.user} / ********`);
    
    // Connect to the FTP server with additional options
    await client.access({
      ...FTP_CONFIG,
      secureOptions: {
        rejectUnauthorized: false // Accept self-signed certificates
      }
    });
    
    console.log('FTP connection successful');
    
    // Generate a unique filename to avoid collisions
    const fileExt = path.extname(localFilePath);
    const uniqueId = crypto.randomBytes(8).toString('hex');
    const fileName = `${uniqueId}${fileExt}`;
    
    // Ensure the remote directory exists
    const remoteDirPath = `${REMOTE_UPLOADS_PATH}/${remoteDir}`;
    console.log(`Ensuring remote directory exists: ${remoteDirPath}`);
    await ensureRemoteDir(client, remoteDirPath);
    
    // Upload the file
    const remoteFilePath = `${remoteDirPath}/${fileName}`;
    console.log(`Uploading file from ${localFilePath} to ${remoteFilePath}`);
    await client.uploadFrom(localFilePath, remoteFilePath);
    
    // Generate the public URL
    const publicUrl = `${PUBLIC_URL_BASE}/${remoteDir}/${fileName}`;
    console.log(`File uploaded successfully. Public URL: ${publicUrl}`);
    
    return {
      url: publicUrl,
      key: `${remoteDir}/${fileName}`,
      publicId: uniqueId
    };
  } catch (err: any) {
    console.error('FTP upload error:', err);
    
    // Enhanced error reporting
    if (err.code) {
      console.error(`Error code: ${err.code}`);
    }
    
    if (err.message && err.message.includes('ECONNREFUSED')) {
      console.error('Connection refused. The FTP server might be down or not accessible from your network.');
      console.error('Please check the FTP server address and port.');
    } else if (err.message && err.message.includes('530')) {
      console.error('Authentication failed. Please check your username and password.');
    } else if (err.message && err.message.includes('550')) {
      console.error('Permission denied or directory not found.');
    }
    
    throw new Error(`Failed to upload file to FTP server: ${err.message}`);
  } finally {
    client.close();
  }
};

/**
 * Delete a file from the FTP server
 * @param fileKey The key of the file to delete (e.g., 'vehicles/abc123.jpg')
 * @returns True if successful, false otherwise
 */
export const deleteFileFromFTP = async (fileKey: string): Promise<boolean> => {
  const client = new ftp.Client();
  client.ftp.verbose = true; // Enable verbose logging for debugging
  
  try {
    console.log(`Connecting to FTP server to delete file: ${fileKey}`);
    await client.access({
      ...FTP_CONFIG,
      secureOptions: {
        rejectUnauthorized: false
      }
    });
    
    const remotePath = `${REMOTE_UPLOADS_PATH}/${fileKey}`;
    console.log(`Deleting file: ${remotePath}`);
    await client.remove(remotePath);
    console.log('File deleted successfully');
    return true;
  } catch (err: any) {
    console.error('FTP delete error:', err);
    
    // Enhanced error reporting
    if (err.code) {
      console.error(`Error code: ${err.code}`);
    }
    
    if (err.message && err.message.includes('550')) {
      console.error('File not found or permission denied.');
    }
    
    return false;
  } finally {
    client.close();
  }
};

/**
 * Ensure a directory exists on the remote server
 * Creates it if it doesn't exist
 */
async function ensureRemoteDir(client: ftp.Client, dirPath: string): Promise<void> {
  try {
    console.log(`Checking if directory exists: ${dirPath}`);
    // Try to change to the directory to check if it exists
    await client.cd(dirPath);
    console.log(`Directory exists: ${dirPath}`);
  } catch (err) {
    console.log(`Directory does not exist, creating: ${dirPath}`);
    // If directory doesn't exist, create it
    try {
      // Create parent directories recursively
      const parts = dirPath.split('/').filter(Boolean);
      let currentPath = '';
      
      for (const part of parts) {
        currentPath += '/' + part;
        try {
          console.log(`Checking path: ${currentPath}`);
          await client.cd(currentPath);
          console.log(`Path exists: ${currentPath}`);
        } catch (e) {
          console.log(`Creating directory: ${currentPath}`);
          await client.send('MKD ' + currentPath); // Create directory
        }
      }
      
      // Change to the target directory to confirm it was created
      await client.cd(dirPath);
      console.log(`Successfully created and verified directory: ${dirPath}`);
    } catch (createErr: any) {
      console.error('Failed to create remote directory:', createErr);
      throw new Error(`Failed to create directory ${dirPath}: ${createErr.message}`);
    }
  }
} 