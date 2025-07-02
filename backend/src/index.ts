import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import path from 'path';
import config from './config/config';
import { initializeDatabase } from './utils/initDB';

// Import routes
import vehicleRoutes from './routes/vehicle.routes';
import authRoutes from './routes/auth.routes';
import uploadRoutes from './routes/upload.routes';
import adminRoutes from './routes/admin.routes';
import roleRoutes from './routes/role.routes';
import optionsRoutes from './routes/options.routes';

// Initialize Express app
const app = express();
const PORT = config.port;

// Middleware
app.use(helmet()); // Security headers

// Configure CORS using config values
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = Array.isArray(config.corsOrigin) 
      ? config.corsOrigin 
      : [config.corsOrigin];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
})); // Enable CORS

app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan('dev')); // Logging

// No longer serving static files locally as we're using Cloudflare hosting
// However, we'll keep this as a fallback for local file storage
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Use the MongoDB URI from config
const mongoUri = config.mongoUri;

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    console.log(`Using database: ${mongoUri.replace(/\/\/.*@/, '//***:***@')}`); // Hide credentials in logs
    
    await mongoose.connect(mongoUri, {
      // MongoDB connection options for Railway deployment
      retryWrites: true,
      w: 'majority',
      serverSelectionTimeoutMS: 10000, // Increased timeout for Railway
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
      // SSL options for Railway
      ssl: true,
      sslValidate: true,
    });
    console.log('MongoDB connected successfully');
    
    // Initialize database with roles if needed
    await initializeDatabase();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('Retrying connection in 10 seconds...');
    
    // Wait 10 seconds and try again (increased for Railway)
    setTimeout(connectDB, 10000);
  }
};

// Initial database connection
connectDB();

// MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected, attempting to reconnect...');
  connectDB();
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

// Routes
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/options', optionsRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'SS Holdings API Server',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      vehicles: '/api/vehicles',
      auth: '/api/auth',
      uploads: '/api/uploads',
      admin: '/api/admin',
      roles: '/api/roles',
      options: '/api/options'
    }
  });
});

// Health check route
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({ 
    status: 'ok', 
    message: 'Server is running',
    database: dbStatus
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Internal server error',
    error: config.nodeEnv === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${config.nodeEnv} mode`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Promise Rejection:', err);
  // Don't exit the process, just log the error
  // process.exit(1);
}); 