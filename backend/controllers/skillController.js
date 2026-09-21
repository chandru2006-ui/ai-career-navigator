const Skill = require('../models/Skill');

exports.getAllSkills = async (req, res, next) => {
  try {
    const skills = await Skill.find().sort({ category: 1, name: 1 });
    res.json({ success: true, skills });
  } catch (err) {
    next(err);
  }
};

exports.getSkillById = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found.' });
    res.json({ success: true, skill });
  } catch (err) {
    next(err);
  }
};
