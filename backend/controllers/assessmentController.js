const Assessment = require('../models/Assessment');
const AssessmentResult = require('../models/AssessmentResult');
const Career = require('../models/Career');
const Question = require('../models/Question');
const Skill = require('../models/Skill');
const CareerJourney = require('../models/CareerJourney');
const engine = require('../services/assessmentEngine');

// POST /api/assessment/start
exports.startAssessment = async (req, res, next) => {
  try {
    const user = req.user;
    const careerId = req.body.careerId || user.careerGoal;
    const journeyId = req.body.journeyId || null;

    if (!careerId) {
      return res.status(400).json({ success: false, message: 'Career goal required to start assessment.' });
    }

    const career = await Career.findById(careerId).populate('requiredSkills.skillId');
    if (!career) return res.status(404).json({ success: false, message: 'Career not found.' });

    const skillIds = career.requiredSkills.map(rs => rs.skillId._id);

    // Build initial adaptive question pool (30 questions)
    const TOTAL_QUESTIONS = 30;
    const rawQuestions = await engine.buildInitialQuestions(skillIds, TOTAL_QUESTIONS);

    if (rawQuestions.length === 0) {
      return res.status(400).json({ success: false, message: 'No questions available for this career. Please seed the database.' });
    }

    // Mark any old in-progress as abandoned — ONLY for this specific journey
    // CRITICAL: do NOT abandon assessments belonging to other journeys
    const abandonQuery = { userId: user._id, careerId, status: 'in-progress' };
    if (journeyId) {
      abandonQuery.journeyId = journeyId;
    } else {
      // No journeyId: only abandon legacy records (also without journeyId)
      abandonQuery.journeyId = null;
    }
    await Assessment.updateMany(abandonQuery, { $set: { status: 'abandoned' } });

    const assessment = await Assessment.create({
      userId: user._id,
      journeyId: journeyId || null,
      careerId,
      totalQuestions: rawQuestions.length,
      currentDifficulty: 'easy',
      questions: rawQuestions.map(q => ({
        questionId: q._id,
        skillId: q.skillId,
        difficulty: q.difficulty,
        points: q.points || 1,
        selectedAnswer: null,
        isCorrect: null
      }))
    });

    // Update journey status to IN_PROGRESS
    if (journeyId) {
      await CareerJourney.findOneAndUpdate(
        { _id: journeyId, userId: user._id },
        { $set: { status: 'IN_PROGRESS', lastActivityAt: new Date() } }
      );
    } else {
      // Try to find journey by careerId
      await CareerJourney.findOneAndUpdate(
        { userId: user._id, careerId, status: 'NOT_STARTED' },
        { $set: { status: 'IN_PROGRESS', lastActivityAt: new Date() } }
      );
    }

    // Return first question
    const firstQ = rawQuestions[0];
    res.status(201).json({
      success: true,
      assessmentId: assessment._id,
      totalQuestions: rawQuestions.length,
      currentIndex: 0,
      question: {
        _id: firstQ._id,
        question: firstQ.question,
        options: firstQ.options,
        difficulty: firstQ.difficulty,
        skillId: firstQ.skillId
      }
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/assessment/:id/question?index=N
exports.getQuestion = async (req, res, next) => {
  try {
    const assessment = await Assessment.findOne({ _id: req.params.id, userId: req.user._id });
    if (!assessment) return res.status(404).json({ success: false, message: 'Assessment not found.' });
    if (assessment.status !== 'in-progress') {
      return res.status(400).json({ success: false, message: 'Assessment already completed.' });
    }

    const index = parseInt(req.query.index) || assessment.currentQuestionIndex;
    if (index >= assessment.questions.length) {
      return res.status(400).json({ success: false, message: 'No more questions.' });
    }

    const qEntry = assessment.questions[index];
    const question = await Question.findById(qEntry.questionId).populate('skillId', 'name category');

    if (!question) return res.status(404).json({ success: false, message: 'Question not found.' });

    res.json({
      success: true,
      currentIndex: index,
      totalQuestions: assessment.questions.length,
      selectedAnswer: qEntry.selectedAnswer,
      question: {
        _id: question._id,
        question: question.question,
        options: question.options,
        difficulty: question.difficulty,
        skillName: question.skillId?.name,
        skillId: question.skillId?._id
      }
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/assessment/:id/answer
exports.submitAnswer = async (req, res, next) => {
  try {
    const { questionIndex, selectedAnswer } = req.body;
    const assessment = await Assessment.findOne({ _id: req.params.id, userId: req.user._id });

    if (!assessment) return res.status(404).json({ success: false, message: 'Assessment not found.' });
    if (assessment.status !== 'in-progress') {
      return res.status(400).json({ success: false, message: 'Assessment already completed.' });
    }

    const qEntry = assessment.questions[questionIndex];
    if (!qEntry) return res.status(400).json({ success: false, message: 'Invalid question index.' });

    const question = await Question.findById(qEntry.questionId);
    if (!question) return res.status(404).json({ success: false, message: 'Question not found.' });

    const isCorrect = selectedAnswer === question.correctAnswer;
    assessment.questions[questionIndex].selectedAnswer = selectedAnswer;
    assessment.questions[questionIndex].isCorrect = isCorrect;
    assessment.questions[questionIndex].answeredAt = new Date();

    // Update adaptive counters
    if (isCorrect) {
      assessment.consecutiveCorrect += 1;
      assessment.consecutiveWrong = 0;
    } else {
      assessment.consecutiveWrong += 1;
      assessment.consecutiveCorrect = 0;
    }

    // Advance current index
    const nextIndex = questionIndex + 1;
    assessment.currentQuestionIndex = nextIndex;
    assessment.currentDifficulty = engine.nextDifficulty(
      assessment.currentDifficulty,
      assessment.consecutiveCorrect,
      assessment.consecutiveWrong
    );

    await assessment.save();

    const isLast = nextIndex >= assessment.questions.length;

    res.json({
      success: true,
      isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      nextIndex,
      isComplete: isLast
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/assessment/:id/submit
exports.submitAssessment = async (req, res, next) => {
  try {
    const assessment = await Assessment.findOne({ _id: req.params.id, userId: req.user._id })
      .populate('careerId');

    if (!assessment) return res.status(404).json({ success: false, message: 'Assessment not found.' });
    if (assessment.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Assessment already submitted.' });
    }

    const career = await Career.findById(assessment.careerId).populate('requiredSkills.skillId');
    if (!career) return res.status(404).json({ success: false, message: 'Career not found.' });

    // Build skill name map
    const skillIds = [...new Set(assessment.questions.map(q => q.skillId.toString()))];
    const skills = await Skill.find({ _id: { $in: skillIds } });
    const skillMap = {};
    skills.forEach(s => { skillMap[s._id.toString()] = s.name; });

    // Calculate scores
    const answeredQuestions = assessment.questions.filter(q => q.isCorrect !== null);
    const skillScores = engine.calculateSkillScores(answeredQuestions, skillMap);

    // Build career requirements with skill names
    const careerRequirements = career.requiredSkills.map(rs => ({
      skillId: rs.skillId._id,
      skillName: rs.skillId.name,
      requiredLevel: rs.requiredLevel,
      priority: rs.priority
    }));

    // Calculate gaps
    const skillGaps = engine.calculateSkillGaps(skillScores, careerRequirements);
    const careerReadiness = engine.calculateCareerReadiness(skillGaps, careerRequirements);

    const overallScore = skillScores.length > 0
      ? Math.round(skillScores.reduce((sum, s) => sum + s.score, 0) / skillScores.length)
      : 0;

    // Count previous attempts scoped to this journey (not all user+career attempts)
    const attemptQuery = assessment.journeyId
      ? { userId: req.user._id, journeyId: assessment.journeyId }
      : { userId: req.user._id, careerId: assessment.careerId, journeyId: null };
    const prevCount = await AssessmentResult.countDocuments(attemptQuery);

    // Save result — link to journey if available
    const result = await AssessmentResult.create({
      userId: req.user._id,
      journeyId: assessment.journeyId || null,
      assessmentId: assessment._id,
      careerId: assessment.careerId,
      skillScores,
      skillGaps,
      overallScore,
      careerReadiness,
      attemptNumber: prevCount + 1,
      completedAt: new Date()
    });

    assessment.status = 'completed';
    assessment.completedAt = new Date();
    await assessment.save();

    // Update journey lastActivityAt
    const journeyQuery = assessment.journeyId
      ? { _id: assessment.journeyId, userId: req.user._id }
      : { userId: req.user._id, careerId: assessment.careerId };

    await CareerJourney.findOneAndUpdate(
      journeyQuery,
      { $set: { lastActivityAt: new Date(), status: 'IN_PROGRESS' } }
    );

    res.json({
      success: true,
      message: 'Assessment completed.',
      resultId: result._id,
      overallScore,
      careerReadiness,
      skillScores,
      skillGaps
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/assessment/:id/result
exports.getResult = async (req, res, next) => {
  try {
    const result = await AssessmentResult.findById(req.params.id)
      .populate('careerId', 'title')
      .populate('skillScores.skillId', 'name category')
      .populate('skillGaps.skillId', 'name category');

    if (!result) return res.status(404).json({ success: false, message: 'Result not found.' });
    if (result.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    res.json({ success: true, result });
  } catch (err) {
    next(err);
  }
};

// GET /api/assessment/history
exports.getHistory = async (req, res, next) => {
  try {
    const results = await AssessmentResult.find({ userId: req.user._id })
      .populate('careerId', 'title')
      .sort({ completedAt: -1 });
    res.json({ success: true, results });
  } catch (err) {
    next(err);
  }
};

// GET /api/assessment/latest
exports.getLatestResult = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { careerId, journeyId } = req.query;

    let query = { userId };

    if (journeyId) {
      // JOURNEY-AWARE: get latest result for this specific journey only
      // Verify the journey belongs to the user first
      const CareerJourney = require('../models/CareerJourney');
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

    const result = await AssessmentResult.findOne(query)
      .populate('careerId', 'title icon')
      .populate('skillScores.skillId', 'name category')
      .populate('skillGaps.skillId', 'name category')
      .sort({ completedAt: -1 });

    res.json({ success: true, result: result || null });
  } catch (err) {
    next(err);
  }
};
