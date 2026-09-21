const Career = require('../models/Career');
const Skill = require('../models/Skill');

exports.getAllCareers = async (req, res, next) => {
  try {
    const careers = await Career.find({ isActive: true })
      .populate('requiredSkills.skillId', 'name category icon')
      .sort({ title: 1 });
    res.json({ success: true, careers });
  } catch (err) {
    next(err);
  }
};

exports.getCareerById = async (req, res, next) => {
  try {
    const career = await Career.findById(req.params.id)
      .populate('requiredSkills.skillId', 'name category icon description');
    if (!career) {
      return res.status(404).json({ success: false, message: 'Career not found.' });
    }
    res.json({ success: true, career });
  } catch (err) {
    next(err);
  }
};

exports.createCareer = async (req, res, next) => {
  try {
    const career = await Career.create(req.body);
    res.status(201).json({ success: true, career });
  } catch (err) {
    next(err);
  }
};
