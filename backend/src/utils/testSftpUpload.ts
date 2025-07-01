import { uploadFileToSFTP, deleteFileFromSFTP } from './sftpUpload.util';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';

/**
 * Test script to verify SFTP upload functionality
 */
const testSftpUpload = async () => {
  console.log('Starting SFTP upload test...');
  
  try {
    // Create a temporary test file
    const tempDir = os.tmpdir();
    const testFilePath = path.join(tempDir, 'test-upload.txt');
    
    // Write some content to the test file
    await fs.writeFile(testFilePath, 'This is a test file for SFTP upload');
    console.log(`Created test file at: ${testFilePath}`);
    
    // Upload the file to SFTP
    console.log('Uploading file to SFTP...');
    const uploadResult = await uploadFileToSFTP(testFilePath, 'test');
    console.log('Upload successful:', uploadResult);
    
    // Wait a moment to ensure the file is fully uploaded
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Delete the file from SFTP
    console.log(`Deleting file with key: ${uploadResult.key}`);
    const deleteResult = await deleteFileFromSFTP(uploadResult.key);
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
    console.error('SFTP test failed:', error);
    return {
      success: false,
      error
    };
  }
};

// Run the test if this script is executed directly
if (require.main === module) {
  testSftpUpload()
    .then(result => {
      console.log('Test result:', result);
      process.exit(result.success ? 0 : 1);
    })
    .catch(err => {
      console.error('Test error:', err);
      process.exit(1);
    });
}

export default testSftpUpload; 