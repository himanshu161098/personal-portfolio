# ⚡ Cloudflare Worker Proxy for Himanshu's AI Chatbot

This Cloudflare Worker serves as the secure, serverless bridge between Himanshu's static GitHub Pages portfolio and the Anthropic Claude API.

---

## 🛠️ Features
- **Zero API Key Leakage**: Holds `ANTHROPIC_API_KEY` securely in Cloudflare Secrets.
- **Dynamic Context**: Automatically fetches and caches (for 5 minutes) `data/knowledge.md` and `data/social_feed.json` from the live portfolio.
- **Real-Time Streaming**: Delivers fast, low-latency Server-Sent Events (SSE) token-by-token.
- **Built-in Security**:
  - Restricts CORS strictly to `https://himanshu161098.github.io` and `localhost`.
  - Enforces per-IP rate limiting (20 requests per 10-minute window).
  - Maximum 16KB payload cap and 10-turn conversation truncation.

---

## 🚀 Step-by-Step Deployment Instructions

### Prerequisites
1. A free [Cloudflare Account](https://dash.cloudflare.com/sign-up).
2. Node.js installed on your machine (`node -v`).
3. An [Anthropic API Key](https://console.anthropic.com/).

### Step 1: Open Terminal in the Worker Folder
```bash
cd "worker"
```

### Step 2: Log in to Cloudflare Wrangler
```bash
npx wrangler login
```
*(A browser window will open asking you to authorize Wrangler. Click **Allow**.)*

### Step 3: Add your Secret Anthropic API Key
Run this command and paste your secret Anthropic API key when prompted:
```bash
npx wrangler secret put ANTHROPIC_API_KEY
```

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
Open `chatbot.js` in the root repository folder, find line 14:
```javascript
const WORKER_URL = "https://portfolio-chatbot-proxy.<your-subdomain>.workers.dev/api/chat";
```
Replace the placeholder with your actual live Worker endpoint URL and commit!

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
