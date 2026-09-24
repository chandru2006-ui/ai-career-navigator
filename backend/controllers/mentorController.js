const ChatSession = require('../models/ChatSession');
const AssessmentResult = require('../models/AssessmentResult');
const Roadmap = require('../models/Roadmap');
const CareerJourney = require('../models/CareerJourney');
const aiService = require('../services/aiService');

// ─── POST /api/mentor/chat ───────────────────────────────────────────────────
// Accepts optional journeyId to provide journey-specific context
exports.chat = async (req, res, next) => {
  try {
    const { message, sessionId, journeyId } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required.' });
    }

    const userId = req.user._id;
    let latestResult, activeRoadmap;

    if (journeyId) {
      // JOURNEY-AWARE: verify ownership then load journey-specific context
      const journey = await CareerJourney.findOne({ _id: journeyId, userId });
      if (!journey) {
        return res.status(403).json({ success: false, message: 'Journey not found or access denied.' });
      }

      const careerId = journey.careerId?._id || journey.careerId;

      // Result for this specific journey only
      latestResult = await AssessmentResult.findOne({
        userId,
        $or: [
          { journeyId: journey._id },
          { careerId, journeyId: null }
        ]
      })
        .populate('careerId', 'title')
        .sort({ completedAt: -1 });

      // Roadmap for this specific journey only
      activeRoadmap = await Roadmap.findOne({ userId, journeyId, isActive: true })
        .populate('careerId', 'title');

      // Legacy roadmap fallback
      if (!activeRoadmap) {
        activeRoadmap = await Roadmap.findOne({ userId, careerId, journeyId: null, isActive: true })
          .populate('careerId', 'title');
      }
    } else {
      // NO journeyId: fall back to user's latest result (current workflow)
      latestResult = await AssessmentResult.findOne({ userId })
        .populate('careerId', 'title')
        .sort({ completedAt: -1 });

      activeRoadmap = await Roadmap.findOne({ userId, isActive: true })
        .populate('careerId', 'title')
        .sort({ createdAt: -1 });
    }

    const context = {
      career: latestResult?.careerId?.title || req.user.careerGoal || 'your target career',
      userName: req.user.name,
      skillScores: latestResult?.skillScores?.map(s => ({
        skillName: s.skillName,
        score: s.score,
        proficiency: s.proficiency
      })) || [],
      skillGaps: latestResult?.skillGaps?.filter(g => g.gap > 0).map(g => ({
        skillName: g.skillName,
        gap: g.gap,
        currentLevel: g.currentLevel,
        requiredLevel: g.requiredLevel
      })) || [],
      roadmapPhase: activeRoadmap?.phases?.find(p => p.status === 'in-progress')?.title || 'Not started'
    };

    // Find or create session
    let session;
    if (sessionId) {
      session = await ChatSession.findOne({ _id: sessionId, userId });
    }
    if (!session) {
      session = await ChatSession.create({
        userId,
        title: message.substring(0, 50),
        messages: []
      });
    }

    const history = session.messages.slice(-20).map(m => ({
      role: m.role,
      content: m.content
    }));

    const aiResult = await aiService.chatWithMentor(context, message.trim(), history);

    let assistantMessage;
    if (aiResult.success) {
      assistantMessage = aiResult.message;
    } else {
      assistantMessage = `I'm temporarily unable to connect to the AI service. Please check your API configuration.\n\nHowever, based on your profile:\n${
        context.skillGaps.length > 0
          ? `Your top skill gaps are: ${context.skillGaps.slice(0, 3).map(g => `${g.skillName} (${g.gap} points)`).join(', ')}. Focus on these areas to reach your goal of becoming a ${context.career}.`
          : `You're making great progress toward becoming a ${context.career}!`
      }`;
    }

    session.messages.push({ role: 'user', content: message.trim() });
    session.messages.push({ role: 'assistant', content: assistantMessage });

    if (session.messages.length === 2) {
      session.title = message.substring(0, 60);
    }
    await session.save();

    res.json({
      success: true,
      sessionId: session._id,
      message: assistantMessage,
      aiAvailable: aiResult.success
    });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/mentor/history ─────────────────────────────────────────────────
exports.getHistory = async (req, res, next) => {
  try {
    const sessions = await ChatSession.find({ userId: req.user._id, isActive: true })
      .sort({ updatedAt: -1 })
      .limit(20);
    res.json({ success: true, sessions });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/mentor/session/:id ─────────────────────────────────────────────
exports.getSession = async (req, res, next) => {
  try {
    const session = await ChatSession.findOne({ _id: req.params.id, userId: req.user._id });
    if (!session) return res.status(404).json({ success: false, message: 'Session not found.' });
    res.json({ success: true, session });
  } catch (err) {
    next(err);
  }
};

// ─── DELETE /api/mentor/session/:id ──────────────────────────────────────────
exports.deleteSession = async (req, res, next) => {
  try {
    await ChatSession.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isActive: false }
    );
    res.json({ success: true, message: 'Session deleted.' });
  } catch (err) {
    next(err);
  }
};
