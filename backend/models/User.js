const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  education: {
    type: String,
    trim: true,
    default: ''
  },
  experienceLevel: {
    type: String,
    enum: ['fresher', 'junior', 'mid', 'senior', ''],
    default: ''
  },
  preferredJobType: {
    type: String,
    enum: ['full-time', 'part-time', 'freelance', 'internship', ''],
    default: ''
  },
  careerGoal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Career',
    default: null
  },
  skills: [{
    skillId: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill' },
    selfRating: { type: Number, min: 0, max: 100, default: 0 }
  }],
  profileComplete: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();
  const salt = await bcrypt.genSalt(12);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Remove sensitive data when converting to JSON
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
