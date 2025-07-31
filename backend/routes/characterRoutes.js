const express = require('express');
const router = express.Router();
const {
  createCharacter,
  getAllCharacters,
  getCharacterById,
  updateCharacter,
  deleteCharacter,
  getCharacterStats
} = require('../controllers/characterController');

/**
 * Character Routes for Primus Character Creator API
 * All routes are prefixed with /api/characters
 */

// GET /api/characters/stats - Get character statistics (must come before /:id route)
router.get('/stats', getCharacterStats);

// POST /api/characters - Create a new character
router.post('/', createCharacter);

// GET /api/characters - Get all characters (with optional filtering)
router.get('/', getAllCharacters);

// GET /api/characters/:id - Get a single character by ID
router.get('/:id', getCharacterById);

// PUT /api/characters/:id - Update a character
router.put('/:id', updateCharacter);

// DELETE /api/characters/:id - Delete a character
router.delete('/:id', deleteCharacter);

module.exports = router;