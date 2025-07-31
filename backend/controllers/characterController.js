const Character = require('../models/Character');

/**
 * Character Controller - Handles all character CRUD operations
 * All operations are scoped to the authenticated user's ownerId
 */
const characterController = {
  
  /**
   * GET /api/characters
   * Get all characters for the authenticated user
   */
  async getAllCharacters(req, res) {
    try {
      const characters = await Character.find({ ownerId: req.user.uid })
        .sort({ createdAt: -1 }); // Most recent first
      
      res.json(characters);
    } catch (error) {
      console.error('Get characters error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to retrieve characters'
      });
    }
  },

  /**
   * GET /api/characters/:id
   * Get a single character by ID (must belong to authenticated user)
   */
  async getCharacterById(req, res) {
    try {
      const character = await Character.findOne({ 
        _id: req.params.id, 
        ownerId: req.user.uid 
      });
      
      if (!character) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Character not found'
        });
      }
      
      res.json(character);
    } catch (error) {
      console.error('Get character error:', error);
      
      // Handle invalid ObjectId
      if (error.name === 'CastError') {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Invalid character ID'
        });
      }
      
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to retrieve character'
      });
    }
  },

  /**
   * POST /api/characters
   * Create a new character for the authenticated user
   */
  async createCharacter(req, res) {
    try {
      const { name, level, role, archetype, stats, skills } = req.body;
      
      // Validate required fields
      if (!name || !role || !archetype || !stats) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Missing required fields: name, role, archetype, and stats are required'
        });
      }

      // Create new character with owner ID
      const character = new Character({
        name,
        level: level || 1,
        role,
        archetype,
        stats,
        skills: skills || [],
        ownerId: req.user.uid
      });

      const savedCharacter = await character.save();
      
      res.status(201).json(savedCharacter);
    } catch (error) {
      console.error('Create character error:', error);
      
      // Handle validation errors
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Invalid character data',
          details: validationErrors
        });
      }
      
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to create character'
      });
    }
  },

  /**
   * PUT /api/characters/:id
   * Update an existing character (must belong to authenticated user)
   */
  async updateCharacter(req, res) {
    try {
      const { name, level, role, archetype, stats, skills } = req.body;
      
      // Find and update character (only if owned by user)
      const character = await Character.findOneAndUpdate(
        { _id: req.params.id, ownerId: req.user.uid },
        {
          name,
          level,
          role,
          archetype,
          stats,
          skills
        },
        { 
          new: true, // Return updated document
          runValidators: true // Run schema validations
        }
      );
      
      if (!character) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Character not found'
        });
      }
      
      res.json(character);
    } catch (error) {
      console.error('Update character error:', error);
      
      // Handle validation errors
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Invalid character data',
          details: validationErrors
        });
      }
      
      // Handle invalid ObjectId
      if (error.name === 'CastError') {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Invalid character ID'
        });
      }
      
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to update character'
      });
    }
  },

  /**
   * DELETE /api/characters/:id
   * Delete a character (must belong to authenticated user)
   */
  async deleteCharacter(req, res) {
    try {
      const character = await Character.findOneAndDelete({ 
        _id: req.params.id, 
        ownerId: req.user.uid 
      });
      
      if (!character) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Character not found'
        });
      }
      
      res.json({
        message: 'Character deleted successfully',
        deletedCharacter: character
      });
    } catch (error) {
      console.error('Delete character error:', error);
      
      // Handle invalid ObjectId
      if (error.name === 'CastError') {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Invalid character ID'
        });
      }
      
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to delete character'
      });
    }
  }
};

module.exports = characterController;