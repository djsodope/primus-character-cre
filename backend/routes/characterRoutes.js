const express = require('express');
const characterController = require('../controllers/characterController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * Character Routes
 * All routes require authentication via Firebase ID token
 */

// Apply authentication middleware to all character routes
router.use(authMiddleware);

// GET /api/characters - Get all characters for authenticated user
router.get('/', characterController.getAllCharacters);

// GET /api/characters/:id - Get single character by ID
router.get('/:id', characterController.getCharacterById);

// POST /api/characters - Create new character
router.post('/', characterController.createCharacter);

// PUT /api/characters/:id - Update existing character
router.put('/:id', characterController.updateCharacter);

// DELETE /api/characters/:id - Delete character
router.delete('/:id', characterController.deleteCharacter);

module.exports = router;