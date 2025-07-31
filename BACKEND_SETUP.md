# Backend Setup Guide

This guide explains how to set up and connect the Primus Character Creator backend API.

## Quick Start (Development)

1. **Create a separate backend project directory:**
   ```bash
   mkdir primus-backend
   cd primus-backend
   npm init -y
   ```

2. **Install dependencies:**
   ```bash
   npm install express mongoose cors dotenv
   npm install -D nodemon
   ```

3. **Create the following file structure:**
   ```
   primus-backend/
   ├── server.js
   ├── models/
   │   └── Character.js
   ├── routes/
   │   └── characterRoutes.js
   ├── controllers/
   │   └── characterController.js
   └── .env
   ```

4. **Set up MongoDB Atlas:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free cluster
   - Get your connection string
   - Create a `.env` file with:
     ```
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/primus-characters
     PORT=5000
     ```

5. **Create the backend files** (see example files below)

6. **Start the backend:**
   ```bash
   npm run dev
   ```

7. **Update frontend environment:**
   - Make sure `.env` in your frontend has:
     ```
     VITE_API_URL=http://localhost:5000
     ```

## Example Backend Files

### server.js
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const characterRoutes = require('./routes/characterRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/characters', characterRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Primus Character Creator API is running' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

### models/Character.js
```javascript
const mongoose = require('mongoose');

const characterStatsSchema = new mongoose.Schema({
  strength: { type: Number, required: true, min: 1, max: 20 },
  dexterity: { type: Number, required: true, min: 1, max: 20 },
  constitution: { type: Number, required: true, min: 1, max: 20 },
  intelligence: { type: Number, required: true, min: 1, max: 20 },
  wisdom: { type: Number, required: true, min: 1, max: 20 },
  charisma: { type: Number, required: true, min: 1, max: 20 }
});

const characterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  level: {
    type: Number,
    required: true,
    min: 1,
    max: 20,
    default: 1
  },
  role: {
    type: String,
    required: true,
    enum: ['DPS', 'Support', 'Tank']
  },
  archetype: {
    type: String,
    required: true,
    trim: true
  },
  stats: {
    type: characterStatsSchema,
    required: true
  },
  skills: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Character', characterSchema);
```

### routes/characterRoutes.js
```javascript
const express = require('express');
const router = express.Router();
const {
  getAllCharacters,
  getCharacterById,
  createCharacter,
  updateCharacter,
  deleteCharacter
} = require('../controllers/characterController');

router.get('/', getAllCharacters);
router.get('/:id', getCharacterById);
router.post('/', createCharacter);
router.put('/:id', updateCharacter);
router.delete('/:id', deleteCharacter);

module.exports = router;
```

### controllers/characterController.js
```javascript
const Character = require('../models/Character');

// Get all characters
exports.getAllCharacters = async (req, res) => {
  try {
    const characters = await Character.find().sort({ createdAt: -1 });
    res.json(characters);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch characters', error: error.message });
  }
};

// Get single character
exports.getCharacterById = async (req, res) => {
  try {
    const character = await Character.findById(req.params.id);
    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }
    res.json(character);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch character', error: error.message });
  }
};

// Create new character
exports.createCharacter = async (req, res) => {
  try {
    const character = new Character(req.body);
    const savedCharacter = await character.save();
    res.status(201).json(savedCharacter);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create character', error: error.message });
  }
};

// Update character
exports.updateCharacter = async (req, res) => {
  try {
    const character = await Character.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }
    res.json(character);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update character', error: error.message });
  }
};

// Delete character
exports.deleteCharacter = async (req, res) => {
  try {
    const character = await Character.findByIdAndDelete(req.params.id);
    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }
    res.json({ message: 'Character deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete character', error: error.message });
  }
};
```

### package.json scripts
Add to your backend package.json:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

## Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Connect to Vercel
3. Add environment variable: `VITE_API_URL=https://your-backend-url.com`

### Backend (Render)
1. Push backend code to GitHub
2. Create new Web Service on Render
3. Add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `PORT`: 10000 (or leave empty for auto-assign)

### Backend (Railway)
1. Push to GitHub
2. Connect to Railway
3. Add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `PORT`: Leave empty for auto-assign

## Troubleshooting

### CORS Issues
If you get CORS errors, make sure your backend has:
```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'https://your-frontend-domain.com']
}));
```

### MongoDB Connection Issues
- Check your MongoDB Atlas whitelist (allow 0.0.0.0/0 for development)
- Verify your connection string format
- Make sure your database user has read/write permissions

### Frontend Connection Issues
- Check the browser network tab for failed requests
- Verify the `VITE_API_URL` environment variable
- The app will fall back to offline mode if the backend is unavailable

## Features

✅ **Offline Support**: App works without backend, using localStorage
✅ **Real-time Sync**: Automatic synchronization when backend is available  
✅ **Error Handling**: Graceful fallback and user notifications
✅ **Data Persistence**: MongoDB for reliable character storage
✅ **CRUD Operations**: Full create, read, update, delete functionality