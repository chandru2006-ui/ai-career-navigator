const AssessmentResult = require('../models/AssessmentResult');
const Roadmap = require('../models/Roadmap');
const ChatSession = require('../models/ChatSession');
const Career = require('../models/Career');

exports.getDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const careerId = req.user.careerGoal;

    // Latest assessment result
    const latestResult = await AssessmentResult.findOne({ userId })
      .populate('careerId', 'title icon')
      .populate('skillScores.skillId', 'name category')
      .populate('skillGaps.skillId', 'name category')
      .sort({ completedAt: -1 });

    // Previous result for comparison
    let previousResult = null;
    if (latestResult) {
      previousResult = await AssessmentResult.findOne({
        userId,
        careerId: latestResult.careerId,
        _id: { $ne: latestResult._id }
      }).sort({ completedAt: -1 });
    }

    // Active roadmap
    const roadmap = await Roadmap.findOne({ userId, isActive: true })
      .populate('careerId', 'title icon')
      .sort({ createdAt: -1 });

    // Assessment history count
    const assessmentCount = await AssessmentResult.countDocuments({ userId });

    // Recent chat sessions
    const recentChats = await ChatSession.find({ userId, isActive: true })
      .sort({ updatedAt: -1 })
      .limit(3)
      .select('title updatedAt');

    // Skill improvement summary (compare last two assessments)
    let skillImprovement = [];
    if (latestResult && previousResult) {
      skillImprovement = latestResult.skillScores.map(curr => {
        const prev = previousResult.skillScores.find(p => p.skillName === curr.skillName);
        return {
          skillName: curr.skillName,
          currentScore: curr.score,
          previousScore: prev ? prev.score : null,
          improvement: prev ? curr.score - prev.score : null
        };
      });
    }

    // Career goal details
    let careerDetails = null;
    if (careerId) {
      careerDetails = await Career.findById(careerId).populate('requiredSkills.skillId', 'name');
    }

    // Roadmap current phase
    const currentPhase = roadmap?.phases?.find(p => p.status === 'in-progress')
      || roadmap?.phases?.find(p => p.status === 'not-started');

    res.json({
      success: true,
      dashboard: {
        user: {
          name: req.user.name,
          education: req.user.education,
          experienceLevel: req.user.experienceLevel,
          careerGoal: careerDetails ? { _id: careerDetails._id, title: careerDetails.title } : null,
          profileComplete: req.user.profileComplete
        },
        latestResult,
        previousResult,
        skillImprovement,
        roadmap: roadmap ? {
          _id: roadmap._id,
          careerId: roadmap.careerId,
          overallProgress: roadmap.overallProgress,
          totalPhases: roadmap.phases.length,
          completedPhases: roadmap.phases.filter(p => p.status === 'completed').length,
          currentPhase: currentPhase || null,
          version: roadmap.version
        } : null,
        assessmentCount,
        recentChats,
        hasAssessment: !!latestResult,
        hasRoadmap: !!roadmap
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getSkillGaps = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const careerId = req.query.careerId || req.user.careerGoal;

    const query = { userId };
    if (careerId) query.careerId = careerId;

    const latestResult = await AssessmentResult.findOne(query)
      .populate('skillGaps.skillId', 'name category icon')
      .sort({ completedAt: -1 });

    if (!latestResult) {
      return res.json({ success: true, skillGaps: [], message: 'No assessment found.' });
    }

    res.json({
      success: true,
      skillGaps: latestResult.skillGaps,
      careerReadiness: latestResult.careerReadiness,
      completedAt: latestResult.completedAt
    });
  } catch (err) {
    next(err);
  }
};
