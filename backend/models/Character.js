const mongoose = require('mongoose');

/**
 * Character Schema for Primus Character Creator
 * Includes ownerId to associate characters with Firebase users
 */
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
    max: 50,
    default: 1
  },
  role: {
    type: String,
    required: true,
    enum: ['DPS', 'Support', 'Tank'],
    trim: true
  },
  archetype: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  stats: {
    strength: {
      type: Number,
      required: true,
      min: 1,
      max: 30,
      default: 10
    },
    dexterity: {
      type: Number,
      required: true,
      min: 1,
      max: 30,
      default: 10
    },
    constitution: {
      type: Number,
      required: true,
      min: 1,
      max: 30,
      default: 10
    },
    intelligence: {
      type: Number,
      required: true,
      min: 1,
      max: 30,
      default: 10
    },
    wisdom: {
      type: Number,
      required: true,
      min: 1,
      max: 30,
      default: 10
    },
    charisma: {
      type: Number,
      required: true,
      min: 1,
      max: 30,
      default: 10
    }
  },
  skills: [{
    type: String,
    trim: true
  }],
  ownerId: {
    type: String,
    required: true,
    index: true, // Index for efficient queries by owner
    trim: true
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Index for efficient queries by owner
characterSchema.index({ ownerId: 1, createdAt: -1 });

// Validate that stats don't exceed point buy limits (optional business rule)
characterSchema.pre('save', function(next) {
  const totalStatPoints = Object.values(this.stats).reduce((sum, stat) => sum + stat, 0);
  const maxPoints = 90; // 6 stats × 15 average points each
  
  if (totalStatPoints > maxPoints) {
    return next(new Error(`Total stat points (${totalStatPoints}) exceed maximum allowed (${maxPoints})`));
  }
  
  next();
});

module.exports = mongoose.model('Character', characterSchema);