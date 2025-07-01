import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User, { ROLES } from '../models/user.model';
import Vehicle from '../models/vehicle.model';
import config from '../config/config';

// Load environment variables
dotenv.config();

// Sample users
const users = [
  {
    name: 'Admin User',
    email: 'admin@ssholdings.com',
    password: 'admin123',
    role: ROLES.ADMIN,
    isActive: true
  },
  {
    name: 'Manager User',
    email: 'manager@ssholdings.com',
    password: 'manager123',
    role: ROLES.MANAGER,
    isActive: true
  },
  {
    name: 'Editor User',
    email: 'editor@ssholdings.com',
    password: 'editor123',
    role: ROLES.EDITOR,
    isActive: true
  },
  {
    name: 'Regular User',
    email: 'user@ssholdings.com',
    password: 'user123',
    role: ROLES.USER,
    isActive: true
  }
];

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return false;
  }
};

// Seed database
const seedDatabase = async () => {
  try {
    // Connect to database
    const connected = await connectDB();
    if (!connected) {
      console.error('Failed to connect to database. Exiting...');
      process.exit(1);
    }

    // Clear existing data
    await User.deleteMany({});
    console.log('User data cleared');

    // Create users
    const saltRounds = 10;
    const userPromises = users.map(async (user) => {
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      
      return User.create({
        ...user,
        password: hashedPassword
      });
    });
    
    await Promise.all(userPromises);
    console.log('Users created');

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder
seedDatabase(); 