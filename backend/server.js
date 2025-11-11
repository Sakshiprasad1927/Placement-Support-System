/**
 * Backend server entrypoint
 * - Loads environment variables
 * - Connects to MongoDB
 * - Mounts API routes and static uploads directory
 * - Implements error handling
 */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

// Middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Route modules
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');
const companyRoutes = require('./routes/company');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 4000;

// Core middleware
app.use(cors()); // Enable CORS for frontend dev server
app.use(morgan('dev')); // Request logging
app.use(express.json()); // Parse application/json
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// Serve uploaded resumes and other files
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
app.use('/uploads', express.static(path.join(__dirname, uploadDir)));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'IGDTUW Placement API',
    version: '1.0.0',
  });
});

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

/**
 * Connect to MongoDB and start server
 */
async function connectDatabase() {
  try {
    const mongoUri = process.env.MONGO_URI;
    
    if (!mongoUri) {
      throw new Error('MONGO_URI environment variable is not defined');
    }

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✓ Connected to MongoDB');

    // Backward-compatibility: Drop legacy password index if exists
    await dropLegacyPasswordIndex();
  } catch (err) {
    console.error('✗ MongoDB connection failed:', err.message);
    throw err;
  }
}

/**
 * Drop legacy password index if it exists
 */
async function dropLegacyPasswordIndex() {
  try {
    const usersCollection = mongoose.connection.collection('users');
    const indexes = await usersCollection.indexes();
    const hasPasswordIndex = indexes.some(ix => ix.name === 'password_1');
    
    if (hasPasswordIndex) {
      console.log('Dropping legacy index password_1 on users collection');
      await usersCollection.dropIndex('password_1');
    }
  } catch (err) {
    // Non-fatal error, allow server to continue
    console.warn('Index check/drop warning:', err.message);
  }
}

/**
 * Start the server
 */
async function startServer() {
  try {
    await connectDatabase();
    
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`✓ API Base: http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('✗ Failed to start server:', err.message);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing server gracefully');
  await mongoose.connection.close();
  process.exit(0);
});

startServer();

