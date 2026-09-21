const User = require('../models/User');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('careerGoal')
      .populate('skills.skillId');
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, education, experienceLevel, preferredJobType, careerGoal, skills } = req.body;

    const updateData = {};
    if (name)             updateData.name = name;
    if (education !== undefined) updateData.education = education;
    if (experienceLevel !== undefined) updateData.experienceLevel = experienceLevel;
    if (preferredJobType !== undefined) updateData.preferredJobType = preferredJobType;
    if (careerGoal !== undefined) updateData.careerGoal = careerGoal || null;
    if (skills !== undefined) updateData.skills = skills;

    // Mark profile as complete if key fields are set
    const currentUser = await User.findById(req.user._id);
    const mergedName = name || currentUser.name;
    const mergedCareer = careerGoal !== undefined ? careerGoal : currentUser.careerGoal;
    updateData.profileComplete = !!(mergedName && mergedCareer);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('careerGoal').populate('skills.skillId');

    res.json({ success: true, message: 'Profile updated.', user });
  } catch (err) {
    next(err);
  }
};
