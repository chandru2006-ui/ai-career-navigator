require('dotenv').config();
const mongoose = require('mongoose');

const Skill      = require('../backend/models/Skill');
const Career     = require('../backend/models/Career');
const Question   = require('../backend/models/Question');

const skillsData   = require('./skillsData');
const careersData  = require('./careersData');
const htmlCssJs    = require('./questions/htmlCssJs');
const reactNode    = require('./questions/reactNode');
const other        = require('./questions/other');

const allQuestions = [...htmlCssJs, ...reactNode, ...other];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected for seeding');

    // ── Skills ──────────────────────────────────────────────────────────────
    console.log('\n🌱 Seeding skills...');
    await Skill.deleteMany({});
    const insertedSkills = await Skill.insertMany(skillsData);
    console.log(`   ✔ Inserted ${insertedSkills.length} skills`);

    // Build skill name → _id map
    const skillMap = {};
    insertedSkills.forEach(s => { skillMap[s.name] = s._id; });

    // ── Careers ─────────────────────────────────────────────────────────────
    console.log('\n🌱 Seeding careers...');
    await Career.deleteMany({});

    const careersToInsert = careersData.map(career => {
      const resolvedSkills = career.requiredSkills
        .filter(rs => skillMap[rs.skillName])
        .map(rs => ({
          skillId:       skillMap[rs.skillName],
          requiredLevel: rs.requiredLevel,
          priority:      rs.priority,
          category:      rs.category
        }));

      return {
        title:          career.title,
        icon:           career.icon,
        description:    career.description,
        avgSalary:      career.avgSalary,
        jobDemand:      career.jobDemand,
        requiredSkills: resolvedSkills
      };
    });

    const insertedCareers = await Career.insertMany(careersToInsert);
    console.log(`   ✔ Inserted ${insertedCareers.length} careers`);

    // ── Questions ────────────────────────────────────────────────────────────
    console.log('\n🌱 Seeding questions...');
    await Question.deleteMany({});

    const questionsToInsert = allQuestions
      .filter(q => skillMap[q.skillName])
      .map(q => ({
        skillId:       skillMap[q.skillName],
        question:      q.question,
        options:       q.options,
        correctAnswer: q.correctAnswer,
        difficulty:    q.difficulty,
        explanation:   q.explanation || '',
        points:        q.points || 1
      }));

    const insertedQuestions = await Question.insertMany(questionsToInsert);
    console.log(`   ✔ Inserted ${insertedQuestions.length} questions`);

    // ── Summary ──────────────────────────────────────────────────────────────
    console.log('\n📊 Seed Summary:');
    console.log(`   Skills:    ${insertedSkills.length}`);
    console.log(`   Careers:   ${insertedCareers.length}`);
    console.log(`   Questions: ${insertedQuestions.length}`);

    const byDifficulty = { easy: 0, medium: 0, hard: 0 };
    questionsToInsert.forEach(q => { byDifficulty[q.difficulty]++; });
    console.log(`   Easy: ${byDifficulty.easy}  Medium: ${byDifficulty.medium}  Hard: ${byDifficulty.hard}`);

    console.log('\n✅ Database seeded successfully!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err.message);
    process.exit(1);
  }
}

seed();
