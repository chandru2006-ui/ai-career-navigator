const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Frontend', 'Backend', 'Database', 'Language', 'DevOps', 'AI/ML', 'Security', 'Fundamentals', 'Blockchain', 'Cloud']
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: '💡'
  }
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);
