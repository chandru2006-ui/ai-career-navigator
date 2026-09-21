const mongoose = require('mongoose');

const assessmentResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assessmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true
  },
  careerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Career',
    required: true
  },
  skillScores: [{
    skillId: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill' },
    skillName: String,
    score: { type: Number, min: 0, max: 100 },
    proficiency: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
    },
    correctAnswers: Number,
    totalQuestions: Number
  }],
  skillGaps: [{
    skillId: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill' },
    skillName: String,
    currentLevel: Number,
    requiredLevel: Number,
    gap: Number,
    severity: {
      type: String,
      enum: ['None', 'Minimal', 'Low', 'Medium', 'High', 'Very High']
    },
    priority: String
  }],
  overallScore: {
    type: Number,
    min: 0,
    max: 100
  },
  careerReadiness: {
    type: Number,
    min: 0,
    max: 100
  },
  attemptNumber: {
    type: Number,
    default: 1
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

assessmentResultSchema.index({ userId: 1, careerId: 1, completedAt: -1 });

module.exports = mongoose.model('AssessmentResult', assessmentResultSchema);
