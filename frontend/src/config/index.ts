/**
 * Application configuration
 * This file centralizes all configuration values and provides fallbacks
 */

// API URLs
export const API_URL_DEV = process.env.NEXT_PUBLIC_API_URL_DEV || 'http://localhost:5001/api';
export const API_URL = process.env.NEXT_PUBLIC_API_URL || API_URL_DEV; // Default to dev URL if not specified

// CDN URLs
export const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL || 'https://cdn.ss.holdings';

// Site information
export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'SS Holdings';
export const SITE_DESCRIPTION = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Global Auto Exports';

// Default language
export const DEFAULT_LANGUAGE = process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en';

// SFTP Configuration
export const SFTP_HOST = process.env.NEXT_PUBLIC_SFTP_HOST || 'mail.ss.holdings';
export const SFTP_PORT = parseInt(process.env.NEXT_PUBLIC_SFTP_PORT || '22', 10);
export const SFTP_USERNAME = process.env.NEXT_PUBLIC_SFTP_USERNAME || 'ssholdings';
export const SFTP_PASSWORD = process.env.NEXT_PUBLIC_SFTP_PASSWORD || 'QQ?pBRTj$Zm4v57TDMf6d3dv&m';

// Function to get the appropriate API URL based on the environment
export const getApiBaseUrl = () => {
  // Always prioritize the development API URL when in development mode
  if (process.env.NODE_ENV === 'development') {
    console.log('Using development API URL:', API_URL_DEV);
    return API_URL_DEV;
  }
  
  // Check if we're on the server
  if (typeof window === 'undefined') {
    // Server-side: use environment variables
    return API_URL;
  } else {
    // Client-side: check the current origin and use environment variables
    try {
      // Safe access to window.location
      const origin = window.location?.origin;
      if (origin && (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
        console.log('Detected localhost, using development API URL:', API_URL_DEV);
        return API_URL_DEV;
      }
    } catch (e) {
      console.error('Error accessing window.location:', e);
    }
  }
  
  // Default to API_URL which now defaults to API_URL_DEV if not specified
  return API_URL;
};

// Export default config object
const config = {
  apiUrl: getApiBaseUrl(),
  cdnUrl: CDN_URL,
  siteName: SITE_NAME,
  siteDescription: SITE_DESCRIPTION,
  defaultLanguage: DEFAULT_LANGUAGE,
  sftp: {
    host: SFTP_HOST,
    port: SFTP_PORT,
    username: SFTP_USERNAME,
    password: SFTP_PASSWORD
  }
};

export default config;
