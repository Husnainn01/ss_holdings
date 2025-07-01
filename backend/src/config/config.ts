import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const config = {
  // Server configuration
  port: process.env.PORT || 5001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // MongoDB configuration
  mongoUri: process.env.MONGODB_URI || 'mongodb+srv://ssholdings:D3MIteSgAONU5vk0@ssholdings.9aizwu5.mongodb.net/ssholdings',
  
  // JWT configuration
  jwtSecret: process.env.JWT_SECRET || 'default_secret_change_this_in_production',
  jwtExpiration: process.env.JWT_EXPIRATION || '1d',
  
  // CORS configuration
  corsOrigin: process.env.CORS_ORIGIN || ['http://localhost:3000', 'http://localhost:3001'],
  
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