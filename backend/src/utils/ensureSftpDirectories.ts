import Client from 'ssh2-sftp-client';

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
const REMOTE_BASE_PATH = '/home/ssholdings/public_html';
const REMOTE_UPLOADS_PATH = `${REMOTE_BASE_PATH}/uploads`;

/**
 * Ensures a remote directory exists, creating it if necessary
 * @param sftp SFTP client
 * @param dirPath Directory path
 */
const ensureRemoteDir = async (sftp: Client, dirPath: string): Promise<void> => {
  try {
    console.log(`Checking if directory exists: ${dirPath}`);
    const exists = await sftp.exists(dirPath);
    
    if (!exists) {
      console.log(`Directory does not exist, creating: ${dirPath}`);
      await sftp.mkdir(dirPath, true);
      console.log(`Successfully created directory: ${dirPath}`);
      
      // Set directory permissions
      try {
        await sftp.chmod(dirPath, 0o755);
        console.log(`Set permissions for directory: ${dirPath}`);
      } catch (err) {
        console.warn(`Warning: Could not set permissions for directory ${dirPath}`);
      }
    } else {
      console.log(`Directory already exists: ${dirPath}`);
    }
  } catch (err: any) {
    console.error(`Error ensuring directory exists: ${err.message}`);
    throw err;
  }
};

/**
 * Ensures all necessary directories exist on the SFTP server
 */
async function ensureSftpDirectories() {
  const sftp = new Client();
  
  try {
    console.log('========== ENSURING SFTP DIRECTORIES ==========');
    console.log(`Connecting to SFTP server: ${SFTP_CONFIG.host}:${SFTP_CONFIG.port}`);
    
    // Connect to the SFTP server
    await sftp.connect(SFTP_CONFIG);
    console.log('SFTP connection successful');
    
    // Check if base directory exists
    await ensureRemoteDir(sftp, REMOTE_BASE_PATH);
    
    // Ensure uploads directory exists
    await ensureRemoteDir(sftp, REMOTE_UPLOADS_PATH);
    
    // Ensure vehicles directory exists
    await ensureRemoteDir(sftp, `${REMOTE_UPLOADS_PATH}/vehicles`);
    
    // Ensure brands directory exists
    await ensureRemoteDir(sftp, `${REMOTE_UPLOADS_PATH}/brands`);
    
    // Ensure test directory exists
    await ensureRemoteDir(sftp, `${REMOTE_UPLOADS_PATH}/test`);
    
    console.log('========== ALL DIRECTORIES ENSURED ==========');
  } catch (err: any) {
    console.error('========== SFTP ERROR ==========');
    console.error('SFTP error:', err);
    
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
  } finally {
    sftp.end();
  }
}

// Run the function if this script is executed directly
if (require.main === module) {
  ensureSftpDirectories();
}

export default ensureSftpDirectories; 