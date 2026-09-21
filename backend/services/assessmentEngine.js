/**
 * Assessment Engine
 * Handles adaptive question selection, scoring, and skill-gap calculation
 */

const Question = require('../models/Question');

// ── Proficiency classification ────────────────────────────────────────────────
function classifyProficiency(score) {
  if (score >= 85) return 'Expert';
  if (score >= 70) return 'Advanced';
  if (score >= 40) return 'Intermediate';
  return 'Beginner';
}

// ── Gap severity classification ───────────────────────────────────────────────
function classifyGapSeverity(gap) {
  if (gap <= 0)  return 'None';
  if (gap <= 10) return 'Minimal';
  if (gap <= 25) return 'Low';
  if (gap <= 40) return 'Medium';
  if (gap <= 60) return 'High';
  return 'Very High';
}

// ── Adaptive difficulty logic ─────────────────────────────────────────────────
function nextDifficulty(current, consecutiveCorrect, consecutiveWrong) {
  if (consecutiveCorrect >= 2) {
    if (current === 'easy')   return 'medium';
    if (current === 'medium') return 'hard';
    return 'hard';
  }
  if (consecutiveWrong >= 2) {
    if (current === 'hard')   return 'medium';
    if (current === 'medium') return 'easy';
    return 'easy';
  }
  return current;
}

// ── Select next question ──────────────────────────────────────────────────────
async function selectNextQuestion(skillIds, difficulty, usedQuestionIds) {
  const used = usedQuestionIds.map(id => id.toString());

  // Try requested difficulty first, then fall back
  const difficultyOrder = difficulty === 'easy'
    ? ['easy', 'medium', 'hard']
    : difficulty === 'hard'
    ? ['hard', 'medium', 'easy']
    : ['medium', 'easy', 'hard'];

  for (const diff of difficultyOrder) {
    const questions = await Question.find({
      skillId: { $in: skillIds },
      difficulty: diff,
      isActive: true,
      _id: { $nin: used }
    }).lean();

    if (questions.length > 0) {
      // Random selection from available
      const idx = Math.floor(Math.random() * questions.length);
      return questions[idx];
    }
  }

  return null; // No more questions available
}

// ── Build initial question pool for an assessment ─────────────────────────────
async function buildInitialQuestions(skillIds, totalQuestions) {
  const perSkill = Math.ceil(totalQuestions / skillIds.length);
  const allSelected = [];
  const usedIds = [];

  for (const skillId of skillIds) {
    // Try to get a mix of difficulties
    const easyQ   = await Question.find({ skillId, difficulty: 'easy',   isActive: true, _id: { $nin: usedIds } }).limit(Math.ceil(perSkill * 0.4)).lean();
    const mediumQ  = await Question.find({ skillId, difficulty: 'medium', isActive: true, _id: { $nin: usedIds } }).limit(Math.ceil(perSkill * 0.4)).lean();
    const hardQ   = await Question.find({ skillId, difficulty: 'hard',   isActive: true, _id: { $nin: usedIds } }).limit(Math.ceil(perSkill * 0.2)).lean();

    const selected = [...easyQ, ...mediumQ, ...hardQ].slice(0, perSkill);
    selected.forEach(q => usedIds.push(q._id.toString()));
    allSelected.push(...selected);
  }

  // Shuffle
  return allSelected
    .sort(() => Math.random() - 0.5)
    .slice(0, totalQuestions);
}

// ── Calculate scores after assessment ─────────────────────────────────────────
function calculateSkillScores(answeredQuestions, skillMap) {
  const bySkill = {};

  for (const q of answeredQuestions) {
    const sid = q.skillId.toString();
    if (!bySkill[sid]) {
      bySkill[sid] = { correct: 0, total: 0, skillName: skillMap[sid] || sid };
    }
    bySkill[sid].total++;
    if (q.isCorrect) bySkill[sid].correct++;
  }

  return Object.entries(bySkill).map(([skillId, data]) => {
    const score = data.total > 0
      ? Math.round((data.correct / data.total) * 100)
      : 0;
    return {
      skillId,
      skillName: data.skillName,
      score,
      proficiency: classifyProficiency(score),
      correctAnswers: data.correct,
      totalQuestions: data.total
    };
  });
}

// ── Calculate skill gaps ──────────────────────────────────────────────────────
function calculateSkillGaps(skillScores, careerRequirements) {
  return careerRequirements.map(req => {
    const skillScore = skillScores.find(
      s => s.skillId.toString() === req.skillId.toString()
    );
    const currentLevel = skillScore ? skillScore.score : 0;
    const gap = Math.max(0, req.requiredLevel - currentLevel);

    return {
      skillId: req.skillId,
      skillName: req.skillName || '',
      currentLevel,
      requiredLevel: req.requiredLevel,
      gap,
      severity: classifyGapSeverity(gap),
      priority: req.priority || 'medium'
    };
  });
}

// ── Career readiness ──────────────────────────────────────────────────────────
function calculateCareerReadiness(skillGaps, careerRequirements) {
  if (!careerRequirements.length) return 0;

  let totalPoints = 0;
  let earnedPoints = 0;

  for (const req of careerRequirements) {
    const gap = skillGaps.find(g => g.skillId.toString() === req.skillId.toString());
    totalPoints += req.requiredLevel;
    if (gap) {
      earnedPoints += Math.min(gap.currentLevel, req.requiredLevel);
    }
  }

  return totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
}

module.exports = {
  classifyProficiency,
  classifyGapSeverity,
  nextDifficulty,
  selectNextQuestion,
  buildInitialQuestions,
  calculateSkillScores,
  calculateSkillGaps,
  calculateCareerReadiness
};
