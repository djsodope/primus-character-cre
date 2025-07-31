const Character = require('../models/Character');

/**
 * Character Controller
 * Handles all CRUD operations for character management
 */

/**
 * Create a new character
 * POST /api/characters
 */
const createCharacter = async (req, res) => {
  try {
    // Validate required fields are present
    const { name, role, archetype, stats } = req.body;
    
    if (!name || !role || !archetype) {
      return res.status(400).json({
        success: false,
        error: 'Name, role, and archetype are required fields'
      });
    }

    // Create new character with validated data
    const character = new Character(req.body);
    const savedCharacter = await character.save();
    
    res.status(201).json({
      success: true,
      data: savedCharacter
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }
    
    // Handle other errors
    console.error('Error creating character:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create character'
    });
  }
};

/**
 * Get all characters
 * GET /api/characters
 */
const getAllCharacters = async (req, res) => {
  try {
    // Support query parameters for filtering and sorting
    const { role, level, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    // Build filter object
    const filter = {};
    if (role) filter.role = role;
    if (level) filter.level = parseInt(level);
    
    // Build sort object
    const sortOrder = order === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortOrder };
    
    const characters = await Character.find(filter)
      .sort(sort)
      .select('-__v'); // Exclude version key from response
    
    res.json({
      success: true,
      count: characters.length,
      data: characters
    });
  } catch (error) {
    console.error('Error fetching characters:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch characters'
    });
  }
};

/**
 * Get a single character by ID
 * GET /api/characters/:id
 */
const getCharacterById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid character ID format'
      });
    }
    
    const character = await Character.findById(id).select('-__v');
    
    if (!character) {
      return res.status(404).json({
        success: false,
        error: 'Character not found'
      });
    }
    
    res.json({
      success: true,
      data: character
    });
  } catch (error) {
    console.error('Error fetching character:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch character'
    });
  }
};

/**
 * Update a character
 * PUT /api/characters/:id
 */
const updateCharacter = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid character ID format'
      });
    }
    
    // Find and update character
    const character = await Character.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true, // Return updated document
        runValidators: true, // Run schema validation
        select: '-__v' // Exclude version key
      }
    );
    
    if (!character) {
      return res.status(404).json({
        success: false,
        error: 'Character not found'
      });
    }
    
    res.json({
      success: true,
      data: character
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }
    
    console.error('Error updating character:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update character'
    });
  }
};

/**
 * Delete a character
 * DELETE /api/characters/:id
 */
const deleteCharacter = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid character ID format'
      });
    }
    
    const character = await Character.findByIdAndDelete(id);
    
    if (!character) {
      return res.status(404).json({
        success: false,
        error: 'Character not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Character deleted successfully',
      data: { id: character._id, name: character.name }
    });
  } catch (error) {
    console.error('Error deleting character:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete character'
    });
  }
};

/**
 * Get character statistics (dashboard data)
 * GET /api/characters/stats
 */
const getCharacterStats = async (req, res) => {
  try {
    // Aggregate character statistics
    const stats = await Character.aggregate([
      {
        $group: {
          _id: null,
          totalCharacters: { $sum: 1 },
          averageLevel: { $avg: '$level' },
          roleDistribution: {
            $push: '$role'
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalCharacters: 1,
          averageLevel: { $round: ['$averageLevel', 1] },
          roleDistribution: 1
        }
      }
    ]);
    
    // Count characters by role
    const roleCounts = await Character.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const result = stats[0] || { totalCharacters: 0, averageLevel: 0 };
    result.roleBreakdown = roleCounts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error fetching character stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch character statistics'
    });
  }
};

module.exports = {
  createCharacter,
  getAllCharacters,
  getCharacterById,
  updateCharacter,
  deleteCharacter,
  getCharacterStats
};