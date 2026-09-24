const mongoose = require('mongoose');

const careerJourneySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  careerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Career',
    required: true
  },
  careerName: {
    type: String,
    required: true,
    trim: true
  },
  careerIcon: {
    type: String,
    default: '🎯'
  },
  selectedSkills: [{
    skillId: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill' },
    skillName: String,
    selfRating: { type: Number, min: 0, max: 100, default: 50 }
  }],
  status: {
    type: String,
    enum: ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'PAUSED'],
    default: 'NOT_STARTED'
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  isActive: {
    type: Boolean,
    default: true
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  },
  lastActivityAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
careerJourneySchema.index({ userId: 1, careerId: 1 });
careerJourneySchema.index({ userId: 1, updatedAt: -1 });
careerJourneySchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('CareerJourney', careerJourneySchema);
