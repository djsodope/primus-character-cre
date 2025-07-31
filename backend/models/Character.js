const mongoose = require('mongoose');

/**
 * Character Schema for Primus Character Creator
 * Represents a D&D-style character with stats, skills, and metadata
 */
const characterSchema = new mongoose.Schema({
  // Basic character information
  name: {
    type: String,
    required: [true, 'Character name is required'],
    trim: true,
    minlength: [1, 'Character name must be at least 1 character'],
    maxlength: [50, 'Character name cannot exceed 50 characters']
  },
  
  // Character role/class system
  role: {
    type: String,
    required: [true, 'Character role is required'],
    enum: {
      values: ['DPS', 'Support', 'Tank'],
      message: '{VALUE} is not a valid role. Must be DPS, Support, or Tank'
    }
  },
  
  archetype: {
    type: String,
    required: [true, 'Character archetype is required'],
    trim: true,
    maxlength: [30, 'Archetype cannot exceed 30 characters']
  },
  
  // Character progression
  level: {
    type: Number,
    default: 1,
    min: [1, 'Level must be at least 1'],
    max: [20, 'Level cannot exceed 20']
  },
  
  // Core ability scores (D&D standard)
  stats: {
    STR: {
      type: Number,
      required: true,
      min: [1, 'STR must be at least 1'],
      max: [20, 'STR cannot exceed 20'],
      default: 10
    },
    DEX: {
      type: Number,
      required: true,
      min: [1, 'DEX must be at least 1'],
      max: [20, 'DEX cannot exceed 20'],
      default: 10
    },
    CON: {
      type: Number,
      required: true,
      min: [1, 'CON must be at least 1'],
      max: [20, 'CON cannot exceed 20'],
      default: 10
    },
    INT: {
      type: Number,
      required: true,
      min: [1, 'INT must be at least 1'],
      max: [20, 'INT cannot exceed 20'],
      default: 10
    },
    WIS: {
      type: Number,
      required: true,
      min: [1, 'WIS must be at least 1'],
      max: [20, 'WIS cannot exceed 20'],
      default: 10
    },
    CHA: {
      type: Number,
      required: true,
      min: [1, 'CHA must be at least 1'],
      max: [20, 'CHA cannot exceed 20'],
      default: 10
    }
  },
  
  // Character skills and abilities
  skills: [{
    type: String,
    trim: true,
    maxlength: [40, 'Skill name cannot exceed 40 characters']
  }],
  
  // Optional character background/flavor
  background: {
    type: String,
    trim: true,
    maxlength: [500, 'Background cannot exceed 500 characters']
  },
  
  // Equipment and inventory (optional)
  equipment: [{
    name: {
      type: String,
      trim: true,
      maxlength: [50, 'Equipment name cannot exceed 50 characters']
    },
    quantity: {
      type: Number,
      default: 1,
      min: [0, 'Quantity cannot be negative']
    }
  }]
}, {
  // Add timestamps for creation and updates
  timestamps: true,
  
  // Include version key for optimistic concurrency control
  versionKey: true
});

// Add indexes for better query performance
characterSchema.index({ name: 1 });
characterSchema.index({ role: 1 });
characterSchema.index({ level: 1 });
characterSchema.index({ createdAt: -1 });

// Add virtual for stat total (useful for character power level)
characterSchema.virtual('statTotal').get(function() {
  const { STR, DEX, CON, INT, WIS, CHA } = this.stats;
  return STR + DEX + CON + INT + WIS + CHA;
});

// Add virtual for stat modifier calculation (D&D standard)
characterSchema.virtual('statModifiers').get(function() {
  const calculateModifier = (score) => Math.floor((score - 10) / 2);
  
  return {
    STR: calculateModifier(this.stats.STR),
    DEX: calculateModifier(this.stats.DEX),
    CON: calculateModifier(this.stats.CON),
    INT: calculateModifier(this.stats.INT),
    WIS: calculateModifier(this.stats.WIS),
    CHA: calculateModifier(this.stats.CHA)
  };
});

// Ensure virtuals are included when converting to JSON
characterSchema.set('toJSON', { virtuals: true });
characterSchema.set('toObject', { virtuals: true });

// Pre-save middleware to ensure data consistency
characterSchema.pre('save', function(next) {
  // Ensure skills array doesn't have duplicates
  this.skills = [...new Set(this.skills.filter(skill => skill && skill.trim()))];
  next();
});

// Create and export the Character model
const Character = mongoose.model('Character', characterSchema);

module.exports = Character;