const mongoose = require('mongoose');

const roadmapSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  journeyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CareerJourney',
    default: null
  },
  careerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Career',
    required: true
  },
  assessmentResultId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AssessmentResult'
  },
  generatedBy: {
    type: String,
    enum: ['AI', 'system'],
    default: 'AI'
  },
  phases: [{
    phaseNumber: Number,
    title: String,
    duration: String,
    skills: [String],
    topics: [String],
    reason: String,
    practicalExercises: [String],
    resources: [String],
    status: {
      type: String,
      enum: ['not-started', 'in-progress', 'completed'],
      default: 'not-started'
    },
    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  }],
  overallProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  version: {
    type: Number,
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true
  },
  aiSummary: {
    type: String,
    default: ''
  }
}, { timestamps: true });

roadmapSchema.index({ userId: 1, careerId: 1, isActive: 1 });

module.exports = mongoose.model('Roadmap', roadmapSchema);
