# ⚡ Cloudflare Worker Proxy for Himanshu's AI Chatbot

This Cloudflare Worker serves as the secure, serverless bridge between Himanshu's static GitHub Pages portfolio and **Google Gemini AI & Anthropic Claude Cloud AI**.

---

## 🛠️ Features
- **Google Gemini & Cloud AI Integration**: Native Server-Sent Events (SSE) streaming with `gemini-1.5-flash` or `gemini-2.0`.
- **Anthropic Claude Cloud AI**: Streaming with `claude-3-7-sonnet` or `claude-3-5-sonnet`.
- **Automatic Fallback**: Works with `GEMINI_API_KEY`, `ANTHROPIC_API_KEY`, or both!
- **Zero API Key Leakage**: Holds API keys securely in encrypted Cloudflare Secrets.
- **Dynamic Context**: Automatically fetches and caches (for 5 minutes) `data/knowledge.md` and `data/social_feed.json` from the live portfolio.
- **Built-in Security**:
  - Restricts CORS strictly to `https://himanshu161098.github.io` and `localhost`.
  - Enforces per-IP rate limiting (20 requests per 10-minute window).
  - Maximum 16KB payload cap and 10-turn conversation truncation.

---

## 🚀 Step-by-Step Deployment Instructions

### Prerequisites
1. A free [Cloudflare Account](https://dash.cloudflare.com/sign-up).
2. Node.js installed on your machine (`node -v`).
3. A **Google Gemini API Key** (Free from [Google AI Studio](https://aistudio.google.com/)) OR an [Anthropic API Key](https://console.anthropic.com/).

### Step 1: Open Terminal in the Worker Folder
```bash
cd "worker"
```

### Step 2: Log in to Cloudflare Wrangler
```bash
npx wrangler login
```
*(A browser window will open asking you to authorize Wrangler. Click **Allow**.)*

### Step 3: Add your Secret API Key(s)

**Option A (Recommended - Google Gemini AI)**:
```bash
npx wrangler secret put GEMINI_API_KEY
```
*(Paste your Google Gemini API Key from Google AI Studio)*

**Option B (Anthropic Claude AI)**:
```bash
npx wrangler secret put ANTHROPIC_API_KEY
```

*(You can configure both keys for automatic failover protection!)*

### Step 4: Deploy the Worker
Deploy directly to Cloudflare's global edge network:
```bash
npx wrangler deploy
```

Upon successful deployment, Wrangler will print your live worker URL, for example:
```
https://portfolio-chatbot-proxy.<your-subdomain>.workers.dev
```

### Step 5: Update the Portfolio Chatbot Config
Open `chatbot.js` in the root repository folder, find line 16:
```javascript
const WORKER_URL = "https://portfolio-chatbot-proxy.<your-subdomain>.workers.dev/api/chat";
```
Replace the placeholder with your actual live Worker endpoint URL and push to GitHub!

---

## 🧪 Testing the Worker Locally
You can run the worker locally before deploying:
```bash
npx wrangler dev
```
Test the health check in your browser or curl:
```bash
curl http://localhost:8787/health
```
