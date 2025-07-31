require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import routes
const characterRoutes = require('./routes/characterRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

/**
 * Middleware Configuration
 */

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

/**
 * Database Connection
 */
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/primus-characters', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});

/**
 * API Routes
 */

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Primus Character Creator API',
    version: '1.0.0'
  });
});

// Character routes
app.use('/api/characters', characterRoutes);

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
    availableEndpoints: {
      health: 'GET /health',
      characters: {
        list: 'GET /api/characters',
        get: 'GET /api/characters/:id',
        create: 'POST /api/characters',
        update: 'PUT /api/characters/:id',
        delete: 'DELETE /api/characters/:id'
      }
    }
  });
});

/**
 * Global Error Handler
 */
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

/**
 * Start Server
 */
app.listen(PORT, () => {
  console.log(`🚀 Primus Character Creator API running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS origin: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`\n🔗 Available endpoints:`);
    console.log(`   Health: http://localhost:${PORT}/health`);
    console.log(`   Characters: http://localhost:${PORT}/api/characters`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received. Shutting down gracefully...');
  
  mongoose.connection.close(() => {
    console.log('📴 MongoDB connection closed');
    process.exit(0);
  });
});

module.exports = app;