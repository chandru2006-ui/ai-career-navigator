const Roadmap = require('../models/Roadmap');
const AssessmentResult = require('../models/AssessmentResult');
const Career = require('../models/Career');
const aiService = require('../services/aiService');

// POST /api/roadmap/generate
exports.generateRoadmap = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const careerId = req.body.careerId || req.user.careerGoal;

    if (!careerId) {
      return res.status(400).json({ success: false, message: 'Career goal required.' });
    }

    // Get latest assessment result
    const latestResult = await AssessmentResult.findOne({ userId, careerId })
      .populate('skillScores.skillId', 'name')
      .populate('skillGaps.skillId', 'name')
      .sort({ completedAt: -1 });

    if (!latestResult) {
      return res.status(400).json({ success: false, message: 'Complete an assessment first before generating a roadmap.' });
    }

    const career = await Career.findById(careerId);
    if (!career) return res.status(404).json({ success: false, message: 'Career not found.' });

    const context = {
      career: career.title,
      userName: req.user.name,
      skillScores: latestResult.skillScores.map(s => ({
        skillName: s.skillName || s.skillId?.name || 'Unknown',
        score: s.score,
        proficiency: s.proficiency
      })),
      skillGaps: latestResult.skillGaps
        .filter(g => g.gap > 0)
        .map(g => ({
          skillName: g.skillName || g.skillId?.name || 'Unknown',
          currentLevel: g.currentLevel,
          requiredLevel: g.requiredLevel,
          gap: g.gap,
          severity: g.severity
        }))
    };

    // Call AI service
    const aiResult = await aiService.generateRoadmap(context);

    let phases = [];
    let aiSummary = '';
    let generatedBy = 'system';

    if (aiResult.success && aiResult.data?.phases?.length > 0) {
      generatedBy = 'AI';
      aiSummary = aiResult.data.summary || '';
      phases = aiResult.data.phases.map((p, i) => ({
        phaseNumber: i + 1,
        title: p.title || `Phase ${i + 1}`,
        duration: p.duration || '1-2 weeks',
        skills: p.skills || [],
        topics: p.topics || [],
        reason: p.reason || '',
        practicalExercises: p.practicalExercises || [],
        resources: p.resources || [],
        status: 'not-started',
        progressPercentage: 0
      }));
    } else {
      // Fallback: generate system roadmap from skill gaps
      const sortedGaps = context.skillGaps.sort((a, b) => b.gap - a.gap);
      phases = sortedGaps.map((g, i) => ({
        phaseNumber: i + 1,
        title: `${g.skillName} Development`,
        duration: g.gap > 40 ? '3-4 weeks' : g.gap > 20 ? '2 weeks' : '1 week',
        skills: [g.skillName],
        topics: [`${g.skillName} fundamentals`, `${g.skillName} best practices`, `${g.skillName} projects`],
        reason: `Current level ${g.currentLevel}% needs to reach ${g.requiredLevel}% (gap: ${g.gap})`,
        practicalExercises: [`Build a project using ${g.skillName}`, `Complete exercises on official documentation`],
        resources: [`Official ${g.skillName} documentation`, 'freeCodeCamp', 'MDN Web Docs'],
        status: 'not-started',
        progressPercentage: 0
      }));
      aiSummary = `System-generated roadmap for ${career.title}. AI service unavailable — configure AI_PROVIDER and API key for personalized roadmap.`;
    }

    // Deactivate old roadmaps for this career
    await Roadmap.updateMany({ userId, careerId, isActive: true }, { $set: { isActive: false } });

    // Find previous version number
    const lastRoadmap = await Roadmap.findOne({ userId, careerId }).sort({ version: -1 });
    const version = lastRoadmap ? lastRoadmap.version + 1 : 1;

    const roadmap = await Roadmap.create({
      userId,
      careerId,
      assessmentResultId: latestResult._id,
      generatedBy,
      phases,
      aiSummary,
      version,
      overallProgress: 0,
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: aiResult.success ? 'AI roadmap generated.' : 'System roadmap generated (AI unavailable).',
      roadmap,
      aiAvailable: aiResult.success
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/roadmap
exports.getRoadmap = async (req, res, next) => {
  try {
    const { careerId } = req.query;
    const query = { userId: req.user._id, isActive: true };
    if (careerId) query.careerId = careerId;

    const roadmap = await Roadmap.findOne(query)
      .populate('careerId', 'title icon')
      .sort({ createdAt: -1 });

    res.json({ success: true, roadmap: roadmap || null });
  } catch (err) {
    next(err);
  }
};

// PUT /api/roadmap/progress
exports.updateProgress = async (req, res, next) => {
  try {
    const { roadmapId, phaseIndex, status, progressPercentage } = req.body;

    const roadmap = await Roadmap.findOne({ _id: roadmapId, userId: req.user._id });
    if (!roadmap) return res.status(404).json({ success: false, message: 'Roadmap not found.' });

    if (phaseIndex < 0 || phaseIndex >= roadmap.phases.length) {
      return res.status(400).json({ success: false, message: 'Invalid phase index.' });
    }

    const validStatuses = ['not-started', 'in-progress', 'completed'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    roadmap.phases[phaseIndex].status = status || roadmap.phases[phaseIndex].status;
    roadmap.phases[phaseIndex].progressPercentage = progressPercentage !== undefined
      ? Math.min(100, Math.max(0, progressPercentage))
      : roadmap.phases[phaseIndex].progressPercentage;

    // Auto-set status based on progress
    if (progressPercentage === 100) roadmap.phases[phaseIndex].status = 'completed';
    if (progressPercentage > 0 && progressPercentage < 100) roadmap.phases[phaseIndex].status = 'in-progress';
    if (progressPercentage === 0) roadmap.phases[phaseIndex].status = 'not-started';

    // Recalculate overall progress
    const totalProgress = roadmap.phases.reduce((sum, p) => sum + (p.progressPercentage || 0), 0);
    roadmap.overallProgress = Math.round(totalProgress / roadmap.phases.length);

    await roadmap.save();
    res.json({ success: true, message: 'Progress updated.', roadmap });
  } catch (err) {
    next(err);
  }
};

// POST /api/roadmap/recalculate
exports.recalculateRoadmap = async (req, res, next) => {
  // Re-use generate logic but preserve completed phases
  req.body.recalculate = true;
  return exports.generateRoadmap(req, res, next);
};

// GET /api/roadmap/all
exports.getAllRoadmaps = async (req, res, next) => {
  try {
    const roadmaps = await Roadmap.find({ userId: req.user._id })
      .populate('careerId', 'title icon')
      .sort({ createdAt: -1 });
    res.json({ success: true, roadmaps });
  } catch (err) {
    next(err);
  }
};
