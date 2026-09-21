const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  careerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Career',
    required: true
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'abandoned'],
    default: 'in-progress'
  },
  questions: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    skillId: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill' },
    difficulty: String,
    selectedAnswer: { type: Number, default: null },
    isCorrect: { type: Boolean, default: null },
    points: { type: Number, default: 1 },
    answeredAt: Date
  }],
  currentQuestionIndex: {
    type: Number,
    default: 0
  },
  currentDifficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy'
  },
  consecutiveCorrect: {
    type: Number,
    default: 0
  },
  consecutiveWrong: {
    type: Number,
    default: 0
  },
  totalQuestions: {
    type: Number,
    default: 30
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Assessment', assessmentSchema);
