# 🎯 AI Career Navigator

**AI-Powered Adaptive Skill Gap Analyser & Personalized Career Roadmap**

A full-stack web application that helps students and job seekers identify their current skill levels, calculate precise skill gaps against industry requirements, generate AI-powered personalized learning roadmaps, and get guidance from an AI Career Mentor.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Technology Stack](#technology-stack)
5. [Folder Structure](#folder-structure)
6. [Prerequisites](#prerequisites)
7. [Installation](#installation)
8. [Environment Variables](#environment-variables)
9. [MongoDB Setup](#mongodb-setup)
10. [AI API Setup](#ai-api-setup)
11. [Database Seeding](#database-seeding)
12. [Running the Application](#running-the-application)
13. [API Overview](#api-overview)
14. [Example User Flow](#example-user-flow)
15. [How Adaptive Assessment Works](#how-adaptive-assessment-works)
16. [How Skill Gap Calculation Works](#how-skill-gap-calculation-works)
17. [Running Tests](#running-tests)
18. [Troubleshooting](#troubleshooting)

---

## Project Overview

AI Career Navigator guides users through this complete lifecycle:

```
Register → Profile → Select Career → Adaptive Assessment → Scoring
→ Skill Gap Analysis → Personalized Roadmap → AI Mentor
→ Progress Tracking → Reassessment → Adaptive Roadmap → Repeat
```

**Key design principle:** Core functionality (scoring, gap analysis, progress) is fully deterministic and works without AI. AI enhances the experience with personalized roadmaps and mentor conversations.

---

## Features

- **Adaptive Skill Assessment** — Questions adjust difficulty based on performance (Easy → Medium → Hard and back)
- **Precise Skill Gap Analysis** — Numerically calculates gap between your level and career requirements
- **10 Career Paths** — Full Stack, Frontend, Backend, Data Science, AI/ML, Cybersecurity, Cloud, Blockchain, Software Dev, Data Analysis
- **25+ Skills Tracked** — JavaScript, React, Python, ML, SQL, Docker, Blockchain, and more
- **100+ Assessment Questions** — Multi-difficulty, per-skill, with explanations
- **AI-Generated Roadmap** — Personalized phases based on your specific gaps
- **AI Career Mentor** — Context-aware chat knowing your skills, gaps, and goals
- **Progress Tracking** — Phase-by-phase progress with percentage sliders
- **Reassessment & Adaptation** — Retake assessment; roadmap adapts to new skill levels
- **Responsive UI** — Works on desktop, tablet, and mobile
- **JWT Authentication** — Secure, stateless auth with bcrypt password hashing
- **Graceful AI Fallback** — App works fully even when AI API is unavailable

---

## Architecture

```
Browser (HTML + CSS + Vanilla JS)
        │
        │ REST API (JSON over HTTP)
        ▼
Node.js + Express.js Backend
        │
   ┌────┴────┐
   ▼         ▼
MongoDB    AI Service Layer
(Mongoose)     │
           ┌───┴───┐
           ▼       ▼
      Anthropic   OpenAI
      Claude API  GPT API
```

**Backend layers:**
```
Routes → Controllers → Services → Models (MongoDB)
                    ↘
                  AI Service → LLM Provider
```

---

## Technology Stack

| Layer        | Technology                                    |
|-------------|-----------------------------------------------|
| Frontend    | HTML5, CSS3, Vanilla JavaScript, Fetch API    |
| Backend     | Node.js 18+, Express.js 4                    |
| Database    | MongoDB (local or Atlas), Mongoose 8          |
| Auth        | JWT (jsonwebtoken), bcryptjs                  |
| AI          | Anthropic Claude (default) or OpenAI GPT     |
| Testing     | Jest                                          |

---

## Folder Structure

```
ai-career-navigator/
│
├── frontend/                  # Static HTML/CSS/JS frontend
│   ├── index.html             # Landing page
│   ├── login.html             # Login page
│   ├── register.html          # Registration page
│   ├── dashboard.html         # Main dashboard
│   ├── profile.html           # Profile & career goal
│   ├── assessment.html        # Adaptive skill assessment
│   ├── results.html           # Skill gap analysis results
│   ├── roadmap.html           # Learning roadmap
│   ├── mentor.html            # AI Career Mentor chat
│   ├── css/
│   │   └── main.css           # Complete design system
│   └── js/
│       ├── api.js             # API helper + utilities
│       └── sidebar.js         # Shared sidebar component
│
├── backend/
│   ├── server.js              # Express app entry point
│   ├── config/
│   │   └── database.js        # MongoDB connection
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Skill.js           # Skill schema
│   │   ├── Career.js          # Career + requirements schema
│   │   ├── Question.js        # Assessment question schema
│   │   ├── Assessment.js      # In-progress assessment state
│   │   ├── AssessmentResult.js # Completed result + gaps
│   │   ├── Roadmap.js         # Learning roadmap schema
│   │   └── ChatSession.js     # AI mentor conversation schema
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── profileController.js
│   │   ├── careerController.js
│   │   ├── skillController.js
│   │   ├── assessmentController.js
│   │   ├── roadmapController.js
│   │   ├── mentorController.js
│   │   └── dashboardController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── profile.js
│   │   ├── careers.js
│   │   ├── skills.js
│   │   ├── assessment.js
│   │   ├── roadmap.js
│   │   ├── mentor.js
│   │   └── dashboard.js
│   ├── services/
│   │   ├── aiService.js       # AI abstraction layer (Anthropic/OpenAI)
│   │   └── assessmentEngine.js # Adaptive scoring + gap calculation
│   ├── middleware/
│   │   ├── auth.js            # JWT protection middleware
│   │   └── errorHandler.js    # Global error handler
│   ├── utils/
│   │   └── helpers.js
│   └── validators/
│       └── index.js
│
├── seed/                      # Database seed data
│   ├── index.js               # Main seed runner
│   ├── skillsData.js          # 25 skills
│   ├── careersData.js         # 10 careers with requirements
│   └── questions/
│       ├── htmlCssJs.js       # HTML, CSS, JavaScript questions
│       ├── reactNode.js       # React, Node.js, Express, MongoDB, REST, Git
│       └── other.js           # Python, DSA, ML, SQL, Cybersecurity, Cloud, Blockchain
│
├── tests/
│   └── engine.test.js         # 45 unit tests
│
├── .env.example               # Environment variable template
├── jest.config.json
├── package.json
├── README.md
└── DEVELOPER_GUIDE.md
```

---

## Prerequisites

- **Node.js** v18 or higher — https://nodejs.org
- **MongoDB** v6+ (local) or a **MongoDB Atlas** account (cloud)
- **AI API Key** — Anthropic Claude or OpenAI (optional but recommended)

Verify your setup:
```bash
node --version    # Should show v18+
npm --version     # Should show 9+
mongod --version  # If using local MongoDB
```

---

## Installation

```bash
# 1. Clone or extract the project
cd ai-career-navigator

# 2. Install dependencies
npm install

# 3. Create your .env file
cp .env.example .env
# Then edit .env with your values (see next section)

# 4. Seed the database
npm run seed

# 5. Start the server
npm start
# or for development with auto-reload:
npm run dev
```

Open **http://localhost:5000** in your browser.

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB — choose one:
MONGODB_URI=mongodb://localhost:27017/ai_career_navigator
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai_career_navigator

# JWT Secret — use a long random string in production
JWT_SECRET=change_this_to_a_long_random_secret_string
JWT_EXPIRES_IN=7d

# AI Provider — choose anthropic or openai
AI_PROVIDER=anthropic

# Anthropic Claude (recommended)
ANTHROPIC_API_KEY=sk-ant-api03-...
ANTHROPIC_MODEL=claude-haiku-4-5-20251001

# OpenAI (alternative — comment out Anthropic vars and use these)
# AI_PROVIDER=openai
# OPENAI_API_KEY=sk-proj-...
# OPENAI_MODEL=gpt-3.5-turbo
```

> ⚠️ **Never commit your `.env` file to version control.**

---

## MongoDB Setup

### Option A — Local MongoDB

1. Install MongoDB Community Edition: https://www.mongodb.com/try/download/community
2. Start the service:
   ```bash
   # macOS / Linux
   mongod --dbpath /data/db

   # Windows (as a service)
   net start MongoDB
   ```
3. Set in `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/ai_career_navigator
   ```

### Option B — MongoDB Atlas (Cloud, Free Tier)

1. Go to https://cloud.mongodb.com and create a free account
2. Create a free **M0** cluster
3. In **Database Access** → Add user with password
4. In **Network Access** → Add IP `0.0.0.0/0` (allow all) or your IP
5. Click **Connect** → **Connect your application** → copy the URI
6. Set in `.env`:
   ```
   MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.abc.mongodb.net/ai_career_navigator
   ```

---

## AI API Setup

### Option A — Anthropic Claude (Recommended)

1. Go to https://console.anthropic.com
2. Sign up and go to **API Keys**
3. Create a new key
4. In `.env`:
   ```
   AI_PROVIDER=anthropic
   ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
   ANTHROPIC_MODEL=claude-haiku-4-5-20251001
   ```

### Option B — OpenAI GPT

1. Go to https://platform.openai.com/api-keys
2. Create a new secret key
3. In `.env`:
   ```
   AI_PROVIDER=openai
   OPENAI_API_KEY=sk-proj-your-key-here
   OPENAI_MODEL=gpt-3.5-turbo
   ```

### No API Key?

The app still works fully without an AI key:
- Assessment, scoring, skill gap analysis — all work normally
- Roadmap generation falls back to a system-generated roadmap based on your gaps
- AI Mentor shows a helpful fallback message
- Everything else is unaffected

---

## Database Seeding

Run once after setting `MONGODB_URI` in `.env`:

```bash
npm run seed
```

This inserts:
- **25 skills** (JavaScript, React, Python, ML, SQL, Docker, Blockchain, etc.)
- **10 careers** with realistic required skill levels and priorities
- **100+ questions** across 3 difficulty levels for all skills

Re-running seed **replaces** all existing seed data (users and results are preserved).

Expected output:
```
✅ MongoDB Connected
🌱 Seeding skills...   ✔ Inserted 25 skills
🌱 Seeding careers...  ✔ Inserted 10 careers
🌱 Seeding questions... ✔ Inserted 107 questions
   Easy: 38  Medium: 49  Hard: 20
✅ Database seeded successfully!
```

---

## Running the Application

```bash
# Production mode
npm start

# Development mode (auto-restarts on file changes)
npm run dev
```

The server serves both the API and the frontend:

| URL                           | Description              |
|-------------------------------|--------------------------|
| http://localhost:5000          | Landing page             |
| http://localhost:5000/login.html | Login page            |
| http://localhost:5000/register.html | Registration       |
| http://localhost:5000/dashboard.html | Dashboard         |
| http://localhost:5000/api/health | API health check      |

---

## API Overview

All API routes return JSON. Protected routes require:
```
Authorization: Bearer <jwt_token>
```

### Authentication
```
POST /api/auth/register    — Register new user
POST /api/auth/login       — Login, receive JWT
GET  /api/auth/me          — Get current user (protected)
```

### Profile
```
GET  /api/profile          — Get full profile
PUT  /api/profile          — Update profile, career goal, skills
```

### Careers & Skills
```
GET  /api/careers          — List all active careers
GET  /api/careers/:id      — Career with skill requirements
GET  /api/skills           — List all skills
```

### Assessment (Adaptive)
```
POST /api/assessment/start             — Start new assessment
GET  /api/assessment/:id/question?index=N — Get question N
POST /api/assessment/:id/answer        — Submit answer, get feedback
POST /api/assessment/:id/submit        — Calculate & save results
GET  /api/assessment/:id/result        — Get result by assessment ID
GET  /api/assessment/latest            — Latest result for current user
GET  /api/assessment/history           — All past results
```

### Dashboard & Skill Gaps
```
GET  /api/dashboard          — Complete dashboard data
GET  /api/dashboard/skill-gaps — Current skill gaps
```

### Roadmap
```
POST /api/roadmap/generate     — AI-generate personalized roadmap
GET  /api/roadmap              — Get active roadmap
GET  /api/roadmap/all          — All roadmap versions
PUT  /api/roadmap/progress     — Update phase progress/status
POST /api/roadmap/recalculate  — Regenerate after reassessment
```

### AI Mentor
```
POST /api/mentor/chat           — Send message, receive AI response
GET  /api/mentor/history        — List past sessions
GET  /api/mentor/session/:id    — Get full session messages
DELETE /api/mentor/session/:id  — Archive session
```

---

## Example User Flow

Following the spec example (Arun, Full Stack Developer):

1. **Register** at `/register.html` with name, email, password
2. **Set profile** at `/profile.html` — select Full Stack Developer as career goal
3. **Take assessment** at `/assessment.html` — 30 adaptive questions
4. **View results** — Example scores:
   ```
   HTML: 90%  (Expert)      CSS: 80% (Advanced)
   JavaScript: 60% (Int.)   React: 25% (Beginner)
   Node.js: 35% (Beginner)  MongoDB: 40% (Int.)
   ```
5. **Skill gaps calculated** deterministically:
   ```
   HTML:  required=70, current=90, gap=0  (✓ Met)
   CSS:   required=70, current=80, gap=0  (✓ Met)
   JS:    required=80, current=60, gap=20 (Low)
   React: required=75, current=25, gap=50 (High)
   Node:  required=70, current=35, gap=35 (Medium)
   Mongo: required=60, current=40, gap=20 (Low)
   ```
6. **Career Readiness** = 72% (deterministic calculation)
7. **AI generates roadmap** with phases prioritizing React (gap 50) → Node.js (35) → JavaScript (20) → MongoDB (20)
8. **User marks progress** on each phase using the slider
9. **AI Mentor answers** questions like "What should I learn first in React?"
10. **Reassessment** after learning — new scores update gaps and roadmap adapts

---

## How Adaptive Assessment Works

```
Start → Easy question
  ↓ Correct × 2 → Promote to Medium
  ↓ Correct × 2 → Promote to Hard
  ↓ Wrong  × 2 → Demote to Medium
  ↓ Wrong  × 2 → Demote to Easy

Duplicate questions are never shown in the same assessment.
```

Difficulty transitions (`assessmentEngine.js`):
```
consecutiveCorrect >= 2:  easy→medium, medium→hard, hard→hard
consecutiveWrong   >= 2:  hard→medium, medium→easy, easy→easy
otherwise:                stay at current difficulty
```

---

## How Skill Gap Calculation Works

All calculations are purely deterministic — no AI involved:

```javascript
gap = Math.max(0, requiredLevel - currentLevel)

// Example:
// required React = 75
// current  React = 30
// gap           = 45

severity:
  gap 0    → None
  gap 1–10 → Minimal
  gap 11–25→ Low
  gap 26–40→ Medium
  gap 41–60→ High
  gap 61+  → Very High

proficiency:
  score 0–39  → Beginner
  score 40–69 → Intermediate
  score 70–84 → Advanced
  score 85–100→ Expert

careerReadiness = round(
  sum(min(currentLevel, requiredLevel) for each skill) /
  sum(requiredLevel for each skill) × 100
)
```

---

## Running Tests

```bash
# Run all tests
npm test

# Run with coverage report
npm test -- --coverage

# Watch mode during development
npm test -- --watch
```

All 45 tests should pass:
- `classifyProficiency` — 8 tests
- `classifyGapSeverity` — 10 tests
- `nextDifficulty` — 8 tests (adaptive engine)
- `calculateSkillScores` — 3 tests
- `calculateSkillGaps` — 4 tests
- `calculateCareerReadiness` — 4 tests (including Arun's example)
- Registration validation — 4 tests
- AI graceful failure — 2 tests

---

## Troubleshooting

### MongoDB connection fails
```
❌ MongoDB Connection Error: ...
```
- Check `MONGODB_URI` in your `.env`
- For local: ensure `mongod` is running
- For Atlas: check IP whitelist and credentials

### No questions in assessment
```
No questions available for this career.
```
- Run `npm run seed` to populate the database

### AI responses not working
- Check your API key in `.env`
- Verify `AI_PROVIDER` matches your key type (`anthropic` or `openai`)
- The app works without AI — you'll see fallback responses

### Port already in use
```
EADDRINUSE: address already in use :::5000
```
Change `PORT=5001` in `.env` (or kill the existing process)

### JWT errors / redirect loops
- Clear `localStorage` in browser dev tools
- Hard refresh with Ctrl+Shift+R

### Seed fails with duplicate key error
```
duplicate key error: { name: "JavaScript" }
```
This is harmless — seed deletes then re-inserts. If it persists, run:
```bash
# In MongoDB shell
use ai_career_navigator
db.skills.drop()
db.careers.drop()
db.questions.drop()
```
Then re-run `npm run seed`.
