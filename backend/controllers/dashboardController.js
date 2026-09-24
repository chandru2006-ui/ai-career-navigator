const AssessmentResult = require('../models/AssessmentResult');
const Roadmap = require('../models/Roadmap');
const ChatSession = require('../models/ChatSession');
const Career = require('../models/Career');
const CareerJourney = require('../models/CareerJourney');

exports.getDashboard = async (req, res, next) => {
  try {
    const userId  = req.user._id;
    const careerId = req.user.careerGoal;

    // ── Find the active journey for the current career goal ──────────────────
    // The dashboard represents the ACTIVE journey, not a mix of all journeys.
    let activeJourney = null;
    if (careerId) {
      activeJourney = await CareerJourney.findOne({
        userId,
        careerId,
        status: { $in: ['IN_PROGRESS', 'NOT_STARTED'] }
      }).sort({ lastActivityAt: -1 });
    }
    // If no active journey for current career, find the most recently active one
    if (!activeJourney) {
      activeJourney = await CareerJourney.findOne({ userId })
        .sort({ lastActivityAt: -1 });
    }

    const effectiveJourneyId = activeJourney?._id || null;
    const effectiveCareerId  = activeJourney?.careerId || careerId;

    // ── Latest assessment result for the ACTIVE journey only ─────────────────
    let resultQuery = { userId };
    if (effectiveJourneyId) {
      resultQuery = {
        userId,
        $or: [
          { journeyId: effectiveJourneyId },
          { careerId: effectiveCareerId, journeyId: null }
        ]
      };
    } else if (effectiveCareerId) {
      resultQuery = { userId, careerId: effectiveCareerId };
    }

    const latestResult = await AssessmentResult.findOne(resultQuery)
      .populate('careerId', 'title icon')
      .populate('skillScores.skillId', 'name category')
      .populate('skillGaps.skillId', 'name category')
      .sort({ completedAt: -1 });

    // ── Previous result for improvement comparison ────────────────────────────
    let previousResult = null;
    if (latestResult) {
      previousResult = await AssessmentResult.findOne({
        ...resultQuery,
        _id: { $ne: latestResult._id }
      }).sort({ completedAt: -1 });
    }

    // ── Active roadmap for the ACTIVE journey ────────────────────────────────
    let roadmap = null;
    if (effectiveJourneyId) {
      roadmap = await Roadmap.findOne({ userId, journeyId: effectiveJourneyId, isActive: true })
        .populate('careerId', 'title icon')
        .sort({ version: -1 });
      // Fallback: legacy roadmap with no journeyId
      if (!roadmap && effectiveCareerId) {
        roadmap = await Roadmap.findOne({ userId, careerId: effectiveCareerId, journeyId: null, isActive: true })
          .populate('careerId', 'title icon')
          .sort({ createdAt: -1 });
      }
    } else if (effectiveCareerId) {
      roadmap = await Roadmap.findOne({ userId, careerId: effectiveCareerId, isActive: true })
        .populate('careerId', 'title icon')
        .sort({ createdAt: -1 });
    }

    // ── Counts and metadata ───────────────────────────────────────────────────
    const assessmentCount = await AssessmentResult.countDocuments({ userId });
    const journeyCount    = await CareerJourney.countDocuments({ userId });

    const recentChats = await ChatSession.find({ userId, isActive: true })
      .sort({ updatedAt: -1 })
      .limit(3)
      .select('title updatedAt');

    // Skill improvement
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

    let careerDetails = null;
    if (effectiveCareerId) {
      careerDetails = await Career.findById(effectiveCareerId)
        .populate('requiredSkills.skillId', 'name');
    }

    const currentPhase = roadmap?.phases?.find(p => p.status === 'in-progress')
      || roadmap?.phases?.find(p => p.status === 'not-started');

    res.json({
      success: true,
      dashboard: {
        user: {
          name: req.user.name,
          education: req.user.education,
          experienceLevel: req.user.experienceLevel,
          careerGoal: careerDetails
            ? { _id: careerDetails._id, title: careerDetails.title }
            : null,
          profileComplete: req.user.profileComplete
        },
        activeJourney: activeJourney ? {
          _id: activeJourney._id,
          careerName: activeJourney.careerName,
          status: activeJourney.status,
          progress: activeJourney.progress
        } : null,
        journeyCount,
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
    const userId   = req.user._id;
    const careerId = req.query.careerId || req.user.careerGoal;
    const journeyId = req.query.journeyId || null;

    let query = { userId };

    if (journeyId) {
      // Verify ownership
      const journey = await CareerJourney.findOne({ _id: journeyId, userId });
      if (!journey) {
        return res.status(403).json({ success: false, message: 'Journey not found or access denied.' });
      }
      const jCareerId = journey.careerId;
      query = {
        userId,
        $or: [
          { journeyId: journey._id },
          { careerId: jCareerId, journeyId: null }
        ]
      };
    } else if (careerId) {
      query.careerId = careerId;
    }

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
