import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import { uploadFileToSFTP } from './sftpUpload.util';

/**
 * This script tests the connection to the CDN by:
 * 1. Creating a test file
 * 2. Uploading it to the SFTP server
 * 3. Trying to access it via HTTP
 */
async function testCdnConnection() {
  try {
    console.log('=== CDN Connection Test ===');
    
    // 1. Create a test file
    const testFilePath = path.join(__dirname, '../../temp-test-file.txt');
    const testContent = `CDN Test File - ${new Date().toISOString()}`;
    
    console.log('Creating test file:', testFilePath);
    await fs.writeFile(testFilePath, testContent);
    
    // 2. Upload the test file to SFTP
    console.log('Uploading test file to SFTP server...');
    const uploadResult = await uploadFileToSFTP(testFilePath, 'test');
    console.log('Upload successful:', uploadResult);
    
    // 3. Try to access the file via HTTP
    console.log('Testing HTTP access to the uploaded file...');
    
    // Try different URL formats
    const urls = [
      uploadResult.url,
      uploadResult.url.replace('https://cdn.ss.holdings', 'http://cdn.ss.holdings'),
      uploadResult.url.replace('https://cdn.ss.holdings', 'https://mail.ss.holdings:2083/cdn.ss.holdings'),
      uploadResult.url.replace('https://cdn.ss.holdings', 'https://ss.holdings/cdn.ss.holdings')
    ];
    
    for (const url of urls) {
      try {
        console.log(`Testing URL: ${url}`);
        const response = await axios.get(url, { timeout: 5000 });
        
        if (response.status === 200) {
          console.log(`✅ SUCCESS: URL ${url} is accessible!`);
          console.log(`Response data: ${response.data}`);
          
          if (response.data === testContent) {
            console.log('✅ Content matches the uploaded file!');
          } else {
            console.log('❌ Content does not match the uploaded file.');
          }
        } else {
          console.log(`❌ ERROR: URL ${url} returned status ${response.status}`);
        }
      } catch (error: any) {
        console.log(`❌ ERROR accessing ${url}: ${error.message}`);
      }
    }
    
    // 4. Clean up
    console.log('Cleaning up test file...');
    await fs.remove(testFilePath);
    
    console.log('=== CDN Connection Test Complete ===');
  } catch (error: any) {
    console.error('Error during CDN connection test:', error.message);
  }
}

// Run the test
testCdnConnection();