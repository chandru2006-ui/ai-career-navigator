const Roadmap = require('../models/Roadmap');
const AssessmentResult = require('../models/AssessmentResult');
const Career = require('../models/Career');
const CareerJourney = require('../models/CareerJourney');
const aiService = require('../services/aiService');

// ─── Helper: sync journey progress from a specific roadmap ──────────────────
// CRITICAL: when journeyId is known, use it directly instead of careerId search
async function syncJourneyProgress(userId, roadmap) {
  if (!roadmap || !roadmap.phases || roadmap.phases.length === 0) return;

  const total = roadmap.phases.reduce((s, p) => s + (p.progressPercentage || 0), 0);
  const liveProgress = Math.round(total / roadmap.phases.length);

  const update = { progress: liveProgress, lastActivityAt: new Date() };
  if (liveProgress >= 100) {
    update.status = 'COMPLETED';
    update.completedAt = new Date();
  } else if (liveProgress > 0) {
    update.status = 'IN_PROGRESS';
  } else {
    update.status = 'IN_PROGRESS'; // has roadmap = in progress
  }

  // PREFER journeyId — only fall back to careerId for legacy records
  if (roadmap.journeyId) {
    await CareerJourney.findOneAndUpdate(
      { _id: roadmap.journeyId, userId },
      { $set: update }
    );
  } else {
    // Legacy: roadmap has no journeyId; update by careerId but scope strictly
    await CareerJourney.findOneAndUpdate(
      { userId, careerId: roadmap.careerId, status: { $ne: 'COMPLETED' } },
      { $set: update }
    );
  }
}

// ─── POST /api/roadmap/generate ─────────────────────────────────────────────
exports.generateRoadmap = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const careerId = req.body.careerId || req.user.careerGoal;
    const journeyId = req.body.journeyId || null;

    if (!careerId) {
      return res.status(400).json({ success: false, message: 'Career goal required.' });
    }

    // ── CRITICAL: if journeyId provided, get the result for THAT journey only ──
    let latestResult;
    if (journeyId) {
      // Verify journey belongs to user
      const journey = await CareerJourney.findOne({ _id: journeyId, userId });
      if (!journey) {
        return res.status(403).json({ success: false, message: 'Journey not found or access denied.' });
      }

      latestResult = await AssessmentResult.findOne({ userId, journeyId })
        .populate('skillScores.skillId', 'name')
        .populate('skillGaps.skillId', 'name')
        .sort({ completedAt: -1 });

      // If no result linked by journeyId, check for legacy results with same careerId & no journeyId
      if (!latestResult) {
        latestResult = await AssessmentResult.findOne({ userId, careerId, journeyId: null })
          .populate('skillScores.skillId', 'name')
          .populate('skillGaps.skillId', 'name')
          .sort({ completedAt: -1 });
      }
    } else {
      // No journeyId: use careerId scoped query (current-flow fallback)
      latestResult = await AssessmentResult.findOne({ userId, careerId })
        .populate('skillScores.skillId', 'name')
        .populate('skillGaps.skillId', 'name')
        .sort({ completedAt: -1 });
    }

    if (!latestResult) {
      return res.status(400).json({
        success: false,
        message: 'Complete an assessment first before generating a roadmap.'
      });
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
      const sortedGaps = [...context.skillGaps].sort((a, b) => b.gap - a.gap);
      if (sortedGaps.length === 0) {
        // No gaps — create a single-phase plan
        phases = [{
          phaseNumber: 1,
          title: `${career.title} Excellence`,
          duration: '4 weeks',
          skills: [],
          topics: [`Advanced ${career.title} practices`, 'Portfolio projects', 'Interview preparation'],
          reason: 'Your skills meet the career requirements — focus on excellence and portfolio.',
          practicalExercises: ['Build a showcase project', 'Contribute to open source'],
          resources: ['Official documentation', 'YouTube tutorials', 'Udemy courses'],
          status: 'not-started',
          progressPercentage: 0
        }];
      } else {
        phases = sortedGaps.map((g, i) => ({
          phaseNumber: i + 1,
          title: `${g.skillName} Development`,
          duration: g.gap > 40 ? '3-4 weeks' : g.gap > 20 ? '2 weeks' : '1 week',
          skills: [g.skillName],
          topics: [`${g.skillName} fundamentals`, `${g.skillName} best practices`, `${g.skillName} projects`],
          reason: `Current level ${g.currentLevel}% needs to reach ${g.requiredLevel}% (gap: ${g.gap})`,
          practicalExercises: [`Build a project using ${g.skillName}`, `Complete official ${g.skillName} tutorials`],
          resources: [`Official ${g.skillName} documentation`, 'freeCodeCamp', 'MDN Web Docs'],
          status: 'not-started',
          progressPercentage: 0
        }));
      }
      aiSummary = `System-generated roadmap for ${career.title}. Configure AI for a personalized plan.`;
    }

    // ── CRITICAL: deactivate old roadmaps ONLY for the same journey or careerId scope ──
    if (journeyId) {
      // Deactivate only roadmaps belonging to THIS journey
      await Roadmap.updateMany(
        { userId, journeyId, isActive: true },
        { $set: { isActive: false } }
      );
    } else {
      // No journeyId: scope deactivation to this careerId & no journeyId (legacy flow)
      await Roadmap.updateMany(
        { userId, careerId, journeyId: null, isActive: true },
        { $set: { isActive: false } }
      );
    }

    // Version tracking — scoped to journey or careerId
    const versionQuery = journeyId
      ? { userId, journeyId }
      : { userId, careerId };
    const lastRoadmap = await Roadmap.findOne(versionQuery).sort({ version: -1 });
    const version = lastRoadmap ? lastRoadmap.version + 1 : 1;

    const roadmap = await Roadmap.create({
      userId,
      journeyId: journeyId || null,
      careerId,
      assessmentResultId: latestResult._id,
      generatedBy,
      phases,
      aiSummary,
      version,
      overallProgress: 0,
      isActive: true
    });

    // Update journey status
    const journeyUpdate = { lastActivityAt: new Date(), status: 'IN_PROGRESS' };
    if (journeyId) {
      await CareerJourney.findOneAndUpdate({ _id: journeyId, userId }, { $set: journeyUpdate });
    } else {
      await CareerJourney.findOneAndUpdate(
        { userId, careerId, status: { $in: ['NOT_STARTED', 'IN_PROGRESS'] } },
        { $set: journeyUpdate }
      );
    }

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

// ─── GET /api/roadmap ────────────────────────────────────────────────────────
// Now supports journeyId as primary key; careerId as fallback
exports.getRoadmap = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { careerId, journeyId } = req.query;

    let roadmap;

    if (journeyId) {
      // CRITICAL: verify journey belongs to this user before serving roadmap
      const journey = await CareerJourney.findOne({ _id: journeyId, userId });
      if (!journey) {
        return res.status(403).json({ success: false, message: 'Journey not found or access denied.' });
      }

      // Get the active roadmap for this specific journey
      roadmap = await Roadmap.findOne({ userId, journeyId, isActive: true })
        .populate('careerId', 'title icon')
        .sort({ version: -1 });

      // Fallback: journey exists but roadmap was created before journeyId existed (legacy)
      if (!roadmap && journey.careerId) {
        roadmap = await Roadmap.findOne({
          userId,
          careerId: journey.careerId,
          journeyId: null,
          isActive: true
        })
          .populate('careerId', 'title icon')
          .sort({ version: -1 });
      }
    } else if (careerId) {
      // careerId only: scope to roadmaps without a journeyId (legacy/current flow)
      roadmap = await Roadmap.findOne({ userId, careerId, isActive: true })
        .populate('careerId', 'title icon')
        .sort({ version: -1 });
    } else {
      // No context: get the most recently active roadmap
      roadmap = await Roadmap.findOne({ userId, isActive: true })
        .populate('careerId', 'title icon')
        .sort({ createdAt: -1 });
    }

    res.json({ success: true, roadmap: roadmap || null });
  } catch (err) {
    next(err);
  }
};

// ─── PUT /api/roadmap/progress ───────────────────────────────────────────────
exports.updateProgress = async (req, res, next) => {
  try {
    const { roadmapId, phaseIndex, status, progressPercentage } = req.body;

    // SECURITY: verify roadmap belongs to authenticated user
    const roadmap = await Roadmap.findOne({ _id: roadmapId, userId: req.user._id });
    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'Roadmap not found or access denied.' });
    }

    if (phaseIndex < 0 || phaseIndex >= roadmap.phases.length) {
      return res.status(400).json({ success: false, message: 'Invalid phase index.' });
    }

    const validStatuses = ['not-started', 'in-progress', 'completed'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    // Update the specific phase
    if (status) roadmap.phases[phaseIndex].status = status;
    if (progressPercentage !== undefined) {
      roadmap.phases[phaseIndex].progressPercentage = Math.min(100, Math.max(0, progressPercentage));
    }

    // Auto-derive status from percentage
    const pct = roadmap.phases[phaseIndex].progressPercentage;
    if (pct === 100) roadmap.phases[phaseIndex].status = 'completed';
    else if (pct > 0 && pct < 100) roadmap.phases[phaseIndex].status = 'in-progress';
    else if (pct === 0 && !status) roadmap.phases[phaseIndex].status = 'not-started';

    // Recalculate overall progress
    const totalPct = roadmap.phases.reduce((sum, p) => sum + (p.progressPercentage || 0), 0);
    roadmap.overallProgress = Math.round(totalPct / roadmap.phases.length);

    await roadmap.save();

    // CRITICAL: sync the correct journey — use journeyId on the roadmap directly
    await syncJourneyProgress(req.user._id, roadmap);

    res.json({ success: true, message: 'Progress updated.', roadmap });
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/roadmap/recalculate ──────────────────────────────────────────
exports.recalculateRoadmap = async (req, res, next) => {
  return exports.generateRoadmap(req, res, next);
};

// ─── GET /api/roadmap/all ────────────────────────────────────────────────────
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
