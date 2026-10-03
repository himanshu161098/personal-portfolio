/**
 * Cloudflare Worker: Serverless Proxy for Himanshu Kumar's AI Portfolio Chatbot
 * 
 * Powered by Google Gemini & Anthropic Claude Cloud AI
 * 
 * Features:
 * - Google Gemini AI streaming integration (gemini-1.5-flash / gemini-2.0)
 * - Anthropic Claude streaming integration (claude-3-7-sonnet / claude-3-5-sonnet)
 * - Automatic provider fallback: works with GEMINI_API_KEY, ANTHROPIC_API_KEY, or both!
 * - Comprehensive knowledge: Full world knowledge (AI/ML, Cloud, coding, global news) + faithful portfolio dossier
 * - Dynamic Knowledge Base & Social Feed ingestion from GitHub Pages (5-minute cache)
 * - Strict CORS whitelist (GitHub Pages + localhost)
 * - Per-IP Rate Limiting (20 requests per 10 minutes)
 * - Request validation & payload size limits
 */

// Cache duration for knowledge.md and social_feed.json
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
let cachedKnowledge = { text: '', fetchedAt: 0, lastUpdated: '2026-10-03' };
let cachedSocialFeed = { text: '', fetchedAt: 0 };

// Rate limiting store (In-memory per-worker instance)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX_REQUESTS = 20;

// Allowed CORS origins
const ALLOWED_ORIGIN_PATTERNS = [
  /^https:\/\/himanshu161098\.github\.io$/,
  /^http:\/\/localhost(:\d+)?$/,
  /^http:\/\/127\.0\.0\.1(:\d+)?$/
];

function isOriginAllowed(origin) {
  if (!origin) return false;
  return ALLOWED_ORIGIN_PATTERNS.some(pattern => pattern.test(origin));
}

function getCorsHeaders(origin) {
  const allowed = isOriginAllowed(origin) ? origin : 'https://himanshu161098.github.io';
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
}

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || [];
  const recentRequests = record.filter(time => now - time < RATE_LIMIT_WINDOW_MS);

  if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetInSeconds: Math.ceil((recentRequests[0] + RATE_LIMIT_WINDOW_MS - now) / 1000) };
  }

  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);

  // Periodic cleanup of stale IPs
  if (rateLimitMap.size > 5000) {
    for (const [key, times] of rateLimitMap.entries()) {
      if (times.length === 0 || now - times[times.length - 1] > RATE_LIMIT_WINDOW_MS) {
        rateLimitMap.delete(key);
      }
    }
  }

  return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - recentRequests.length };
}

async function fetchKnowledgeBase() {
  const now = Date.now();
  if (cachedKnowledge.text && (now - cachedKnowledge.fetchedAt < CACHE_TTL_MS)) {
    return cachedKnowledge;
  }

  const kbUrl = 'https://himanshu161098.github.io/personal-portfolio/data/knowledge.md';
  try {
    const res = await fetch(kbUrl, { headers: { 'User-Agent': 'Cloudflare-Worker-Portfolio-Proxy' } });
    if (res.ok) {
      const text = await res.text();
      let lastUpdated = '2026-10-03';
      const match = text.match(/Last updated:\s*(\d{4}-\d{2}-\d{2})/i);
      if (match) lastUpdated = match[1];

      cachedKnowledge = { text, fetchedAt: now, lastUpdated };
    }
  } catch (err) {
    console.error('Failed to fetch remote knowledge.md:', err);
  }
  return cachedKnowledge;
}

async function fetchLiveSocialFeed() {
  const now = Date.now();
  if (cachedSocialFeed.text && (now - cachedSocialFeed.fetchedAt < CACHE_TTL_MS)) {
    return cachedSocialFeed.text;
  }

  const feedUrl = 'https://himanshu161098.github.io/personal-portfolio/data/social_feed.json';
  try {
    const res = await fetch(feedUrl, { headers: { 'User-Agent': 'Cloudflare-Worker-Portfolio-Proxy' } });
    if (res.ok) {
      const json = await res.json();
      const summary = JSON.stringify({
        last_synced: json.last_synced,
        repos: json.github?.featured_repos || [],
        recent_events: json.github?.recent_events || [],
        recent_posts: json.linkedin?.posts || []
      }, null, 2);

      cachedSocialFeed = { text: summary, fetchedAt: now };
    }
  } catch (err) {
    console.error('Failed to fetch remote social_feed.json:', err);
  }
  return cachedSocialFeed.text;
}

// -----------------------------------------------------------------------------
// STREAM HANDLER: Google Gemini AI
// -----------------------------------------------------------------------------
async function streamGemini(geminiApiKey, modelName, systemPrompt, messages, ctx, corsHeaders) {
  const model = modelName || 'gemini-1.5-flash';
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${geminiApiKey}`;

  const geminiContents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  const payload = {
    system_instruction: {
      parts: [{ text: systemPrompt }]
    },
    contents: geminiContents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 900
    }
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('Gemini API Error:', response.status, errText);
    throw new Error(`Google Gemini Error (${response.status})`);
  }

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  ctx.waitUntil((async () => {
    const reader = response.body.getReader();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          await writer.write(encoder.encode('data: [DONE]\n\n'));
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data: ')) continue;
          const jsonStr = trimmed.slice(6);
          if (jsonStr === '[DONE]') {
            await writer.write(encoder.encode('data: [DONE]\n\n'));
            continue;
          }

          try {
            const data = JSON.parse(jsonStr);
            const candidate = data.candidates?.[0];
            const textPart = candidate?.content?.parts?.[0]?.text;
            if (textPart) {
              await writer.write(encoder.encode(`data: ${JSON.stringify({ text: textPart })}\n\n`));
            }
          } catch (e) {}
        }
      }
    } catch (err) {
      console.error('Gemini stream error:', err);
      await writer.write(encoder.encode(`data: ${JSON.stringify({ error: 'Stream interrupted' })}\n\n`));
    } finally {
      await writer.close();
    }
  })());

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      ...corsHeaders
    }
  });
}

// -----------------------------------------------------------------------------
// STREAM HANDLER: Anthropic Claude AI
// -----------------------------------------------------------------------------
async function streamClaude(anthropicApiKey, modelName, systemPrompt, messages, ctx, corsHeaders) {
  const model = modelName || 'claude-3-7-sonnet-20250219';

  const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': anthropicApiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model,
      max_tokens: 800,
      system: systemPrompt,
      messages,
      stream: true
    })
  });

  if (!anthropicRes.ok) {
    const errorText = await anthropicRes.text();
    console.error('Anthropic API Error:', anthropicRes.status, errorText);
    throw new Error(`Claude Error (${anthropicRes.status})`);
  }

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  ctx.waitUntil((async () => {
    const reader = anthropicRes.body.getReader();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          await writer.write(encoder.encode('data: [DONE]\n\n'));
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data: ')) continue;
          const jsonStr = trimmed.slice(6);
          if (jsonStr === '[DONE]') {
            await writer.write(encoder.encode('data: [DONE]\n\n'));
            continue;
          }

          try {
            const event = JSON.parse(jsonStr);
            if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
              const deltaText = event.delta.text || '';
              await writer.write(encoder.encode(`data: ${JSON.stringify({ text: deltaText })}\n\n`));
            } else if (event.type === 'error') {
              await writer.write(encoder.encode(`data: ${JSON.stringify({ error: event.error?.message || 'Stream error' })}\n\n`));
            }
          } catch (e) {}
        }
      }
    } catch (err) {
      console.error('Claude streaming error:', err);
      await writer.write(encoder.encode(`data: ${JSON.stringify({ error: 'Stream interrupted' })}\n\n`));
    } finally {
      await writer.close();
    }
  })());

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      ...corsHeaders
    }
  });
}

// -----------------------------------------------------------------------------
// WORKER ENTRYPOINT
// -----------------------------------------------------------------------------
export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '';
    const corsHeaders = getCorsHeaders(origin);

    // Handle Preflight OPTIONS
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const url = new URL(request.url);

    // Health / Status Check endpoint
    if (url.pathname === '/' || url.pathname === '/health') {
      const activeProviders = [];
      if (env.GEMINI_API_KEY) activeProviders.push('Google Gemini');
      if (env.ANTHROPIC_API_KEY) activeProviders.push('Anthropic Claude');

      return new Response(JSON.stringify({
        status: 'online',
        service: 'Himanshu Kumar AI Portfolio Assistant Proxy',
        providers: activeProviders.length > 0 ? activeProviders : ['Not configured (Mock Fallback active)'],
        timestamp: new Date().toISOString()
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    if (url.pathname !== '/api/chat') {
      return new Response(JSON.stringify({ error: 'Not Found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // IP Rate Limiting
    const clientIp = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'unknown-client';
    const rateCheck = checkRateLimit(clientIp);
    if (!rateCheck.allowed) {
      return new Response(JSON.stringify({
        error: `Rate limit exceeded. Please wait ${rateCheck.resetInSeconds} seconds before sending another message.`,
        code: 'RATE_LIMIT_EXCEEDED'
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(rateCheck.resetInSeconds),
          ...corsHeaders
        }
      });
    }

    // Request size check (max 16KB)
    const contentLength = parseInt(request.headers.get('content-length') || '0', 10);
    if (contentLength > 16384) {
      return new Response(JSON.stringify({ error: 'Payload too large (max 16KB)' }), {
        status: 413,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Invalid JSON request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    const { messages, message, history, assistant } = body;
    let inputMessages = Array.isArray(messages) ? messages : [];
    if (inputMessages.length === 0 && message) {
      if (Array.isArray(history)) {
        inputMessages = [...history];
      }
      inputMessages.push({ role: 'user', content: String(message) });
    }

    if (inputMessages.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid messages or message payload' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Context limit (last 10 messages) & sanitization
    const sanitizedMessages = inputMessages.slice(-10).map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: String(msg.content || '').slice(0, 1000)
    }));

    // Check available AI credentials
    const hasGeminiKey = Boolean(env.GEMINI_API_KEY);
    const hasClaudeKey = Boolean(env.ANTHROPIC_API_KEY);

    if (!hasGeminiKey && !hasClaudeKey) {
      return new Response(JSON.stringify({
        error: 'Neither GEMINI_API_KEY nor ANTHROPIC_API_KEY secret is configured in the Cloudflare Worker.'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Fetch dynamic Knowledge Base & Social Feed
    const [kb, liveActivity] = await Promise.all([
      fetchKnowledgeBase(),
      fetchLiveSocialFeed()
    ]);

    const todayDate = new Date().toISOString().split('T')[0];
    const kbLastUpdated = kb.lastUpdated || todayDate;
    const kbContent = kb.text || 'Knowledge base is currently unavailable.';

    // Adapt Persona: Prachi AI (Human Companion & STEM Tutor) vs Quantix AI (Portfolio Intelligence)
    const isPrachi = assistant === 'prachi' || (body.model && body.model.includes('prachi')) || (body.model && body.model.includes('stem'));

    const systemPrompt = isPrachi
      ? `You are "Prachi", Himanshu Kumar's Human-like AI Companion & Universal Problem Solver tutor, powered by Google Gemini and Cloud AI.
You have a warm, empathetic, sweet, and caring female personality who chats like a true human friend, understands emotions, provides thoughtful life advice, and explains concepts like a world-class teacher and mentor in English, Hindi, or Hinglish.

Your core capabilities:

1. HUMAN-LIKE EMPATHETIC COMPANION:
- Listen deeply, understand feelings, comfort, encourage, tell inspiring stories, share humor, and chat like a genuine best friend.
- Voice tone: sweet, pleasant feminine tone, encouraging, and emotionally intelligent.

2. UNIVERSAL ACADEMIC & STEM PROBLEM SOLVER:
- Provide the clearest step-by-step solutions for Mathematics, Physics, Chemistry, Biology, GK, Indian Constitution, Current Affairs, and Coding.
- Follow the 5-point pedagogical standard: 📌 Given Information & Goal -> 📐 Formulas / Laws -> 🔢 Step-by-Step Calculation -> ✅ Final Boxed Answer -> 💡 Pro-Tip or Intuitive Shortcut.

3. HIMANSHU'S OFFICIAL PORTFOLIO DOSSIER:
- When visitors ask about Himanshu Kumar, his background, education, skills, projects, certifications, or career fit: use ONLY the verified knowledge base below as the factual source. Describe his experience honestly as a final-year B.Tech CSE-IT student with projects and an internship project.

Today is ${todayDate}. Knowledge base last updated: ${kbLastUpdated}.
KNOWLEDGE BASE:
${kbContent}

RECENT GITHUB ACTIVITY:
${liveActivity}`
      : `You are "Quantix AI", Himanshu Kumar's AI Portfolio Intelligence & Data Assistant. Meet the Mind Behind the Code.
Powered by Google Gemini and Cloud AI.

Your core capabilities:

1. HIMANSHU'S OFFICIAL PORTFOLIO DOSSIER:
- Dedicated interactive guide to Himanshu Kumar's professional profile, technical capabilities, and engineering projects:
  * 8,787 Netflix content analysis (Python, Pandas, Seaborn, Matplotlib, international expansion & catalog trends).
  * Technical Stack: Python, SQL (Aggregations, Subqueries, JOINs), Power BI, Three.js, Tableau, Excel.
  * Education: Final-year B.Tech in CSE-IT at IIMT College of Engineering (AKTU), Greater Noida.
  * 5+ Certifications: Cybersecurity, Python Data Analysis, ML & AI foundations.
  * Honest recruiter fit analysis for Data Analyst / BI internships without exaggeration.

2. TECHNICAL REASONING & STEM EXPERTISE:
- Answer questions on Data Science, ML algorithms, SQL queries, Python coding, and quantitative logic with high precision.
- If a user seeks personal empathetic chat or universal STEM tutoring, warmly mention [Prachi AI](prachi.html).

Today is ${todayDate}. Knowledge base last updated: ${kbLastUpdated}.
KNOWLEDGE BASE:
${kbContent}

RECENT GITHUB ACTIVITY:
${liveActivity}`;

    // Routing preference: use GEMINI_API_KEY by default if available, fallback to Claude
    const preferGemini = hasGeminiKey && (env.AI_PROVIDER !== 'anthropic');

    if (preferGemini) {
      try {
        const geminiModel = env.GEMINI_MODEL || 'gemini-1.5-flash';
        return await streamGemini(env.GEMINI_API_KEY, geminiModel, systemPrompt, sanitizedMessages, ctx, corsHeaders);
      } catch (geminiErr) {
        console.warn('Gemini stream failed, checking Claude fallback:', geminiErr.message);
        if (hasClaudeKey) {
          const claudeModel = env.CLAUDE_MODEL || 'claude-3-7-sonnet-20250219';
          return await streamClaude(env.ANTHROPIC_API_KEY, claudeModel, systemPrompt, sanitizedMessages, ctx, corsHeaders);
        }
        return new Response(JSON.stringify({ error: `Google Gemini error: ${geminiErr.message}` }), {
          status: 502,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }
    } else {
      try {
        const claudeModel = env.CLAUDE_MODEL || 'claude-3-7-sonnet-20250219';
        return await streamClaude(env.ANTHROPIC_API_KEY, claudeModel, systemPrompt, sanitizedMessages, ctx, corsHeaders);
      } catch (claudeErr) {
        console.warn('Claude stream failed, checking Gemini fallback:', claudeErr.message);
        if (hasGeminiKey) {
          const geminiModel = env.GEMINI_MODEL || 'gemini-1.5-flash';
          return await streamGemini(env.GEMINI_API_KEY, geminiModel, systemPrompt, sanitizedMessages, ctx, corsHeaders);
        }
        return new Response(JSON.stringify({ error: `Claude AI error: ${claudeErr.message}` }), {
          status: 502,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }
    }
  }
};
