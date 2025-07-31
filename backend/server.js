const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Import configuration and middleware
const connectDB = require('./config/database');
const { errorHandler, notFound, requestLogger } = require('./middleware/errorHandler');

// Import routes
const characterRoutes = require('./routes/characterRoutes');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize Express app
const app = express();

// Trust proxy for deployment platforms (Render, Railway, etc.)
app.set('trust proxy', 1);

// CORS configuration - allow frontend requests
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com'] // Replace with your actual frontend URL
    : ['http://localhost:3000', 'http://localhost:5173'], // Local development
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(requestLogger); // Log all requests

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Primus Character Creator API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/characters', characterRoutes);

// Root endpoint with API documentation
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '⚔️ Welcome to Primus Character Creator API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      characters: {
        'Create character': 'POST /api/characters',
        'Get all characters': 'GET /api/characters',
        'Get character by ID': 'GET /api/characters/:id',
        'Update character': 'PUT /api/characters/:id',
        'Delete character': 'DELETE /api/characters/:id',
        'Get statistics': 'GET /api/characters/stats'
      }
    },
    documentation: 'https://github.com/your-repo/primus-character-creator#api-documentation'
  });
});

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log('🚀 =================================');
  console.log(`⚔️  Primus Character Creator API`);
  console.log(`🌐 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Local URL: http://localhost:${PORT}`);
  console.log('🚀 =================================');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log('❌ Unhandled Promise Rejection:', err.message);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('❌ Uncaught Exception:', err.message);
  process.exit(1);
});

module.exports = app;