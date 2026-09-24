const CareerJourney = require('../models/CareerJourney');
const Assessment = require('../models/Assessment');
const AssessmentResult = require('../models/AssessmentResult');
const Roadmap = require('../models/Roadmap');
const ChatSession = require('../models/ChatSession');
const Career = require('../models/Career');
const User = require('../models/User');

// ─── Helper: build journey-scoped result query ───────────────────────────────
// For NEW records: use journeyId. For LEGACY records: fall back to careerId+journeyId:null.
// CRITICAL: never return records from a DIFFERENT journey with the same careerId.
function resultQueryForJourney(userId, journeyId, careerId) {
  return {
    userId,
    $or: [
      { journeyId },
      // Legacy: only if the result has no journeyId at all (was created before this feature)
      { careerId, journeyId: null }
    ]
  };
}

// ─── Helper: build journey-scoped roadmap lookup ─────────────────────────────
async function getRoadmapForJourney(userId, journeyId, careerId) {
  // First try: roadmap tagged with this exact journeyId
  let roadmap = await Roadmap.findOne({ userId, journeyId, isActive: true })
    .select('overallProgress phases _id version generatedBy')
    .sort({ version: -1 });

  // Second try: legacy roadmap (no journeyId) for same careerId
  if (!roadmap) {
    roadmap = await Roadmap.findOne({ userId, careerId, journeyId: null, isActive: true })
      .select('overallProgress phases _id version generatedBy')
      .sort({ version: -1 });
  }

  return roadmap;
}

// ─── GET /api/journeys ───────────────────────────────────────────────────────
exports.getAllJourneys = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const journeys = await CareerJourney.find({ userId })
      .populate('careerId', 'title icon description')
      .sort({ lastActivityAt: -1 });

    const enriched = await Promise.all(journeys.map(async (j) => {
      const jObj = j.toObject();
      const careerId = j.careerId?._id || j.careerId;

      // Journey-specific roadmap only
      const roadmap = await getRoadmapForJourney(userId, j._id, careerId);

      // Journey-specific assessment count
      const assessmentCount = await AssessmentResult.countDocuments(
        resultQueryForJourney(userId, j._id, careerId)
      );

      // Journey-specific latest result
      const latestAssessment = await AssessmentResult.findOne(
        resultQueryForJourney(userId, j._id, careerId)
      ).sort({ completedAt: -1 }).select('overallScore careerReadiness completedAt attemptNumber');

      // Live progress from THIS journey's roadmap
      let liveProgress = j.progress;
      if (roadmap && roadmap.phases && roadmap.phases.length > 0) {
        const total = roadmap.phases.reduce((s, p) => s + (p.progressPercentage || 0), 0);
        liveProgress = Math.round(total / roadmap.phases.length);
      }

      return {
        ...jObj,
        progress: liveProgress,
        roadmap: roadmap ? {
          _id: roadmap._id,
          overallProgress: roadmap.overallProgress,
          totalPhases: roadmap.phases.length,
          completedPhases: roadmap.phases.filter(p => p.status === 'completed').length,
          hasRoadmap: true
        } : { hasRoadmap: false },
        assessmentCount,
        latestAssessment: latestAssessment || null
      };
    }));

    res.json({ success: true, journeys: enriched });
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/journeys ──────────────────────────────────────────────────────
exports.createOrGetJourney = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { careerId, skills } = req.body;

    if (!careerId) {
      return res.status(400).json({ success: false, message: 'careerId is required.' });
    }

    const career = await Career.findById(careerId);
    if (!career) {
      return res.status(404).json({ success: false, message: 'Career not found.' });
    }

    // Check for existing active journey
    let journey = await CareerJourney.findOne({
      userId,
      careerId,
      status: { $in: ['NOT_STARTED', 'IN_PROGRESS', 'PAUSED'] }
    });

    if (journey) {
      // Update skills snapshot for this journey only
      if (skills && skills.length > 0) {
        journey.selectedSkills = skills.map(s => ({
          skillId: s.skillId,
          skillName: s.skillName || '',
          selfRating: s.selfRating || 50
        }));
        journey.lastActivityAt = new Date();
        await journey.save();
      }
      return res.json({
        success: true,
        journey,
        isNew: false,
        message: `Continuing your ${career.title} journey.`
      });
    }

    // Create a new journey — skills are stored HERE, not globally
    const selectedSkills = (skills || []).map(s => ({
      skillId: s.skillId,
      skillName: s.skillName || '',
      selfRating: s.selfRating || 50
    }));

    journey = await CareerJourney.create({
      userId,
      careerId,
      careerName: career.title,
      careerIcon: career.icon || '🎯',
      selectedSkills,
      status: 'NOT_STARTED',
      progress: 0,
      startedAt: new Date(),
      lastActivityAt: new Date()
    });

    res.status(201).json({
      success: true,
      journey,
      isNew: true,
      message: `New journey started for ${career.title}.`
    });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/journeys/:id ───────────────────────────────────────────────────
// SECURITY: always verify userId matches before returning any data
exports.getJourney = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const journey = await CareerJourney.findOne({ _id: req.params.id, userId })
      .populate('careerId', 'title icon description requiredSkills')
      .populate('selectedSkills.skillId', 'name category icon');

    if (!journey) {
      return res.status(404).json({ success: false, message: 'Journey not found or access denied.' });
    }

    const careerId = journey.careerId?._id || journey.careerId;

    // Assessment results belonging ONLY to this journey
    const assessmentResults = await AssessmentResult.find(
      resultQueryForJourney(userId, journey._id, careerId)
    )
      .populate('careerId', 'title')
      .sort({ completedAt: -1 });

    // Active roadmap for THIS journey only
    const roadmap = await getRoadmapForJourney(userId, journey._id, careerId);
    let fullRoadmap = null;
    if (roadmap) {
      fullRoadmap = await Roadmap.findById(roadmap._id).populate('careerId', 'title icon');
    }

    // All roadmap versions for this journey (history)
    const allRoadmaps = await Roadmap.find({
      userId,
      $or: [
        { journeyId: journey._id },
        { careerId, journeyId: null }
      ]
    })
      .select('version overallProgress isActive createdAt generatedBy phases')
      .sort({ createdAt: -1 });

    // Mentor: count sessions (user-level; chat sessions are not yet journey-scoped)
    const mentorSessionCount = await ChatSession.countDocuments({ userId, isActive: true });
    const lastSession = await ChatSession.findOne({ userId, isActive: true })
      .sort({ updatedAt: -1 })
      .select('updatedAt title');

    // Live progress from this journey's roadmap
    let liveProgress = journey.progress;
    if (fullRoadmap && fullRoadmap.phases && fullRoadmap.phases.length > 0) {
      const total = fullRoadmap.phases.reduce((s, p) => s + (p.progressPercentage || 0), 0);
      liveProgress = Math.round(total / fullRoadmap.phases.length);
    }

    res.json({
      success: true,
      journey: { ...journey.toObject(), progress: liveProgress },
      assessmentResults,
      roadmap: fullRoadmap || null,
      allRoadmaps,
      mentorSummary: {
        sessionCount: mentorSessionCount,
        lastSession: lastSession ? { title: lastSession.title, updatedAt: lastSession.updatedAt } : null
      }
    });
  } catch (err) {
    next(err);
  }
};

// ─── PATCH /api/journeys/:id ─────────────────────────────────────────────────
exports.updateJourney = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { status, progress, selectedSkills } = req.body;

    const journey = await CareerJourney.findOne({ _id: req.params.id, userId });
    if (!journey) {
      return res.status(404).json({ success: false, message: 'Journey not found or access denied.' });
    }

    if (status) journey.status = status;
    if (progress !== undefined) journey.progress = Math.min(100, Math.max(0, progress));
    if (selectedSkills) journey.selectedSkills = selectedSkills;
    journey.lastActivityAt = new Date();

    if (journey.progress >= 100 || status === 'COMPLETED') {
      journey.status = 'COMPLETED';
      journey.completedAt = journey.completedAt || new Date();
    }

    await journey.save();
    res.json({ success: true, journey });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/journeys/history ───────────────────────────────────────────────
exports.getHistory = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate('careerGoal', 'title icon');

    const journeys = await CareerJourney.find({ userId })
      .populate('careerId', 'title icon description')
      .sort({ lastActivityAt: -1 });

    const totalAssessments = await AssessmentResult.countDocuments({ userId });
    const totalRoadmaps = await Roadmap.countDocuments({ userId });
    const totalMentorSessions = await ChatSession.countDocuments({ userId, isActive: true });

    const sessions = await ChatSession.find({ userId, isActive: true }).select('messages');
    const totalMentorMessages = sessions.reduce((sum, s) => sum + (s.messages ? s.messages.length : 0), 0);

    const lastSession = await ChatSession.findOne({ userId, isActive: true })
      .sort({ updatedAt: -1 }).select('updatedAt');

    // Enrich each journey with its OWN data (no cross-career mixing)
    const enrichedJourneys = await Promise.all(journeys.map(async (j) => {
      const jObj = j.toObject();
      const careerId = j.careerId?._id || j.careerId;

      const roadmap = await getRoadmapForJourney(userId, j._id, careerId);

      const assessmentCount = await AssessmentResult.countDocuments(
        resultQueryForJourney(userId, j._id, careerId)
      );

      const latestResult = await AssessmentResult.findOne(
        resultQueryForJourney(userId, j._id, careerId)
      ).sort({ completedAt: -1 }).select('overallScore careerReadiness completedAt attemptNumber _id');

      // Live progress derived from THIS journey's roadmap
      let liveProgress = j.progress;
      if (roadmap && roadmap.phases && roadmap.phases.length > 0) {
        const total = roadmap.phases.reduce((s, p) => s + (p.progressPercentage || 0), 0);
        liveProgress = Math.round(total / roadmap.phases.length);
      }

      let computedStatus = j.status;
      if (liveProgress >= 100) computedStatus = 'COMPLETED';
      else if (liveProgress > 0) computedStatus = 'IN_PROGRESS';

      return {
        ...jObj,
        progress: liveProgress,
        status: computedStatus,
        assessmentCount,
        latestResult: latestResult || null,
        roadmap: roadmap ? {
          _id: roadmap._id,
          overallProgress: roadmap.overallProgress,
          totalPhases: roadmap.phases.length,
          completedPhases: roadmap.phases.filter(p => p.status === 'completed').length,
          hasRoadmap: true
        } : { hasRoadmap: false }
      };
    }));

    const overallLearningProgress = enrichedJourneys.length > 0
      ? Math.round(enrichedJourneys.reduce((s, j) => s + j.progress, 0) / enrichedJourneys.length)
      : 0;

    const recentActivity = await buildRecentActivity(userId);

    res.json({
      success: true,
      history: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          careerGoal: user.careerGoal || null
        },
        summary: {
          totalJourneys: journeys.length,
          totalAssessments,
          totalRoadmaps,
          totalMentorSessions,
          totalMentorMessages,
          overallLearningProgress,
          lastMentorSession: lastSession ? lastSession.updatedAt : null
        },
        journeys: enrichedJourneys,
        recentActivity
      }
    });
  } catch (err) {
    next(err);
  }
};

// ─── Build Recent Activity ────────────────────────────────────────────────────
async function buildRecentActivity(userId) {
  const activities = [];

  const recentResults = await AssessmentResult.find({ userId })
    .populate('careerId', 'title')
    .sort({ completedAt: -1 })
    .limit(5)
    .select('completedAt careerId overallScore');

  recentResults.forEach(r => {
    activities.push({
      type: 'assessment',
      icon: '📝',
      description: `Completed assessment for ${r.careerId?.title || 'a career'} (Score: ${r.overallScore}%)`,
      date: r.completedAt
    });
  });

  const recentRoadmaps = await Roadmap.find({ userId })
    .populate('careerId', 'title')
    .sort({ createdAt: -1 })
    .limit(3)
    .select('createdAt careerId generatedBy');

  recentRoadmaps.forEach(r => {
    activities.push({
      type: 'roadmap',
      icon: '🗺️',
      description: `Generated ${r.generatedBy === 'AI' ? 'AI' : 'learning'} roadmap for ${r.careerId?.title || 'a career'}`,
      date: r.createdAt
    });
  });

  const recentSessions = await ChatSession.find({ userId, isActive: true })
    .sort({ updatedAt: -1 })
    .limit(3)
    .select('updatedAt title');

  recentSessions.forEach(s => {
    activities.push({
      type: 'mentor',
      icon: '🤖',
      description: `AI Mentor session: "${(s.title || 'New conversation').substring(0, 50)}"`,
      date: s.updatedAt
    });
  });

  const recentJourneys = await CareerJourney.find({ userId })
    .sort({ startedAt: -1 })
    .limit(3)
    .select('startedAt careerName');

  recentJourneys.forEach(j => {
    activities.push({
      type: 'journey',
      icon: '🚀',
      description: `Started career journey: ${j.careerName}`,
      date: j.startedAt
    });
  });

  activities.sort((a, b) => new Date(b.date) - new Date(a.date));
  return activities.slice(0, 10);
}

// ─── GET /api/journeys/:id/assessments ───────────────────────────────────────
exports.getJourneyAssessments = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const journey = await CareerJourney.findOne({ _id: req.params.id, userId });

    if (!journey) {
      return res.status(404).json({ success: false, message: 'Journey not found or access denied.' });
    }

    const careerId = journey.careerId?._id || journey.careerId;

    const results = await AssessmentResult.find(
      resultQueryForJourney(userId, journey._id, careerId)
    )
      .populate('careerId', 'title')
      .sort({ completedAt: -1 });

    res.json({ success: true, results });
  } catch (err) {
    next(err);
  }
};

// ─── PATCH /api/journeys/:id/sync-progress ───────────────────────────────────
exports.syncJourneyProgress = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const journey = await CareerJourney.findOne({ _id: req.params.id, userId });

    if (!journey) {
      return res.status(404).json({ success: false, message: 'Journey not found or access denied.' });
    }

    const careerId = journey.careerId?._id || journey.careerId;

    // Get roadmap for THIS journey only
    const roadmap = await getRoadmapForJourney(userId, journey._id, careerId);

    if (roadmap && roadmap.phases && roadmap.phases.length > 0) {
      const total = roadmap.phases.reduce((s, p) => s + (p.progressPercentage || 0), 0);
      const liveProgress = Math.round(total / roadmap.phases.length);
      journey.progress = liveProgress;

      if (liveProgress >= 100) {
        journey.status = 'COMPLETED';
        journey.completedAt = journey.completedAt || new Date();
      } else if (liveProgress > 0) {
        journey.status = 'IN_PROGRESS';
      }

      journey.lastActivityAt = new Date();
      await journey.save();
    }

    res.json({ success: true, journey, progress: journey.progress });
  } catch (err) {
    next(err);
  }
};
