import mongoose from 'mongoose';
import User, { ROLES } from '../models/user.model';
import Vehicle from '../models/vehicle.model';
import config from '../config/config';

// Function to initialize the database
export const initializeDatabase = async () => {
  try {
    console.log('Checking database status...');
    
    // Check if any users exist
    const userCount = await User.countDocuments();
    
    if (userCount > 0) {
      console.log('Database already initialized. Skipping initialization.');
      return;
    }
    
    console.log('No users found. Initializing database with roles...');
    
    // Create sample roles if they don't exist
    const roles = [
      {
        name: 'Admin',
        description: 'Full access to all resources',
        permissions: [
          { resource: 'users', actions: ['view', 'create', 'edit', 'delete'] },
          { resource: 'vehicles', actions: ['view', 'create', 'edit', 'delete'] },
          { resource: 'settings', actions: ['view', 'edit'] }
        ]
      },
      {
        name: 'Manager',
        description: 'Can manage most resources but with some restrictions',
        permissions: [
          { resource: 'users', actions: ['view'] },
          { resource: 'vehicles', actions: ['view', 'create', 'edit'] },
          { resource: 'settings', actions: ['view'] }
        ]
      },
      {
        name: 'Editor',
        description: 'Can edit content but cannot manage users or settings',
        permissions: [
          { resource: 'vehicles', actions: ['view', 'create', 'edit'] }
        ]
      },
      {
        name: 'User',
        description: 'Basic access with view-only permissions',
        permissions: [
          { resource: 'vehicles', actions: ['view'] }
        ]
      }
    ];
    
    // Create roles if they don't exist
    for (const role of roles) {
      const roleExists = await mongoose.connection.db.collection('roles').findOne({ name: role.name });
      
      if (!roleExists) {
        await mongoose.connection.db.collection('roles').insertOne({
          ...role,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log(`Role "${role.name}" created successfully`);
      } else {
        console.log(`Role "${role.name}" already exists`);
      }
    }
    
    console.log('Database initialization completed');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Run this script directly if needed
if (require.main === module) {
  // Connect to MongoDB
  mongoose.connect(config.mongoUri)
    .then(async () => {
      console.log('Connected to MongoDB');
      await initializeDatabase();
      process.exit(0);
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error);
      process.exit(1);
    });
} 