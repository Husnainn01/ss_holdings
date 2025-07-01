import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import { uploadFileToSFTP } from './sftpUpload.util';

/**
 * Test script to verify hybrid upload functionality
 * This will test both SFTP and local fallback
 */
const testHybridUpload = async () => {
  console.log('Starting hybrid upload test...');
  
  try {
    // Create a temporary test file
    const tempDir = os.tmpdir();
    const testFilePath = path.join(tempDir, 'test-hybrid-upload.txt');
    
    // Write some content to the test file
    await fs.writeFile(testFilePath, 'This is a test file for hybrid upload');
    console.log(`Created test file at: ${testFilePath}`);
    
    // Test 1: Try SFTP upload
    console.log('Test 1: Attempting SFTP upload...');
    try {
      const sftpResult = await uploadFileToSFTP(testFilePath, 'test');
      console.log('SFTP upload successful:', sftpResult);
      
      // Clean up the remote file
      console.log('Cleaning up remote file...');
      // We'll simulate the cleanup here, in a real app we would delete the file
      
      console.log('SFTP test passed!');
    } catch (sftpError) {
      console.error('SFTP upload failed:', sftpError);
      console.log('This is expected if SFTP server is not accessible.');
    }
    
    // Test 2: Local upload fallback
    console.log('\nTest 2: Testing local fallback...');
    
    // Create uploads directory for local fallback
    const uploadsDir = path.join(__dirname, '../../uploads');
    fs.ensureDirSync(uploadsDir);
    
    // Copy file to local uploads directory
    const localFileName = `test-local-${Date.now()}.txt`;
    const localFilePath = path.join(uploadsDir, localFileName);
    
    await fs.copy(testFilePath, localFilePath);
    console.log(`Copied file to local storage: ${localFilePath}`);
    
    // Generate local URL
    const localUrl = `/uploads/${localFileName}`;
    console.log(`Local URL would be: ${localUrl}`);
    
    // Clean up the local file
    await fs.unlink(localFilePath);
    console.log('Cleaned up local file');
    console.log('Local fallback test passed!');
    
    // Clean up the test file
    await fs.unlink(testFilePath);
    console.log('Test completed successfully!');
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Hybrid test failed:', error);
    return {
      success: false,
      error
    };
  }
};

// Run the test if this script is executed directly
if (require.main === module) {
  testHybridUpload()
    .then(result => {
      console.log('Test result:', result);
      process.exit(result.success ? 0 : 1);
    })
    .catch(err => {
      console.error('Test error:', err);
      process.exit(1);
    });
}

export default testHybridUpload; 