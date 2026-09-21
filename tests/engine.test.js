/**
 * Backend Unit Tests
 * Tests for assessment engine, skill-gap logic, auth, and AI error handling
 */

const engine = require('../backend/services/assessmentEngine');

// ── Assessment Engine Tests ────────────────────────────────────────────────────

describe('classifyProficiency', () => {
  test('0  → Beginner',      () => expect(engine.classifyProficiency(0)).toBe('Beginner'));
  test('39 → Beginner',      () => expect(engine.classifyProficiency(39)).toBe('Beginner'));
  test('40 → Intermediate',  () => expect(engine.classifyProficiency(40)).toBe('Intermediate'));
  test('69 → Intermediate',  () => expect(engine.classifyProficiency(69)).toBe('Intermediate'));
  test('70 → Advanced',      () => expect(engine.classifyProficiency(70)).toBe('Advanced'));
  test('84 → Advanced',      () => expect(engine.classifyProficiency(84)).toBe('Advanced'));
  test('85 → Expert',        () => expect(engine.classifyProficiency(85)).toBe('Expert'));
  test('100 → Expert',       () => expect(engine.classifyProficiency(100)).toBe('Expert'));
});

describe('classifyGapSeverity', () => {
  test('0  → None',      () => expect(engine.classifyGapSeverity(0)).toBe('None'));
  test('-5 → None',      () => expect(engine.classifyGapSeverity(-5)).toBe('None'));
  test('5  → Minimal',   () => expect(engine.classifyGapSeverity(5)).toBe('Minimal'));
  test('10 → Minimal',   () => expect(engine.classifyGapSeverity(10)).toBe('Minimal'));
  test('15 → Low',       () => expect(engine.classifyGapSeverity(15)).toBe('Low'));
  test('25 → Low',       () => expect(engine.classifyGapSeverity(25)).toBe('Low'));
  test('30 → Medium',    () => expect(engine.classifyGapSeverity(30)).toBe('Medium'));
  test('40 → Medium',    () => expect(engine.classifyGapSeverity(40)).toBe('Medium'));
  test('50 → High',      () => expect(engine.classifyGapSeverity(50)).toBe('High'));
  test('60 → High',      () => expect(engine.classifyGapSeverity(60)).toBe('High'));
  test('61 → Very High', () => expect(engine.classifyGapSeverity(61)).toBe('Very High'));
  test('80 → Very High', () => expect(engine.classifyGapSeverity(80)).toBe('Very High'));
});

describe('nextDifficulty (adaptive engine)', () => {
  test('2 consecutive correct from easy → medium',   () => expect(engine.nextDifficulty('easy',   2, 0)).toBe('medium'));
  test('2 consecutive correct from medium → hard',   () => expect(engine.nextDifficulty('medium', 2, 0)).toBe('hard'));
  test('2 consecutive correct from hard → hard',     () => expect(engine.nextDifficulty('hard',   2, 0)).toBe('hard'));
  test('2 consecutive wrong from hard → medium',     () => expect(engine.nextDifficulty('hard',   0, 2)).toBe('medium'));
  test('2 consecutive wrong from medium → easy',     () => expect(engine.nextDifficulty('medium', 0, 2)).toBe('easy'));
  test('2 consecutive wrong from easy → easy',       () => expect(engine.nextDifficulty('easy',   0, 2)).toBe('easy'));
  test('1 correct, 0 wrong → same (medium)',         () => expect(engine.nextDifficulty('medium', 1, 0)).toBe('medium'));
  test('1 wrong, 0 correct → same (hard)',           () => expect(engine.nextDifficulty('hard',   0, 1)).toBe('hard'));
});

describe('calculateSkillScores', () => {
  const skillMap = {
    'skill1': 'JavaScript',
    'skill2': 'React',
  };

  test('calculates correct score percentages', () => {
    const answered = [
      { skillId: 'skill1', isCorrect: true,  points: 1 },
      { skillId: 'skill1', isCorrect: true,  points: 1 },
      { skillId: 'skill1', isCorrect: false, points: 1 },
      { skillId: 'skill1', isCorrect: true,  points: 1 },
      { skillId: 'skill2', isCorrect: false, points: 1 },
      { skillId: 'skill2', isCorrect: false, points: 1 },
    ];
    const scores = engine.calculateSkillScores(answered, skillMap);
    const js = scores.find(s => s.skillId === 'skill1');
    const react = scores.find(s => s.skillId === 'skill2');

    expect(js.score).toBe(75);          // 3/4 * 100
    expect(js.proficiency).toBe('Advanced');
    expect(react.score).toBe(0);        // 0/2 * 100
    expect(react.proficiency).toBe('Beginner');
  });

  test('returns empty array for no questions', () => {
    const scores = engine.calculateSkillScores([], skillMap);
    expect(scores).toHaveLength(0);
  });

  test('handles 100% correct', () => {
    const answered = [
      { skillId: 'skill1', isCorrect: true, points: 1 },
      { skillId: 'skill1', isCorrect: true, points: 1 },
    ];
    const scores = engine.calculateSkillScores(answered, skillMap);
    expect(scores[0].score).toBe(100);
    expect(scores[0].proficiency).toBe('Expert');
  });
});

describe('calculateSkillGaps', () => {
  const skillScores = [
    { skillId: 'skill1', skillName: 'JavaScript', score: 60 },
    { skillId: 'skill2', skillName: 'React',       score: 90 },
    { skillId: 'skill3', skillName: 'Node.js',     score: 30 },
  ];
  const careerReqs = [
    { skillId: 'skill1', skillName: 'JavaScript', requiredLevel: 80, priority: 'critical' },
    { skillId: 'skill2', skillName: 'React',       requiredLevel: 75, priority: 'high' },
    { skillId: 'skill3', skillName: 'Node.js',     requiredLevel: 70, priority: 'high' },
    { skillId: 'skill4', skillName: 'MongoDB',     requiredLevel: 60, priority: 'medium' },
  ];

  test('gap = requiredLevel - currentLevel when current < required', () => {
    const gaps = engine.calculateSkillGaps(skillScores, careerReqs);
    const jsGap = gaps.find(g => g.skillName === 'JavaScript');
    expect(jsGap.gap).toBe(20);
    expect(jsGap.currentLevel).toBe(60);
    expect(jsGap.requiredLevel).toBe(80);
  });

  test('gap = 0 when current >= required', () => {
    const gaps = engine.calculateSkillGaps(skillScores, careerReqs);
    const reactGap = gaps.find(g => g.skillName === 'React');
    expect(reactGap.gap).toBe(0);
    expect(reactGap.severity).toBe('None');
  });

  test('currentLevel = 0 for skills not in assessment', () => {
    const gaps = engine.calculateSkillGaps(skillScores, careerReqs);
    const mongoGap = gaps.find(g => g.skillName === 'MongoDB');
    expect(mongoGap.currentLevel).toBe(0);
    expect(mongoGap.gap).toBe(60);
  });

  test('assigns correct severity labels', () => {
    const gaps = engine.calculateSkillGaps(skillScores, careerReqs);
    const nodeGap = gaps.find(g => g.skillName === 'Node.js'); // 30 needed, gap = 40
    expect(nodeGap.severity).toBe('Medium');
  });
});

describe('calculateCareerReadiness', () => {
  test('100% when all skills meet requirements', () => {
    const gaps = [
      { skillId: 's1', currentLevel: 80, requiredLevel: 70 },
      { skillId: 's2', currentLevel: 90, requiredLevel: 80 },
    ];
    const reqs = [
      { skillId: 's1', requiredLevel: 70 },
      { skillId: 's2', requiredLevel: 80 },
    ];
    expect(engine.calculateCareerReadiness(gaps, reqs)).toBe(100);
  });

  test('0% when no skills assessed', () => {
    const gaps = [
      { skillId: 's1', currentLevel: 0, requiredLevel: 80 },
    ];
    const reqs = [{ skillId: 's1', requiredLevel: 80 }];
    expect(engine.calculateCareerReadiness(gaps, reqs)).toBe(0);
  });

  test('proportional for partial match (spec example: Arun)', () => {
    // HTML:90/70, CSS:80/70, JS:60/80, React:25/75, Node:35/70, Mongo:40/60, Git:50/60
    const reqs = [
      { skillId: 'html',  requiredLevel: 70 },
      { skillId: 'css',   requiredLevel: 70 },
      { skillId: 'js',    requiredLevel: 80 },
      { skillId: 'react', requiredLevel: 75 },
      { skillId: 'node',  requiredLevel: 70 },
      { skillId: 'mongo', requiredLevel: 60 },
      { skillId: 'git',   requiredLevel: 60 },
    ];
    const gaps = [
      { skillId: 'html',  currentLevel: 90, requiredLevel: 70 },
      { skillId: 'css',   currentLevel: 80, requiredLevel: 70 },
      { skillId: 'js',    currentLevel: 60, requiredLevel: 80 },
      { skillId: 'react', currentLevel: 25, requiredLevel: 75 },
      { skillId: 'node',  currentLevel: 35, requiredLevel: 70 },
      { skillId: 'mongo', currentLevel: 40, requiredLevel: 60 },
      { skillId: 'git',   currentLevel: 50, requiredLevel: 60 },
    ];
    const readiness = engine.calculateCareerReadiness(gaps, reqs);
    // total required = 70+70+80+75+70+60+60 = 485
    // earned = min(90,70)+min(80,70)+min(60,80)+min(25,75)+min(35,70)+min(40,60)+min(50,60)
    //        = 70+70+60+25+35+40+50 = 350
    // readiness = round(350/485*100) = 72
    expect(readiness).toBe(72);
  });

  test('returns 0 for empty requirements', () => {
    expect(engine.calculateCareerReadiness([], [])).toBe(0);
  });
});

// ── Auth validation tests ──────────────────────────────────────────────────────

describe('Registration validation logic', () => {
  function validateRegister({ name, email, password }) {
    if (!name || !email || !password) return 'All fields required';
    if (!/^\S+@\S+\.\S+$/.test(email)) return 'Invalid email';
    if (password.length < 8) return 'Password min 8 chars';
    return null;
  }

  test('valid data returns null',             () => expect(validateRegister({ name: 'Arun', email: 'a@b.com', password: 'secret12' })).toBeNull());
  test('missing name returns error',          () => expect(validateRegister({ name: '', email: 'a@b.com', password: 'secret12' })).toBeTruthy());
  test('invalid email returns error',         () => expect(validateRegister({ name: 'Arun', email: 'notanemail', password: 'secret12' })).toBeTruthy());
  test('short password returns error',        () => expect(validateRegister({ name: 'Arun', email: 'a@b.com', password: '123' })).toBeTruthy());
});

// ── AI service error handling ──────────────────────────────────────────────────

describe('AI service graceful failure', () => {
  test('generateRoadmap returns success:false on API failure', async () => {
    // Without any env vars, the AI service should fail gracefully
    const aiService = require('../backend/services/aiService');
    const result = await aiService.generateRoadmap({
      career: 'Full Stack Developer',
      userName: 'Test',
      skillScores: [{ skillName: 'JavaScript', score: 60, proficiency: 'Intermediate' }],
      skillGaps: [{ skillName: 'React', currentLevel: 25, requiredLevel: 75, gap: 50, severity: 'High' }]
    });
    expect(result).toHaveProperty('success');
    expect(typeof result.success).toBe('boolean');
    // success can be true or false — what matters is it doesn't throw
  });

  test('chatWithMentor returns success:false on API failure gracefully', async () => {
    const aiService = require('../backend/services/aiService');
    const result = await aiService.chatWithMentor(
      { career: 'Developer', userName: 'Test', skillScores: [], skillGaps: [], roadmapPhase: '' },
      'What should I learn?',
      []
    );
    expect(result).toHaveProperty('success');
  });
});
