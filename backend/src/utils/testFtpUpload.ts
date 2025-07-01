import { uploadFileToFTP, deleteFileFromFTP } from './ftpUpload.util';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';

/**
 * Test script to verify FTP upload functionality
 */
const testFtpUpload = async () => {
  console.log('Starting FTP upload test...');
  
  try {
    // Create a temporary test file
    const tempDir = os.tmpdir();
    const testFilePath = path.join(tempDir, 'test-upload.txt');
    
    // Write some content to the test file
    await fs.writeFile(testFilePath, 'This is a test file for FTP upload');
    console.log(`Created test file at: ${testFilePath}`);
    
    // Upload the file to FTP
    console.log('Uploading file to FTP...');
    const uploadResult = await uploadFileToFTP(testFilePath, 'test');
    console.log('Upload successful:', uploadResult);
    
    // Wait a moment to ensure the file is fully uploaded
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Delete the file from FTP
    console.log(`Deleting file with key: ${uploadResult.key}`);
    const deleteResult = await deleteFileFromFTP(uploadResult.key);
    console.log('Delete result:', deleteResult);
    
    // Clean up the local test file
    await fs.unlink(testFilePath);
    console.log('Test completed successfully!');
    
    return {
      success: true,
      uploadResult,
      deleteResult
    };
  } catch (error) {
    console.error('FTP test failed:', error);
    return {
      success: false,
      error
    };
  }
};

// Run the test if this script is executed directly
if (require.main === module) {
  testFtpUpload()
    .then(result => {
      console.log('Test result:', result);
      process.exit(result.success ? 0 : 1);
    })
    .catch(err => {
      console.error('Test error:', err);
      process.exit(1);
    });
}

export default testFtpUpload; 