# 🛠 Developer Guide — AI Career Navigator

Complete guide for developers who want to understand, extend, or modify the codebase.

---

## Quick Start (TL;DR)

```bash
# 1. Install
npm install

# 2. Configure
cp .env.example .env
# Edit .env: set MONGODB_URI and ANTHROPIC_API_KEY (or OPENAI_API_KEY)

# 3. Seed database
npm run seed

# 4. Run
npm run dev       # http://localhost:5000

# 5. Test
npm test
```

---

## Where to Change Things

### Change the port
`.env` → `PORT=5001`

### Add a new career
Edit `seed/careersData.js` — add an entry, then run `npm run seed`.
No frontend or backend code changes needed.

### Add questions for a skill
Edit `seed/questions/other.js` (or create a new file and import it in `seed/index.js`).
Run `npm run seed`.

### Change AI provider
`.env` → `AI_PROVIDER=openai` (then set `OPENAI_API_KEY` and `OPENAI_MODEL`)

### Change JWT expiry
`.env` → `JWT_EXPIRES_IN=30d`

### Change total assessment questions
`backend/controllers/assessmentController.js` → `const TOTAL_QUESTIONS = 30;`

### Change proficiency thresholds
`backend/services/assessmentEngine.js` → `classifyProficiency()`

### Change gap severity thresholds
`backend/services/assessmentEngine.js` → `classifyGapSeverity()`

### Change adaptive difficulty rules
`backend/services/assessmentEngine.js` → `nextDifficulty()`

---

## Codebase Architecture

### Frontend (`frontend/`)

Pure HTML + CSS + Vanilla JS. No framework, no build step.

**Key files:**
- `js/api.js` — Central API helper. Every fetch goes through here. Contains `api.get()`, `api.post()`, etc., plus utilities like `showToast()`, `setLoading()`, `formatDate()`
- `js/sidebar.js` — Builds the sidebar HTML and injects it into each page
- `css/main.css` — Complete design system with CSS variables. Dark theme by default

**How pages communicate with backend:**
```javascript
// Every page uses api.js helpers
const data = await api.getDashboard();   // GET /api/dashboard
await api.updateProgress({ ... });       // PUT /api/roadmap/progress
```

**Authentication flow:**
1. Login → backend returns JWT token
2. `setToken(token)` stores it in `localStorage`
3. All subsequent `api.*` calls include `Authorization: Bearer <token>`
4. On 401 response → `removeToken()` + redirect to `/login.html`
5. Protected pages call `requireAuth()` at top → redirects if no token

---

### Backend (`backend/`)

**Request lifecycle:**
```
HTTP Request
    ↓
server.js (CORS, JSON body parser, Morgan logger)
    ↓
routes/xxx.js (path matching)
    ↓
middleware/auth.js (JWT verification if protected)
    ↓
controllers/xxxController.js (business logic)
    ↓
services/ (AI, assessment engine)  +  models/ (MongoDB queries)
    ↓
HTTP Response (JSON)
    ↓
middleware/errorHandler.js (catches any uncaught errors)
```

**Key services:**

`backend/services/assessmentEngine.js` — Pure functions, no DB:
- `classifyProficiency(score)` → 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
- `classifyGapSeverity(gap)` → 'None' | 'Minimal' | 'Low' | 'Medium' | 'High' | 'Very High'
- `nextDifficulty(current, consecutiveCorrect, consecutiveWrong)` → new difficulty
- `calculateSkillScores(answeredQuestions, skillMap)` → per-skill score array
- `calculateSkillGaps(skillScores, careerRequirements)` → gap array
- `calculateCareerReadiness(skillGaps, careerRequirements)` → 0-100

`backend/services/aiService.js` — AI abstraction:
- `generateRoadmap(context)` → `{ success, data }` — never throws
- `chatWithMentor(context, message, history)` → `{ success, message }` — never throws
- `generateLearningAdvice(context)` → `{ success, advice }` — never throws

All AI functions return `{ success: false, error }` on failure, never throw. Controllers check `aiResult.success` and fall back gracefully.

---

### Database Models

**Users** → stores hashed password, career goal reference, selected skills
**Skills** → name, category, icon (seed data)
**Careers** → title, icon, requiredSkills array with skillId + requiredLevel + priority
**Questions** → skillId, question, options[4], correctAnswer(0-3), difficulty, explanation
**Assessment** → in-progress state: userId, careerId, questions array with selectedAnswer + isCorrect, adaptive counters
**AssessmentResult** → completed results: skillScores, skillGaps, overallScore, careerReadiness, attemptNumber
**Roadmap** → phases array with title, topics, status, progressPercentage, overallProgress
**ChatSession** → messages array with role ('user'|'assistant') and content

---

## Adding a New Feature

### Example: Add a new skill "TypeScript"

1. It's already in `seed/skillsData.js`! Just run `npm run seed`
2. To add it to a career requirement: edit `seed/careersData.js`, add it to the relevant career's `requiredSkills` array
3. Add questions: edit `seed/questions/other.js`, add question objects with `skillName: 'TypeScript'`
4. Run `npm run seed`

### Example: Add a new API endpoint

```javascript
// 1. Add controller function in backend/controllers/someController.js
exports.myNewEndpoint = async (req, res, next) => {
  try {
    const data = await SomeModel.find({ userId: req.user._id });
    res.json({ success: true, data });
  } catch (err) {
    next(err); // goes to errorHandler middleware
  }
};

// 2. Add route in backend/routes/someRoute.js
const { myNewEndpoint } = require('../controllers/someController');
router.get('/new-path', protect, myNewEndpoint);

// 3. Mount in backend/server.js (if new file)
app.use('/api/something', require('./routes/someRoute'));

// 4. Add helper in frontend/js/api.js
api.myNewCall = () => api.get('/something/new-path');

// 5. Call from frontend page
const data = await api.myNewCall();
```

### Example: Add a new frontend page

```html
<!-- new-page.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="/css/main.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
<div class="page-layout">
  <div id="sidebar-placeholder"></div>
  <div class="main-content">
    <header class="page-header">
      <button class="hamburger" id="hamburger">☰</button>
      <div class="page-title">My New Page</div>
    </header>
    <main class="page-body">
      <!-- content here -->
    </main>
  </div>
</div>
<script src="/js/api.js"></script>
<script src="/js/sidebar.js"></script>
<script>
  if (!requireAuth()) throw new Error('not auth');
  injectSidebar('my-page-name'); // must match data-page in sidebar.js nav
</script>
</body>
</html>
```

Then add to the `nav` array in `frontend/js/sidebar.js`:
```javascript
{ page: 'my-page-name', icon: '📌', label: 'My Page', href: '/new-page.html' },
```

---

## CSS Design System

All colors and spacing are CSS variables in `main.css`:

```css
:root {
  --primary:       #4F46E5;   /* indigo */
  --accent:        #06B6D4;   /* cyan */
  --success:       #10B981;   /* green */
  --warning:       #F59E0B;   /* amber */
  --danger:        #EF4444;   /* red */
  --bg:            #0F172A;   /* dark background */
  --bg-card:       #1E293B;   /* card background */
  --text:          #F1F5F9;   /* primary text */
  --text-muted:    #94A3B8;   /* secondary text */
  --border:        #334155;   /* border color */
}
```

**Component classes available:**
- `.card` — standard card container
- `.btn .btn-primary .btn-secondary .btn-outline .btn-ghost` — buttons
- `.badge .badge-green .badge-red .badge-yellow .badge-cyan .badge-blue` — status badges
- `.progress-bar-wrap` + `.progress-bar-fill` — progress bars
- `.alert .alert-success .alert-error .alert-warning .alert-info` — alerts
- `.form-group .form-label .form-input .form-select` — form elements
- `.stat-card .stat-icon .stat-value .stat-label` — stat display cards
- `.grid-2 .grid-3 .grid-4` — responsive grid layouts
- `.empty-state` — empty state with icon, title, description

---

## AI Service Deep Dive

### How context is built for AI calls

In `mentorController.js`, before calling AI:
```javascript
const context = {
  career: 'Full Stack Developer',
  userName: 'Arun',
  skillScores: [
    { skillName: 'JavaScript', score: 60, proficiency: 'Intermediate' },
    // ...
  ],
  skillGaps: [
    { skillName: 'React', gap: 50, currentLevel: 25, requiredLevel: 75 },
    // ...
  ],
  roadmapPhase: 'React Fundamentals'  // current roadmap phase
};
```

This context is embedded in the system prompt so the AI always knows:
- Who the user is
- What they're aiming for
- What they know and what they're missing

### Roadmap AI prompt

The roadmap generator asks for structured JSON output:
```json
{
  "summary": "...",
  "totalDuration": "X weeks",
  "phases": [
    {
      "phaseNumber": 1,
      "title": "...",
      "duration": "2 weeks",
      "skills": ["React"],
      "topics": ["Components", "Props", "State", "Hooks"],
      "reason": "React has the largest gap (50 points)",
      "practicalExercises": ["Build a todo app in React"],
      "resources": ["React official docs", "freeCodeCamp"]
    }
  ]
}
```

If parsing fails or AI is unavailable, the system falls back to a deterministic roadmap ordered by gap severity.

### Changing the AI model

In `.env`:
```
# Use a more capable (and expensive) model:
ANTHROPIC_MODEL=claude-opus-5
# or
OPENAI_MODEL=gpt-4o
```

### Adding a new AI provider

1. Add a new function in `backend/services/aiService.js`:
```javascript
async function callMyProvider(systemPrompt, userMessage, maxTokens) {
  // your implementation
}
```
2. Update the dispatch in `callAI()`:
```javascript
if (AI_PROVIDER === 'myprovider') return callMyProvider(...);
```
3. Set `AI_PROVIDER=myprovider` in `.env`

---

## Security Notes

- Passwords hashed with `bcryptjs` (12 salt rounds)
- JWT secret must be long and random in production
- AI API keys live only in `.env` — never sent to frontend
- Input validated in controllers before DB operations
- Error messages sanitized — no stack traces in production (`NODE_ENV=production`)
- Rate limiting on AI endpoints (20 req/min via `express-rate-limit`)
- CORS configured via `FRONTEND_URL` env variable

---

## Performance Notes

- Assessment questions fetched per-question (not all at once) to support large question banks
- MongoDB indexes on: `{ userId, careerId, completedAt }` for results, `{ skillId, difficulty }` for questions
- AI calls are the only slow operations — loading indicators are shown for all of them
- Chat history limited to last 20 messages per API call to stay within token limits

---

## Common Patterns Used

### Graceful async error handling
Every controller wraps logic in `try/catch` and calls `next(err)` — the global `errorHandler` middleware catches it and returns a clean JSON response.

### Loading states
Every async operation in the frontend:
1. Calls `setLoading(btn, true, 'Loading...')` before the fetch
2. Calls `setLoading(btn, false)` in `finally` block
3. Shows a spinner or replaces content with a loading state

### Empty states
Every list/result page checks for empty data and shows a meaningful empty state with a call-to-action button rather than a blank page.

### AI fallback pattern
```javascript
const aiResult = await aiService.generateRoadmap(context);
if (aiResult.success) {
  // use AI result
} else {
  // use system fallback
}
// Never crash — always give the user something useful
```
