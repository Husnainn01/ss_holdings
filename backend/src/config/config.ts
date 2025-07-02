import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface Config {
  port: number | string;
  nodeEnv: string;
  mongoUri: string;
  jwtSecret: string;
  jwtExpiration: string;
  corsOrigin: string | string[];
  cloudflare: {
    accountId: string;
    apiToken: string;
    imagesEndpoint: string;
  };
  cdn: {
    url: string;
    uploadsPath: string;
  };
}

const config: Config = {
  // Server configuration - Railway uses PORT 8080
  port: process.env.PORT || 8080,
  nodeEnv: process.env.NODE_ENV || 'production',
  
  // MongoDB configuration
  mongoUri: process.env.MONGODB_URI || 'mongodb+srv://ssholdings:D3MIteSgAONU5vk0@ssholdings.9aizwu5.mongodb.net/ssholdings?retryWrites=true&w=majority&ssl=true',
  
  // JWT configuration
  jwtSecret: process.env.JWT_SECRET || 'default_secret_change_this_in_production',
  jwtExpiration: process.env.JWT_EXPIRATION || '1d',
  
  // CORS configuration - handle both string and array
  corsOrigin: process.env.CORS_ORIGIN 
    ? (process.env.CORS_ORIGIN.includes(',') 
        ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
        : process.env.CORS_ORIGIN)
    : ['http://localhost:3000', 'http://localhost:3001', 'https://www.ss.holdings'],
  
  // Cloudflare configuration (for image storage)
  cloudflare: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID || '',
    apiToken: process.env.CLOUDFLARE_API_TOKEN || '',
    imagesEndpoint: process.env.CLOUDFLARE_IMAGES_ENDPOINT || ''
  },
  
  // CDN configuration
  cdn: {
    url: process.env.CDN_URL || 'https://cdn.ss.holdings',
    uploadsPath: '/uploads'
  }
};

export default config; 