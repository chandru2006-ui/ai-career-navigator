const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  skillId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true
  },
  question: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: v => v.length === 4,
      message: 'Question must have exactly 4 options'
    }
  },
  correctAnswer: {
    type: Number,
    required: true,
    min: 0,
    max: 3
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard']
  },
  explanation: {
    type: String,
    default: ''
  },
  points: {
    type: Number,
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

questionSchema.index({ skillId: 1, difficulty: 1 });

module.exports = mongoose.model('Question', questionSchema);
