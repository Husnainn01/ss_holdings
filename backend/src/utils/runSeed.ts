import mongoose from 'mongoose';
import { initializeDatabase } from './initDB';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get the MongoDB URI from the environment or use the correct connection string
let MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ssholdings:D3MIteSgAONU5vk0@ssholdings.9aizwu5.mongodb.net/';

// Ensure the URI ends with the database name
if (!MONGODB_URI.includes('ssholdings')) {
  // Remove trailing slash if present
  if (MONGODB_URI.endsWith('/')) {
    MONGODB_URI = MONGODB_URI.slice(0, -1);
  }
  // Add the database name
  MONGODB_URI = `${MONGODB_URI}/ssholdings`;
}

console.log('Starting database seeding process...');
console.log('Connecting to MongoDB...');
console.log(`Using database: ${MONGODB_URI}`);

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB successfully');
    console.log('Running database initialization...');
    
    await initializeDatabase();
    
    console.log('Database seeding completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }); 