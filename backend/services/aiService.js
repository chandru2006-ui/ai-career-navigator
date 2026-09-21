/**
 * AI Service Abstraction Layer
 *
 * Supported providers:
 * - Anthropic
 * - Google Gemini
 * - OpenAI
 * - Groq
 *
 * Provider is configured using:
 * AI_PROVIDER=groq
 */

const AI_PROVIDER =
  process.env.AI_PROVIDER || 'anthropic';


// ============================================================
// COMMON HELPERS
// ============================================================

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


// ============================================================
// ANTHROPIC
// ============================================================

async function callAnthropic(
  systemPrompt,
  userMessage,
  maxTokens = 1500
) {
  const apiKey =
    process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error(
      'ANTHROPIC_API_KEY not configured'
    );
  }

  const model =
    process.env.ANTHROPIC_MODEL ||
    'claude-haiku-4-5-20251001';

  const response = await fetch(
    'https://api.anthropic.com/v1/messages',
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },

      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        system: systemPrompt,

        messages: [
          {
            role: 'user',
            content: userMessage
          }
        ]
      })
    }
  );

  if (!response.ok) {
    const err =
      await response.text();

    throw new Error(
      `Anthropic API error ${response.status}: ${err}`
    );
  }

  const data =
    await response.json();

  if (
    !data.content ||
    !data.content[0] ||
    !data.content[0].text
  ) {
    throw new Error(
      'Anthropic returned an empty response'
    );
  }

  return data.content[0].text;
}


// ============================================================
// GEMINI RETRY HELPER
// ============================================================

async function fetchGeminiWithRetry(
  url,
  options,
  label = 'Gemini'
) {
  const maxAttempts = 3;

  const retryDelays = [
    3000,
    7000,
    12000
  ];

  for (
    let attempt = 1;
    attempt <= maxAttempts;
    attempt++
  ) {
    try {
      const response =
        await fetch(url, options);

      if (response.ok) {
        return response;
      }

      const errText =
        await response.text();

      const retryable =
        response.status === 429 ||
        response.status === 502 ||
        response.status === 503 ||
        response.status === 504;

      if (
        !retryable ||
        attempt === maxAttempts
      ) {
        throw new Error(
          `${label} API error ${response.status}: ${errText}`
        );
      }

      const retryAfterHeader =
        response.headers.get(
          'retry-after'
        );

      const retryAfterSeconds =
        Number(retryAfterHeader);

      const delay =
        Number.isFinite(
          retryAfterSeconds
        ) &&
        retryAfterSeconds > 0
          ? Math.min(
              retryAfterSeconds * 1000,
              30000
            )
          : retryDelays[
              attempt - 1
            ];

      console.warn(
        `${label} returned ${response.status}. ` +
        `Retrying in ${Math.round(
          delay / 1000
        )}s...`
      );

      await sleep(delay);

    } catch (err) {

      if (
        attempt === maxAttempts
      ) {
        throw err;
      }

      await sleep(
        retryDelays[
          attempt - 1
        ]
      );
    }
  }

  throw new Error(
    `${label} request failed after retries`
  );
}


// ============================================================
// GEMINI
// ============================================================

async function callGemini(
  systemPrompt,
  userMessage,
  maxTokens = 1500,
  jsonResponse = false
) {
  const apiKey =
    process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY not configured'
    );
  }

  const model =
    process.env.GEMINI_MODEL ||
    'gemini-3.8-flash';

  const generationConfig = {
    maxOutputTokens: maxTokens
  };

  if (jsonResponse) {
    generationConfig.responseMimeType =
      'application/json';
  }

  const response =
    await fetchGeminiWithRetry(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },

        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text: systemPrompt
              }
            ]
          },

          contents: [
            {
              role: 'user',

              parts: [
                {
                  text: userMessage
                }
              ]
            }
          ],

          generationConfig
        })
      },
      'Gemini API'
    );

  const data =
    await response.json();

  if (
    !data.candidates ||
    !data.candidates[0]
  ) {
    const reason =
      data.promptFeedback ||
      data.error ||
      'No candidate returned';

    throw new Error(
      `Gemini returned no candidates: ${JSON.stringify(reason)}`
    );
  }

  const candidate =
    data.candidates[0];

  if (
    !candidate.content ||
    !candidate.content.parts
  ) {
    throw new Error(
      `Gemini returned no content. Finish reason: ${
        candidate.finishReason ||
        'unknown'
      }`
    );
  }

  const message =
    candidate.content.parts
      .map(
        part => part.text || ''
      )
      .join('');

  if (!message.trim()) {
    throw new Error(
      'Gemini returned an empty response'
    );
  }

  return message;
}


// ============================================================
// OPENAI
// ============================================================

async function callOpenAI(
  systemPrompt,
  userMessage,
  maxTokens = 1500
) {
  const apiKey =
    process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      'OPENAI_API_KEY not configured'
    );
  }

  const model =
    process.env.OPENAI_MODEL ||
    'gpt-4o-mini';

  const response =
    await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',

          'Authorization':
            `Bearer ${apiKey}`
        },

        body: JSON.stringify({
          model,

          max_completion_tokens:
            maxTokens,

          messages: [
            {
              role: 'system',
              content: systemPrompt
            },

            {
              role: 'user',
              content: userMessage
            }
          ]
        })
      }
    );

  if (!response.ok) {
    const errText =
      await response.text();

    throw new Error(
      `OpenAI API error ${response.status}: ${errText}`
    );
  }

  const data =
    await response.json();

  if (
    !data.choices ||
    !data.choices[0] ||
    !data.choices[0].message
  ) {
    throw new Error(
      'OpenAI returned an empty response'
    );
  }

  return (
    data.choices[0].message.content
  );
}


// ============================================================
// GROQ
// ============================================================

async function callGroq(
  systemPrompt,
  userMessage,
  maxTokens = 1500,
  jsonResponse = false,
  conversationHistory = []
) {
  const apiKey =
    process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error(
      'GROQ_API_KEY not configured'
    );
  }

  const model =
    process.env.GROQ_MODEL ||
    'openai/gpt-oss-120b';

  const messages = [
    {
      role: 'system',
      content: systemPrompt
    },

    ...conversationHistory.map(
      message => ({
        role:
          message.role === 'assistant'
            ? 'assistant'
            : 'user',

        content:
          message.content
      })
    ),

    {
      role: 'user',
      content: userMessage
    }
  ];

  const requestBody = {
  model,

  messages,

  max_completion_tokens:
    maxTokens,

  temperature: 0.7,

  // Reduce hidden reasoning so more tokens
  // are available for the actual answer.
  reasoning_effort: 'low',

  // Do not return reasoning content to the user.
  include_reasoning: false
};

  if (jsonResponse) {
    requestBody.response_format = {
      type: 'json_object'
    };
  }

  const maxAttempts = 3;

  const retryDelays = [
    2000,
    5000,
    10000
  ];

  for (
    let attempt = 1;
    attempt <= maxAttempts;
    attempt++
  ) {
    try {

      const response =
        await fetch(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',

              'Authorization':
                `Bearer ${apiKey}`
            },

            body:
              JSON.stringify(
                requestBody
              )
          }
        );

      if (response.ok) {

        const data =
          await response.json();

        if (
          !data.choices ||
          !data.choices[0] ||
          !data.choices[0].message
        ) {
          throw new Error(
            'Groq returned an empty response'
          );
        }

        const message =
          data.choices[0].message.content;

        if (
          !message ||
          !message.trim()
        ) {
          throw new Error(
            'Groq returned an empty message'
          );
        }

        console.log(
          'GROQ MODEL:',
          model
        );

        console.log(
  'GROQ RESPONSE LENGTH:',
  message.length
);

console.log(
  'GROQ FINISH REASON:',
  data.choices[0].finish_reason
);

console.log(
  'GROQ USAGE:',
  JSON.stringify(data.usage)
);

return message;
      }

      const errText =
        await response.text();

      const retryable =
        response.status === 429 ||
        response.status === 500 ||
        response.status === 502 ||
        response.status === 503 ||
        response.status === 504;

      if (
        !retryable ||
        attempt === maxAttempts
      ) {
        throw new Error(
          `Groq API error ${response.status}: ${errText}`
        );
      }

      const retryAfterHeader =
        response.headers.get(
          'retry-after'
        );

      const retryAfterSeconds =
        Number(
          retryAfterHeader
        );

      const delay =
        Number.isFinite(
          retryAfterSeconds
        ) &&
        retryAfterSeconds > 0
          ? Math.min(
              retryAfterSeconds *
                1000,
              30000
            )
          : retryDelays[
              attempt - 1
            ];

      console.warn(
        `Groq returned ${response.status}. ` +
        `Retrying in ${Math.round(
          delay / 1000
        )}s ` +
        `(attempt ${
          attempt + 1
        }/${maxAttempts})...`
      );

      await sleep(delay);

    } catch (err) {

      if (
        attempt === maxAttempts
      ) {
        throw err;
      }

      console.warn(
        `Groq request failed: ${err.message}. ` +
        `Retrying...`
      );

      await sleep(
        retryDelays[
          attempt - 1
        ]
      );
    }
  }

  throw new Error(
    'Groq request failed after retries'
  );
}


// ============================================================
// PRIMARY AI DISPATCH
// ============================================================

async function callAI(
  systemPrompt,
  userMessage,
  maxTokens = 1500,
  jsonResponse = false
) {

  if (
    AI_PROVIDER === 'gemini'
  ) {
    return callGemini(
      systemPrompt,
      userMessage,
      maxTokens,
      jsonResponse
    );
  }

  if (
    AI_PROVIDER === 'openai'
  ) {
    return callOpenAI(
      systemPrompt,
      userMessage,
      maxTokens
    );
  }

  if (
    AI_PROVIDER === 'groq'
  ) {
    return callGroq(
      systemPrompt,
      userMessage,
      maxTokens,
      jsonResponse
    );
  }

  return callAnthropic(
    systemPrompt,
    userMessage,
    maxTokens
  );
}


// ============================================================
// ROADMAP GENERATION
// ============================================================

async function generateRoadmap(
  context
) {

  const {
    career,
    skillScores,
    skillGaps,
    userName
  } = context;

  const systemPrompt = `
You are an expert career coach and learning path designer.

Generate a structured, personalized learning roadmap in valid JSON format only.

Do not include any text outside the JSON object.

The JSON must be parseable by JSON.parse().
`;

  const gapSummary =
    skillGaps
      .filter(
        g => g.gap > 0
      )
      .sort(
        (a, b) =>
          b.gap - a.gap
      )
      .map(
        g =>
          `${g.skillName}: gap=${g.gap} (current=${g.currentLevel}, required=${g.requiredLevel})`
      )
      .join('\n');

  const scoreSummary =
    skillScores
      .map(
        s =>
          `${s.skillName}: ${s.score}% (${s.proficiency})`
      )
      .join('\n');

  const userMessage = `
Create a personalized learning roadmap for ${userName}.

Target Career:
${career}

Current Skill Levels:
${scoreSummary}

Skill Gaps:
${gapSummary}

Return ONLY a JSON object with this exact structure:

{
  "summary": "Brief 1-2 sentence personalized overview",
  "totalDuration": "X weeks",
  "phases": [
    {
      "phaseNumber": 1,
      "title": "Phase title",
      "duration": "X weeks",
      "skills": ["skill1", "skill2"],
      "topics": ["topic1", "topic2", "topic3"],
      "reason": "Why this phase comes first based on the user's gaps",
      "practicalExercises": ["exercise1", "exercise2"],
      "resources": ["resource1", "resource2"]
    }
  ]
}

Rules:

- Only include phases for skills with gaps > 0
- Order phases by gap severity
- Each phase should have 3-6 topics
- Include 2-3 practical exercises per phase
- Suggest free resources such as MDN, official documentation, freeCodeCamp, etc.
- Maximum 6 phases
`;

  try {

    const raw =
      await callAI(
        systemPrompt,
        userMessage,
        4000,
        true
      );

    let jsonStr =
      raw.trim();

    const fenceMatch =
      jsonStr.match(
        /```(?:json)?\s*([\s\S]*?)```/
      );

    if (fenceMatch) {
      jsonStr =
        fenceMatch[1].trim();
    }

    const parsed =
      JSON.parse(jsonStr);

    if (
      !parsed.phases ||
      !Array.isArray(
        parsed.phases
      )
    ) {
      throw new Error(
        'Invalid roadmap structure: missing phases array'
      );
    }

    return {
      success: true,
      data: parsed
    };

  } catch (err) {

    console.error(
      'AI roadmap generation failed:',
      err.message
    );

    return {
      success: false,
      error: err.message
    };
  }
}


// ============================================================
// MENTOR OUTPUT SANITIZER (server-side safety net)
// ============================================================
// The system prompt tells the model exactly how to format, but weaker/
// faster models (Groq's gpt-oss-120b especially) still drift: emoji
// headings instead of "##", "####" (unsupported — renderer only knows
// #/##/###), blank lines inserted between table rows, vertical "↓"
// flow diagrams instead of one-line "→" chains. Rather than chase every
// new drift pattern in the prompt, this runs on every response before
// it reaches the client, so formatting is guaranteed regardless of the
// model's compliance that turn.
function sanitizeMentorOutput(text) {
  if (!text) return text;

  let lines = text.replace(/\r\n/g, '\n').split('\n');

  // 1) Cap heading depth at "###" (renderer doesn't support "####"+).
  lines = lines.map(line =>
    line.replace(/^(\s*)#{4,}(\s+)/, '$1###$2')
  );

  // 2) Collapse blank lines sitting between markdown table rows.
  const collapsed = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '') {
      const prev = collapsed[collapsed.length - 1];
      const next = lines.slice(i + 1).find(l => l.trim() !== '');
      if (prev?.trim().startsWith('|') && next?.trim().startsWith('|')) {
        continue; // drop this blank line
      }
    }
    collapsed.push(line);
  }
  lines = collapsed;

  // 3) Promote pseudo-headings to real "## " headings:
  //    - emoji + short title line, e.g. "🎯 Quick Goal"
  //    - keycap-number + title, e.g. "1️⃣ Ingredients"
  const keycapHeading = /^[0-9]\uFE0F?\u20E3\s*(.+)$/u;
  const emojiHeading = /^[\p{Emoji_Presentation}\u2600-\u27BF\uFE0F]+\s*([A-Z0-9][^.!?]{2,60})$/u;
  lines = lines.map(line => {
    const t = line.trim();
    if (/^#{1,3}\s/.test(t)) return line; // already a real heading
    if (keycapHeading.test(t)) return `## ${t.replace(keycapHeading, '$1')}`;
    if (emojiHeading.test(t)) return `## ${t}`;
    return line;
  });

  // 4) Collapse a vertical "↓" flow diagram into a single "→" chain,
  //    e.g. "Client\n ↓ HTTPS\nServer\n ↓ ODM\nDatabase" becomes
  //    "Client → Server → Database" on one line.
  const flowed = [];
  for (let i = 0; i < lines.length; i++) {
    const isLabel = lines[i].trim() && !/↓/.test(lines[i]) && !lines[i].trim().startsWith('|');
    if (isLabel && i + 1 < lines.length && /↓/.test(lines[i + 1])) {
      const steps = [lines[i].trim()];
      let j = i + 1;
      while (j < lines.length) {
        if (/↓/.test(lines[j])) { j++; continue; }
        if (lines[j].trim() === '') break;
        steps.push(lines[j].trim());
        j++;
      }
      if (steps.length > 1) {
        flowed.push(steps.join(' → '));
        i = j - 1;
        continue;
      }
    }
    flowed.push(lines[i]);
  }
  lines = flowed;

  return lines.join('\n');
}


// ============================================================
// CAREER MENTOR CHAT
// ============================================================

async function chatWithMentor(
  context,
  userMessage,
  conversationHistory = []
) {

  const {
    career,
    skillScores,
    skillGaps,
    roadmapPhase,
    userName
  } = context;

  const topGaps =
    skillGaps
      .filter(
        g => g.gap > 0
      )
      .sort(
        (a, b) =>
          b.gap - a.gap
      )
      .slice(0, 3)
      .map(
        g =>
          `${g.skillName} (gap: ${g.gap})`
      )
      .join(', ');

  const skillSummary =
    skillScores
      .map(
        s =>
          `${s.skillName}: ${s.score}%`
      )
      .join(', ');

  // ------------------------------------------------------------------
  // STRICT, EXAMPLE-DRIVEN FORMAT CONTRACT
  //
  // Why so strict: the front-end (mentor.html) parses this text with a
  // hand-written markdown renderer (headings, tables, flow-diagram boxes,
  // tips, code blocks). That renderer only recognizes exact patterns.
  // Loose instructions like "use markdown" cause weaker/cheaper models
  // (esp. Groq's gpt-oss-120b) to drift — e.g. dropping "##" from
  // headings, or putting blank lines between table rows — which breaks
  // the renderer's parsing. Showing a literal example fixes this far
  // more reliably than describing the rule in prose.
  // ------------------------------------------------------------------
  const systemPrompt = `
You are an expert AI Career Mentor helping ${userName}
become a ${career}.

USER PROFILE

Target Career:
${career}

Current Skill Levels:
${skillSummary}

Top Skill Gaps:
${topGaps}

Current Roadmap Phase:
${roadmapPhase || 'Not started'}

YOUR ROLE

Give personalized and actionable career guidance.

Use the user's actual skill levels and skill gaps when relevant.

Be encouraging but realistic.

Suggest specific:

- Topics
- Resources
- Projects
- Practice tasks
- Next steps

Use the conversation history for context continuity.

STRICT OUTPUT FORMAT — follow this EXACTLY. Do not deviate, and do not
mention these rules in your answer.

1. HEADINGS
   - Every major section MUST start with "## " on its own line,
     e.g. "## Overview", "## What You Should Learn", "## Practice",
     "## Project", "## Resources", "## Next Steps".
   - Sub-sections (like a specific week or project name) MUST use "### ".
   - There are only two heading levels: "##" and "###". NEVER use "####"
     or deeper.
   - NEVER start a heading with an emoji or a number emoji (e.g. "🎯",
     "1️⃣"). Headings are plain text after the "##"/"###" marker only,
     e.g. "## Quick Goal", not "🎯 Quick Goal".
   - Never present a section title as plain text or bold text only —
     it must use "##" or "###".

2. TABLES
   - Use standard markdown pipe tables only.
   - The separator row ("|---|---|") MUST be the line immediately after
     the header row. NEVER put a blank line between them.
   - Every data row MUST immediately follow the previous row.
     NEVER put a blank line between table rows.
   - Correct example:
     | Week | Focus | Goal |
     |------|-------|------|
     | 1 | JavaScript fundamentals | Close the biggest gap first |
     | 2 | HTML & CSS layout | Build responsive UI skills |

3. FLOW / PROCESS DIAGRAMS
   - Write exactly one line per diagram.
   - Join each step with " → " (a single arrow, spaces on both sides).
   - Never use vertical arrows, box-drawing characters, or multiple lines.
   - Correct example:
     Client (React) → Express Route → Controller → MongoDB → JSON Response

4. LISTS
   - Bullet points use "- " (dash + space).
   - Numbered steps use "1. ", "2. ", etc.
   - One idea per line. Never merge several bullet points into one
     paragraph.

5. EMPHASIS & LINKS
   - Bold key terms with **term**.
   - Only include real, working links, formatted as [label](https://example.com).
     Never invent a URL.

6. STRUCTURE
   - Keep paragraphs short: 2–3 sentences maximum.
   - Any response describing a plan or roadmap MUST end with a
     "## Next Steps" section written as a numbered checklist.
   - Never output the whole answer as one long unbroken paragraph.
   - Never return raw JSON in this chat context.

FULL WORKED EXAMPLE OF EXPECTED FORMAT (structure only — replace content
with what's actually relevant to this user):

## Overview

A short 2-3 sentence summary personalized to ${userName}'s current
skills and gaps.

## What You Should Learn

| Week | Focus | Goal |
|------|-------|------|
| 1 | Topic A | Why it matters |
| 2 | Topic B | Why it matters |

## Practice

- Daily drill 1
- Daily drill 2

## Project

### Mini Project Name

Client (React) → API Route → Database → Response

## Resources

- [MDN Web Docs](https://developer.mozilla.org)
- [freeCodeCamp](https://www.freecodecamp.org)

## Next Steps

1. First concrete action
2. Second concrete action
3. Third concrete action
`;

  const recentHistory =
    conversationHistory.slice(-20);

  try {

    // ----------------------------------------------------------
    // GEMINI MENTOR
    // ----------------------------------------------------------

    if (
      AI_PROVIDER === 'gemini'
    ) {

      const apiKey =
        process.env.GEMINI_API_KEY;

      if (!apiKey) {
        throw new Error(
          'GEMINI_API_KEY not configured'
        );
      }

      const model =
        process.env.GEMINI_MODEL ||
        'gemini-3.8-flash';

      const geminiContents = [
        ...recentHistory.map(
          msg => ({
            role:
              msg.role === 'assistant'
                ? 'model'
                : 'user',

            parts: [
              {
                text:
                  msg.content
              }
            ]
          })
        ),

        {
          role: 'user',

          parts: [
            {
              text:
                userMessage
            }
          ]
        }
      ];

      const response =
        await fetchGeminiWithRetry(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,

          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',

              'x-goog-api-key':
                apiKey
            },

            body: JSON.stringify({
              systemInstruction: {
                parts: [
                  {
                    text:
                      systemPrompt
                  }
                ]
              },

              contents:
                geminiContents,

              generationConfig: {
                maxOutputTokens:
                  5000,

                temperature:
                  0.7
              }
            })
          },

          'Gemini mentor'
        );

      const data =
        await response.json();

      if (
        !data.candidates ||
        !data.candidates[0]
      ) {
        throw new Error(
          'Gemini mentor returned no candidate'
        );
      }

      const candidate =
        data.candidates[0];

      if (
        !candidate.content ||
        !candidate.content.parts
      ) {
        throw new Error(
          'Gemini mentor returned no content'
        );
      }

      const message =
        candidate.content.parts
          .map(
            part =>
              part.text || ''
          )
          .join('');

      if (!message.trim()) {
        throw new Error(
          'Gemini mentor returned an empty response'
        );
      }

      return {
        success: true,
        message: sanitizeMentorOutput(message)
      };
    }


    // ----------------------------------------------------------
    // GROQ MENTOR
    // ----------------------------------------------------------

    if (
      AI_PROVIDER === 'groq'
    ) {

      const message =
        await callGroq(
          systemPrompt,
          userMessage,
          10000,
          false,
          recentHistory
        );

      return {
        success: true,
        message: sanitizeMentorOutput(message)
      };
    }


    // ----------------------------------------------------------
    // OPENAI MENTOR
    // ----------------------------------------------------------

    if (
      AI_PROVIDER === 'openai'
    ) {

      const apiKey =
        process.env.OPENAI_API_KEY;

      if (!apiKey) {
        throw new Error(
          'OPENAI_API_KEY not configured'
        );
      }

      const model =
        process.env.OPENAI_MODEL ||
        'gpt-4o-mini';

      const messages = [
        {
          role: 'system',
          content:
            systemPrompt
        },

        ...recentHistory,

        {
          role: 'user',
          content:
            userMessage
        }
      ];

      const response =
        await fetch(
          'https://api.openai.com/v1/chat/completions',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',

              'Authorization':
                `Bearer ${apiKey}`
            },

            body: JSON.stringify({
              model,

              max_completion_tokens:
                5000,

              messages
            })
          }
        );

      if (!response.ok) {
        const errText =
          await response.text();

        throw new Error(
          `OpenAI error ${response.status}: ${errText}`
        );
      }

      const data =
        await response.json();

      if (
        !data.choices ||
        !data.choices[0] ||
        !data.choices[0].message
      ) {
        throw new Error(
          'OpenAI returned an empty response'
        );
      }

      return {
        success: true,

        message: sanitizeMentorOutput(
          data.choices[0]
            .message.content
        )
      };
    }


    // ----------------------------------------------------------
    // ANTHROPIC MENTOR
    // ----------------------------------------------------------

    const apiKey =
      process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      throw new Error(
        'ANTHROPIC_API_KEY not configured'
      );
    }

    const model =
      process.env.ANTHROPIC_MODEL ||
      'claude-haiku-4-5-20251001';

    const anthropicMessages = [
      ...recentHistory,

      {
        role: 'user',
        content: userMessage
      }
    ];

    const response =
      await fetch(
        'https://api.anthropic.com/v1/messages',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',

            'x-api-key':
              apiKey,

            'anthropic-version':
              '2023-06-01'
          },

          body: JSON.stringify({
            model,

            max_tokens:
              5000,

            system:
              systemPrompt,

            messages:
              anthropicMessages
          })
        }
      );

    if (!response.ok) {
      const errText =
        await response.text();

      throw new Error(
        `Anthropic error ${response.status}: ${errText}`
      );
    }

    const data =
      await response.json();

    if (
      !data.content ||
      !data.content[0] ||
      !data.content[0].text
    ) {
      throw new Error(
        'Anthropic returned an empty response'
      );
    }

    return {
      success: true,

      message: sanitizeMentorOutput(
        data.content[0].text
      )
    };

  } catch (err) {

    console.error(
      'AI mentor chat failed:',
      err.message
    );

    return {
      success: false,
      error: err.message
    };
  }
}


// ============================================================
// LEARNING ADVICE
// ============================================================

async function generateLearningAdvice(
  context
) {

  const {
    skillName,
    currentLevel,
    requiredLevel,
    career
  } = context;

  const systemPrompt = `
You are a concise technical learning advisor.

Give practical and specific advice.

Use clear headings ("## " for sections), bullet points ("- "),
numbered lists ("1. "), and spacing.

Keep the answer focused and actionable.
`;

  const userMessage = `
The user wants to become a ${career}.

Their current ${skillName} level is ${currentLevel}%,
but they need ${requiredLevel}%.

What specific topics, resources,
practice tasks, and projects should they focus on
to close this gap?

Be specific and actionable.
`;

  try {

    const advice =
      await callAI(
        systemPrompt,
        userMessage,
        1000,
        false
      );

    return {
      success: true,
      advice
    };

  } catch (err) {

    console.error(
      'AI learning advice failed:',
      err.message
    );

    return {
      success: false,
      error: err.message
    };
  }
}


// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  generateRoadmap,
  chatWithMentor,
  generateLearningAdvice
};