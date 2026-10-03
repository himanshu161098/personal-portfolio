/**
 * ==============================================================================
 * Himanshu Kumar - AI Portfolio & Virtual Intelligence Assistant
 * Features:
 * - Dual Intelligence: Himanshu's Portfolio Dossier + AI/ML Expert & Global Knowledge
 * - Bidirectional Voice Assistant: Speech-to-Text (STT) + Human Text-to-Speech (TTS)
 * - Serverless Claude Sonnet Streaming via Cloudflare Worker
 * - Session Persistence, Safe Markdown, Copy & Thumbs Feedback
 * - Multi-language: English, Hindi, and Hinglish
 * ==============================================================================
 */

// -----------------------------------------------------------------------------
// 1. CONFIGURATION
// -----------------------------------------------------------------------------
const WORKER_URL = "https://portfolio-chatbot-proxy.your-subdomain.workers.dev/api/chat";

const SESSION_STORAGE_KEY = 'hk_portfolio_chat_session_v2';
const VOICE_MODE_STORAGE_KEY = 'hk_portfolio_voice_mode_v2';
const MAX_INPUT_LENGTH = 500;
const MAX_HISTORY_MESSAGES = 10;

// Suggested initial chips for exploration
const SUGGESTED_QUESTIONS = [
  { icon: 'fa-solid fa-bolt', text: 'Give me a 30-second pitch about Himanshu' },
  { icon: 'fa-solid fa-wand-magic-sparkles', text: 'What is Google Gemini & Cloud AI?' },
  { icon: 'fa-solid fa-brain', text: 'Explain Machine Learning workflow in Python' },
  { icon: 'fa-solid fa-chart-line', text: 'Tell me about the Netflix analysis project' },
  { icon: 'fa-solid fa-cloud', text: 'What are Cloud AI & BigQuery advantages?' },
  { icon: 'fa-solid fa-envelope', text: 'How can I contact Himanshu?' }
];

// Initial welcome greeting
const WELCOME_GREETING = `Hello! 👋 I'm **Himanshu's AI Assistant**, powered by **Google Gemini & Cloud AI**.

I operate with **dual capabilities**:
1. 📂 **Himanshu's Portfolio Dossier**: Ask about his **skills, Netflix analysis project, certifications, education**, or paste a **job description** for an honest fit analysis.
2. 🌐 **Gemini & Cloud AI World Intelligence**: Ask me anything! **Machine Learning, Cloud AI (GCP/BigQuery), Python/SQL coding, science, math, or national & international news**.
3. 🎙️ **Voice Assistant**: Click the **Microphone** to speak in **English, Hindi, or Hinglish**, or toggle **Voice Mode** in the header to hear me speak!`;

// -----------------------------------------------------------------------------
// 2. STATE MANAGEMENT
// -----------------------------------------------------------------------------
let chatHistory = [];
let isStreaming = false;
let abortController = null;
let localKnowledgeCache = null;

// -----------------------------------------------------------------------------
// 3. SAFE MARKDOWN & HTML SANITIZER
// -----------------------------------------------------------------------------
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderSafeMarkdown(markdown) {
  if (!markdown) return '';

  let html = escapeHtml(markdown);

  // Fenced Code Blocks ```lang ... ```
  html = html.replace(/```(?:[a-zA-Z0-9_-]+)?\n([\s\S]*?)```/g, (match, code) => {
    return `<pre><code>${code.trim()}</code></pre>`;
  });

  // Inline Code `code`
  html = html.replace(/`([^`\n]+)`/g, '<code>$1</code>');

  // Bold **text** or __text__
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');

  // Italic *text*
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // Markdown links [text](url) - Safe schemes only
  html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)/g, (match, text, url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`;
  });

  // Unordered list items: lines starting with "- " or "* "
  const lines = html.split('\n');
  let inList = false;
  let processedLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList) {
        processedLines.push('<ul>');
        inList = true;
      }
      processedLines.push(`<li>${line.substring(2)}</li>`);
    } else {
      if (inList) {
        processedLines.push('</ul>');
        inList = false;
      }
      if (line.length > 0) {
        processedLines.push(`<p>${line}</p>`);
      }
    }
  }
  if (inList) {
    processedLines.push('</ul>');
  }

  return processedLines.join('');
}

// -----------------------------------------------------------------------------
// 4. LOCAL INTELLIGENT MOCK & VIRTUAL AI FALLBACK ENGINE
// -----------------------------------------------------------------------------
async function getLocalKnowledge() {
  if (localKnowledgeCache) return localKnowledgeCache;
  try {
    const res = await fetch('data/knowledge.md');
    if (res.ok) {
      localKnowledgeCache = await res.text();
    }
  } catch (e) {
    console.warn('[Chatbot] Local knowledge fetch fallback:', e);
  }
  return localKnowledgeCache || '';
}

function generateLocalMockResponse(userQuery, kb) {
  const q = userQuery.toLowerCase();

  // 0. Google Gemini & Cloud AI
  if (q.includes('gemini') || q.includes('cloud ai') || q.includes('bigquery') || q.includes('gcp') || q.includes('vertex')) {
    return `**Google Gemini & Cloud AI Collaboration**:

- **Google Gemini**: Google's most capable multimodal AI model architecture (Gemini 1.5 Flash & Pro, Gemini 2.0). It features a native 1M+ token context window, state-of-the-art multimodal reasoning across text, code, audio, and video, and low-latency response generation.
- **Google Cloud AI Ecosystem**:
  - **BigQuery & BigQuery ML**: Serverless, highly scalable enterprise data warehouse allowing direct SQL queries over terabytes of data and in-database ML modeling.
  - **Vertex AI**: Unified platform for training, tuning, and deploying generative AI and custom machine learning models at enterprise scale.
  - **Cloud AI Integration**: Powers this portfolio's real-time knowledge ingestion, voice processing, and natural conversational reasoning.

Himanshu leverages these data analytics and cloud principles in his projects! Would you like to see how he uses SQL and Python for data analysis?`;
  }

  // 1. AI & Machine Learning Questions
  if (q.includes('machine learning') || q.includes('ml ') || q.includes('ai ') || q.includes('pipeline') || q.includes('algorithm')) {
    if (q.includes('hindi') || q.includes('kya hai') || q.includes('batao') || q.includes('kaise')) {
      return `**Machine Learning (ML)** Artificial Intelligence ka wo field hai jisme computer bina explicit programming ke data se patterns seekhta hai.

**Main Workflow**:
1. **Data Collection & Cleaning**: Handling missing values, removing duplicates, and outlier treatment with Pandas.
2. **Exploratory Data Analysis (EDA)**: Understanding distributions and correlations with Matplotlib / Seaborn.
3. **Feature Engineering**: Encoding categorical values (One-Hot) aur scaling (StandardScaler).
4. **Model Training & Evaluation**: Training algorithms (e.g. Linear Regression, Random Forest) aur accuracy, F1-score evaluate karna.

Himanshu ne apne **Netflix project** aur certifications me yahi EDA & ML fundamentals apply kiye hain! Kya aap koi specific algorithm samajhna chahenge?`;
    }

    return `Here is the standard **Machine Learning & Data Science Pipeline**:

1. **Problem Definition**: Framing the business question (classification, regression, or clustering).
2. **Data Wrangling & Cleaning**: Handling nulls, imputation, and data type alignment via Pandas & NumPy.
3. **Exploratory Data Analysis (EDA)**: Visualizing distributions, detecting outliers (IQR), and correlation matrices.
4. **Feature Engineering**: Encoding categoricals (One-Hot / Label Encoding) and feature scaling.
5. **Model Building & Validation**: Fitting algorithms (Scikit-Learn) and evaluating metrics (RMSE, Precision, Recall, F1-Score, Confusion Matrix).

Himanshu specializes in the foundational stages of this pipeline—specifically **Data Cleaning, EDA, and Statistical Analysis**. Would you like a Python code example for any step?`;
  }

  // 2. National & International Trends / General Knowledge
  if (q.includes('national') || q.includes('international') || q.includes('trend') || q.includes('news') || q.includes('global') || q.includes('world')) {
    return `Here are key **National & Global AI Developments**:

- **National (IndiaAI Mission)**: The Indian government approved the ₹10,372 crore IndiaAI Mission to democratize compute access (10,000+ GPUs), foster indigenous AI foundation models, and empower student researchers.
- **Global AI Trends**:
  - **Agentic Workflows**: Shifting from simple prompts to autonomous agent swarms capable of reasoning and planning.
  - **Multimodal AI**: Seamless blending of text, code, audio, and computer vision.
  - **Small Language Models (SLMs)**: High-efficiency edge models designed for localized, low-latency computing.

Himanshu tracks these advancements to apply modern AI/ML tooling to practical real-world data problems!`;
  }

  // 3. 30-Second Pitch
  if (q.includes('pitch') || q.includes('30-second') || q.includes('intro') || q.includes('who is')) {
    return `Himanshu Kumar is a final-year **B.Tech (CSE-IT)** student at IIMT College of Engineering (AKTU) targeting **Data Analyst internships** and entry-level roles.

He has proven hands-on experience in **Python, SQL, Exploratory Data Analysis (EDA), and Data Cleaning**, having analyzed **8,787 Netflix catalog titles**. Additionally, he has built interactive software with Three.js and holds 5 industry certifications in Data Analytics, Python, and AI/ML.

Would you like to know more about his **Netflix analysis project** or his **technical skills**?`;
  }

  // 4. Skills
  if (q.includes('skill') || q.includes('technolog') || q.includes('stack') || q.includes('tools')) {
    return `Here is a summary of Himanshu's verified technical skills:

- **Data Analytics & BI**: Python, Pandas, NumPy, Data Cleaning, EDA, Matplotlib, Power BI, Microsoft Excel.
- **Databases & Querying**: SQL (Aggregations, JOINs, Group By, Filtering), MySQL, MongoDB.
- **Programming**: Python, SQL, C++, Java, JavaScript (ES6+).
- **Web & Tools**: HTML5, CSS3, Tailwind CSS, Bootstrap, Three.js, Git, GitHub Actions, Jupyter Notebook.

Would you like to see how he applies these tools in his **Netflix project**?`;
  }

  // 5. Netflix Analysis Project
  if (q.includes('netflix') || q.includes('sales') || q.includes('content analysis')) {
    return `Himanshu executed the **Netflix Content Analysis Project** during his internship at **Auspify Technologies**:

- **Catalog Scale**: Thorough exploratory analysis on **8,787 clean movie and TV show titles**.
- **Important Note**: This project analyzes **content catalog distribution and trends**, *not* revenue or sales data (despite the repository naming).
- **Core Insights**: Quantified the international content expansion across North America, Europe, and Asia, release volume spikes over the past decade, and audience rating distributions (TV-MA, TV-14).
- **Stack**: Python, Pandas, NumPy, Matplotlib, Jupyter Notebook, ReportLab.
- **Repository**: [github.com/himanshu161098/Netfix-Sales](https://github.com/himanshu161098/Netfix-Sales).

Shall I share his **GitHub profile** or evaluate his fit for an opening you have?`;
  }

  // 6. Internship / Job Fit
  if (q.includes('fit') || q.includes('internship') || q.includes('hire') || q.includes('role') || q.includes('job') || q.includes('jd')) {
    return `Himanshu is a strong match for **Data Analyst Internships** and **Junior BI / Data Analytics** roles:

- **Key Strengths**:
  - Hands-on data cleaning and EDA on real-world datasets (8,780+ titles).
  - Proficient in SQL querying (joins, aggregations, window functions) and relational databases.
  - Clear visual storytelling with Matplotlib, Excel, and Power BI dashboards.
  - Proactive learner with 5 verified certifications in Data Analytics and Machine Learning.
- **Honest Gaps / In Progress**:
  - Final-year student seeking an internship or entry-level opportunity (not a senior role).
  - Currently developing deeper enterprise distributed computing (Spark) experience.

Feel free to paste your specific **Job Description** here for a point-by-point comparison!`;
  }

  // 7. Contact
  if (q.includes('contact') || q.includes('email') || q.includes('reach') || q.includes('linkedin')) {
    return `You can connect with Himanshu directly through:

- **LinkedIn**: [linkedin.com/in/himanshu-kumar-1618hks/](https://www.linkedin.com/in/himanshu-kumar-1618hks/)
- **GitHub**: [github.com/himanshu161098](https://github.com/himanshu161098)
- **Portfolio**: [himanshu161098.github.io/personal-portfolio/](https://himanshu161098.github.io/personal-portfolio/)
- **Email**: \`himanshukumarsingh161098@gmail.com\`

*(Note: Phone numbers are not shared publicly for privacy).* Would you like to review his resume or project portfolio?`;
  }

  // 8. Education
  if (q.includes('education') || q.includes('college') || q.includes('degree') || q.includes('aktu')) {
    return `Himanshu's academic background:

- **B.Tech in Computer Science & Engineering (Information Technology)** at **IIMT College of Engineering, Greater Noida (AKTU)**, ongoing (Final Year, 2026).
- **Senior Secondary (Class XII)**: Bihar School Examination Board (BSEB), 2023 (67.8%).
- **Secondary (Class X)**: Bihar School Examination Board (BSEB), 2021 (68.2%).

Would you like to explore his technical certifications?`;
  }

  // 9. Python / Coding assistance
  if (q.includes('python') || q.includes('pandas') || q.includes('sql') || q.includes('code') || q.includes('query')) {
    return `Here is a quick Python EDA snippet using **Pandas** for analyzing datasets:

\`\`\`python
import pandas as pd
import numpy as np

# Load dataset and inspect health
df = pd.read_csv('dataset.csv')
print("Shape:", df.shape)
print("Missing values:\n", df.isnull().sum())

# Clean missing values & outliers
df['clean_duration'] = df['duration'].fillna(df['duration'].median())
print("Summary Statistics:\n", df.describe())
\`\`\`

Would you like help with SQL queries, data cleaning techniques, or Machine Learning evaluation?`;
  }

  // General response
  return `I am Himanshu's **AI + Virtual Assistant**. 

You can ask me about:
- **Himanshu's Projects & Skills** (Netflix Analysis, Portfolio, UNO game, Python, SQL)
- **Job Description Evaluation** (Paste any JD for an honest match breakdown)
- **AI & Machine Learning Tasks** (Algorithms, pipelines, EDA, Python/SQL coding)
- **National & Global Tech News** (IndiaAI Mission, LLMs, AI developments)

What would you like to explore or talk about?`;
}

// -----------------------------------------------------------------------------
// 5. CHATBOT WIDGET DOM & VOICE ASSISTANT ENGINE
// -----------------------------------------------------------------------------
class AIChatbotWidget {
  constructor() {
    this.isOpen = false;
    this.isListening = false;
    this.isVoiceModeEnabled = false;
    this.speechRecognitionAvailable = false;
    this.recognition = null;
    this.currentSpeakingBtn = null;
    this.dom = {};
    this.init();
  }

  init() {
    this.createWidgetDOM();
    this.initVoiceAssistant();
    this.loadSessionHistory();
    this.bindEvents();
    this.setupTeaserTimer();
  }

  createWidgetDOM() {
    // 1. Floating trigger button + teaser
    const triggerWrap = document.createElement('div');
    triggerWrap.className = 'cb-trigger-wrap';
    triggerWrap.id = 'cbTriggerWrap';
    triggerWrap.innerHTML = `
      <div class="cb-teaser-tooltip" id="cbTeaserTooltip" role="tooltip" aria-hidden="true">
        <i class="fa-solid fa-sparkles cb-teaser-spark" aria-hidden="true"></i>
        <span>Ask Himanshu's AI or speak via Voice! 🎙️</span>
        <button class="cb-teaser-close" id="cbTeaserClose" aria-label="Dismiss notification">&times;</button>
      </div>
      <button class="cb-floating-btn" id="cbFloatingBtn" aria-label="Open AI Portfolio Assistant" aria-haspopup="dialog" aria-expanded="false">
        <i class="fa-solid fa-robot" id="cbBtnIcon" aria-hidden="true"></i>
        <span class="cb-online-badge" aria-hidden="true"></span>
      </button>
    `;

    // 2. Chat Window Panel
    const windowOverlay = document.createElement('section');
    windowOverlay.className = 'cb-window-overlay';
    windowOverlay.id = 'cbWindowOverlay';
    windowOverlay.setAttribute('role', 'dialog');
    windowOverlay.setAttribute('aria-label', 'Himanshu Kumar AI + Virtual Assistant');
    windowOverlay.setAttribute('aria-hidden', 'true');
    windowOverlay.innerHTML = `
      <!-- Header -->
      <header class="cb-header">
        <div class="cb-header-identity">
          <div class="cb-avatar" aria-hidden="true">
            <i class="fa-solid fa-brain"></i>
            <span class="cb-avatar-dot"></span>
          </div>
          <div class="cb-header-info">
            <div class="cb-title">
              Himanshu's AI
              <span class="cb-title-tag">Gemini + Cloud AI</span>
            </div>
            <span class="cb-subtitle">Gemini & Portfolio Intelligence • Voice Live</span>
          </div>
        </div>
        <div class="cb-header-actions">
          <button class="cb-icon-btn cb-voice-toggle-btn" id="cbVoiceToggleBtn" title="Toggle Voice Mode (Speaks answers aloud)" aria-label="Toggle Auto-Speak">
            <i class="fa-solid fa-volume-high" id="cbVoiceToggleIcon" aria-hidden="true"></i>
          </button>
          <button class="cb-icon-btn" id="cbNewChatBtn" title="Reset & Start New Chat" aria-label="Start New Chat">
            <i class="fa-solid fa-rotate-right" aria-hidden="true"></i>
          </button>
          <button class="cb-icon-btn" id="cbCloseBtn" title="Close Assistant (Esc)" aria-label="Close Assistant">
            <i class="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>
        </div>
      </header>

      <!-- Messages Body -->
      <div class="cb-body" id="cbMessagesContainer" role="log" aria-live="polite">
        <!-- Initial suggestions will be injected here -->
      </div>

      <!-- Footer & Input -->
      <footer class="cb-footer">
        <!-- Voice Listening Banner -->
        <div class="cb-voice-status-bar" id="cbVoiceStatusBar" aria-live="polite">
          <span><i class="fa-solid fa-microphone-lines"></i> Listening... Speak in English, Hindi, or Hinglish</span>
          <div class="cb-audio-wave-anim">
            <span class="cb-audio-wave-bar"></span>
            <span class="cb-audio-wave-bar"></span>
            <span class="cb-audio-wave-bar"></span>
            <span class="cb-audio-wave-bar"></span>
          </div>
        </div>

        <form class="cb-input-form" id="cbInputForm" autocomplete="off">
          <textarea
            id="cbInputTextarea"
            class="cb-textarea"
            rows="1"
            placeholder="Ask AI/ML, talk via mic, or ask about Himanshu..."
            maxlength="${MAX_INPUT_LENGTH}"
            aria-label="Your question for Himanshu's AI"
          ></textarea>
          <button type="button" class="cb-mic-btn" id="cbMicBtn" title="Speak via Microphone (Hindi / English)" aria-label="Voice Input">
            <i class="fa-solid fa-microphone" id="cbMicIcon" aria-hidden="true"></i>
          </button>
          <button type="submit" class="cb-send-btn" id="cbSendBtn" aria-label="Send message" disabled>
            <i class="fa-solid fa-arrow-up" aria-hidden="true"></i>
          </button>
        </form>
        <div class="cb-footer-meta">
          <span>AI/ML Specialist & Portfolio Telemetry</span>
          <span class="cb-char-counter" id="cbCharCounter">0 / ${MAX_INPUT_LENGTH}</span>
        </div>
      </footer>
    `;

    document.body.appendChild(triggerWrap);
    document.body.appendChild(windowOverlay);

    // Cache elements
    this.dom = {
      triggerWrap,
      floatingBtn: document.getElementById('cbFloatingBtn'),
      btnIcon: document.getElementById('cbBtnIcon'),
      teaserTooltip: document.getElementById('cbTeaserTooltip'),
      teaserClose: document.getElementById('cbTeaserClose'),
      windowOverlay,
      closeBtn: document.getElementById('cbCloseBtn'),
      newChatBtn: document.getElementById('cbNewChatBtn'),
      voiceToggleBtn: document.getElementById('cbVoiceToggleBtn'),
      voiceToggleIcon: document.getElementById('cbVoiceToggleIcon'),
      messagesContainer: document.getElementById('cbMessagesContainer'),
      voiceStatusBar: document.getElementById('cbVoiceStatusBar'),
      inputForm: document.getElementById('cbInputForm'),
      textarea: document.getElementById('cbInputTextarea'),
      micBtn: document.getElementById('cbMicBtn'),
      sendBtn: document.getElementById('cbSendBtn'),
      charCounter: document.getElementById('cbCharCounter')
    };
  }

  // ---------------------------------------------------------------------------
  // Voice Assistant Initialization (Speech-to-Text & Text-to-Speech)
  // ---------------------------------------------------------------------------
  initVoiceAssistant() {
    // 1. Text-to-Speech Voice Mode state
    try {
      const savedMode = sessionStorage.getItem(VOICE_MODE_STORAGE_KEY);
      this.isVoiceModeEnabled = savedMode === 'true';
    } catch (e) {
      this.isVoiceModeEnabled = false;
    }
    this.updateVoiceToggleUI();

    // 2. Speech-to-Text (SpeechRecognition)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.speechRecognitionAvailable = true;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-IN'; // Indian English / Hindi phonetic

      this.recognition.onstart = () => {
        this.isListening = true;
        this.dom.micBtn.classList.add('listening');
        this.dom.voiceStatusBar.classList.add('active');
      };

      this.recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          this.dom.textarea.value = transcript;
          this.handleTextareaInput();
        }
      };

      this.recognition.onerror = (event) => {
        console.warn('[Speech Recognition Notice]', event.error);
        this.stopListening();
      };

      this.recognition.onend = () => {
        this.stopListening();
      };
    } else {
      this.speechRecognitionAvailable = false;
    }

    // Pre-load available synthesis voices
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }

  toggleListening() {
    if (!this.speechRecognitionAvailable) {
      alert('Voice input is supported in Google Chrome, Microsoft Edge, Safari, and Android browsers.');
      return;
    }

    if (this.isListening) {
      this.stopListening();
    } else {
      try {
        // Stop any current voice readout before user speaks
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        this.recognition.start();
      } catch (err) {
        console.warn('[Voice start error]', err);
        this.stopListening();
      }
    }
  }

  stopListening() {
    this.isListening = false;
    if (this.dom.micBtn) this.dom.micBtn.classList.remove('listening');
    if (this.dom.voiceStatusBar) this.dom.voiceStatusBar.classList.remove('active');
    if (this.recognition) {
      try { this.recognition.stop(); } catch (e) {}
    }
  }

  toggleVoiceMode() {
    this.isVoiceModeEnabled = !this.isVoiceModeEnabled;
    try {
      sessionStorage.setItem(VOICE_MODE_STORAGE_KEY, String(this.isVoiceModeEnabled));
    } catch (e) {}
    this.updateVoiceToggleUI();

    if (!this.isVoiceModeEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (this.currentSpeakingBtn) {
        this.currentSpeakingBtn.classList.remove('speaking');
        this.currentSpeakingBtn.querySelector('span').textContent = 'Listen';
        this.currentSpeakingBtn = null;
      }
    }
  }

  updateVoiceToggleUI() {
    if (this.isVoiceModeEnabled) {
      this.dom.voiceToggleBtn.classList.add('voice-active');
      this.dom.voiceToggleIcon.className = 'fa-solid fa-volume-high';
      this.dom.voiceToggleBtn.title = 'Voice Mode: ON (Assistant reads replies aloud. Click to Mute)';
    } else {
      this.dom.voiceToggleBtn.classList.remove('voice-active');
      this.dom.voiceToggleIcon.className = 'fa-solid fa-volume-xmark';
      this.dom.voiceToggleBtn.title = 'Voice Mode: OFF (Click to enable Voice Readout)';
    }
  }

  cleanTextForSpeech(markdown) {
    if (!markdown) return '';
    return markdown
      .replace(/```[\s\S]*?```/g, 'Code example provided.')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/[-*#]/g, '')
      .replace(/\n+/g, ' ')
      .trim();
  }

  speakText(text, btnElement = null) {
    if (!('speechSynthesis' in window)) return;

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      if (this.currentSpeakingBtn) {
        this.currentSpeakingBtn.classList.remove('speaking');
        const span = this.currentSpeakingBtn.querySelector('span');
        if (span) span.textContent = 'Listen';
        this.currentSpeakingBtn = null;
      }
      if (btnElement && btnElement === this.lastClickedSpeakBtn) {
        this.lastClickedSpeakBtn = null;
        return;
      }
    }

    const clean = this.cleanTextForSpeech(text);
    if (!clean) return;

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1.02;
    utterance.pitch = 1.0;

    // Detect language: check for Hindi Devanagari or common Hindi phonetic words
    const isHindi = /[\u0900-\u097F]/.test(text) || /\b(hai|hote|karein|batao|kya|aur|ka|ki|ke|se|unhone|usne)\b/i.test(text);
    const voices = window.speechSynthesis.getVoices();

    if (isHindi) {
      const hindiVoice = voices.find(v => v.lang.includes('hi') || v.name.includes('Hindi') || v.name.includes('Swara') || v.name.includes('Madhur'));
      if (hindiVoice) utterance.voice = hindiVoice;
      utterance.lang = 'hi-IN';
    } else {
      const englishVoice = voices.find(v => (v.lang === 'en-IN' || v.lang === 'en-US' || v.lang === 'en-GB') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Microsoft') || v.name.includes('Samantha')));
      if (englishVoice) utterance.voice = englishVoice;
      utterance.lang = 'en-IN';
    }

    if (btnElement) {
      this.currentSpeakingBtn = btnElement;
      this.lastClickedSpeakBtn = btnElement;
      btnElement.classList.add('speaking');
      const span = btnElement.querySelector('span');
      if (span) span.textContent = 'Speaking...';
    }

    utterance.onend = () => {
      if (this.currentSpeakingBtn) {
        this.currentSpeakingBtn.classList.remove('speaking');
        const span = this.currentSpeakingBtn.querySelector('span');
        if (span) span.textContent = 'Listen';
        this.currentSpeakingBtn = null;
      }
    };

    utterance.onerror = () => {
      if (this.currentSpeakingBtn) {
        this.currentSpeakingBtn.classList.remove('speaking');
        const span = this.currentSpeakingBtn.querySelector('span');
        if (span) span.textContent = 'Listen';
        this.currentSpeakingBtn = null;
      }
    };

    window.speechSynthesis.speak(utterance);
  }

  setupTeaserTimer() {
    setTimeout(() => {
      if (!this.isOpen && this.dom.teaserTooltip) {
        this.dom.teaserTooltip.classList.add('visible');
        this.dom.teaserTooltip.setAttribute('aria-hidden', 'false');
      }
    }, 4000);
  }

  loadSessionHistory() {
    try {
      const saved = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          chatHistory = parsed;
          this.renderRestoredMessages();
          return;
        }
      }
    } catch (e) {
      console.warn('[Chatbot] Failed to load session:', e);
    }

    this.renderWelcomeState();
  }

  saveSessionHistory() {
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(chatHistory.slice(-MAX_HISTORY_MESSAGES)));
    } catch (e) {
      console.warn('[Chatbot] Failed to save session:', e);
    }
  }

  renderWelcomeState() {
    this.dom.messagesContainer.innerHTML = '';

    // 1. Assistant Welcome Bubble
    const welcomeRow = document.createElement('div');
    welcomeRow.className = 'cb-message-row assistant';
    welcomeRow.innerHTML = `
      <div class="cb-bubble">
        ${renderSafeMarkdown(WELCOME_GREETING)}
      </div>
    `;
    this.dom.messagesContainer.appendChild(welcomeRow);

    // 2. Clickable suggested questions
    const suggestionsWrap = document.createElement('div');
    suggestionsWrap.className = 'cb-suggestions-section';
    suggestionsWrap.id = 'cbSuggestionsWrap';
    suggestionsWrap.innerHTML = `
      <span class="cb-suggestions-label">Explore Capabilities:</span>
      <div class="cb-chips-grid">
        ${SUGGESTED_QUESTIONS.map(q => `
          <button class="cb-chip-btn" data-query="${escapeHtml(q.text)}">
            <i class="${q.icon}" aria-hidden="true"></i>
            <span>${escapeHtml(q.text)}</span>
          </button>
        `).join('')}
      </div>
    `;
    this.dom.messagesContainer.appendChild(suggestionsWrap);
    this.scrollToBottom();
  }

  renderRestoredMessages() {
    this.dom.messagesContainer.innerHTML = '';
    chatHistory.forEach((msg, idx) => {
      this.appendMessageBubble(msg.role, msg.content, false, `restored-${idx}`);
    });
    this.scrollToBottom();
  }

  bindEvents() {
    // Open/Close
    this.dom.floatingBtn.addEventListener('click', () => this.toggleWindow());
    this.dom.closeBtn.addEventListener('click', () => this.closeWindow());

    // Teaser click
    this.dom.teaserTooltip.addEventListener('click', (e) => {
      if (e.target !== this.dom.teaserClose) {
        this.openWindow();
      }
    });
    this.dom.teaserClose.addEventListener('click', (e) => {
      e.stopPropagation();
      this.dom.teaserTooltip.classList.remove('visible');
    });

    // Reset Chat
    this.dom.newChatBtn.addEventListener('click', () => this.resetChat());

    // Toggle Voice Mode (auto read aloud)
    this.dom.voiceToggleBtn.addEventListener('click', () => this.toggleVoiceMode());

    // Microphone speech recognition button
    this.dom.micBtn.addEventListener('click', () => this.toggleListening());

    // Suggested chip clicks & Toolbar actions
    this.dom.messagesContainer.addEventListener('click', (e) => {
      const chip = e.target.closest('.cb-chip-btn');
      if (chip && !isStreaming) {
        const query = chip.getAttribute('data-query');
        if (query) {
          this.submitMessage(query);
        }
      }

      // Copy reply button
      const copyBtn = e.target.closest('.cb-copy-btn');
      if (copyBtn) {
        const textToCopy = copyBtn.getAttribute('data-text') || '';
        navigator.clipboard.writeText(textToCopy).then(() => {
          copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Copied!</span>';
          copyBtn.classList.add('active');
          setTimeout(() => {
            copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> <span>Copy</span>';
            copyBtn.classList.remove('active');
          }, 2000);
        });
      }

      // Speak / Listen button on message bubble
      const speakBtn = e.target.closest('.cb-speak-btn');
      if (speakBtn) {
        const textToSpeak = speakBtn.getAttribute('data-text') || '';
        this.speakText(textToSpeak, speakBtn);
      }

      // Feedback buttons (console logged only)
      const feedbackBtn = e.target.closest('.cb-feedback-btn');
      if (feedbackBtn) {
        const rating = feedbackBtn.getAttribute('data-rating');
        const turnId = feedbackBtn.getAttribute('data-turn');
        feedbackBtn.classList.add('active');
        console.log(`[Himanshu AI Chatbot Feedback] Turn: ${turnId}, Rating: ${rating}`);
      }

      // Retry button
      const retryBtn = e.target.closest('.cb-retry-btn');
      if (retryBtn && !isStreaming) {
        const lastUserMsg = [...chatHistory].reverse().find(m => m.role === 'user');
        if (lastUserMsg) {
          this.sendToAI(lastUserMsg.content, true);
        }
      }
    });

    // Auto-resize textarea & character limit
    this.dom.textarea.addEventListener('input', () => {
      this.handleTextareaInput();
    });

    // Keyboard support: Enter to send, Esc to close
    this.dom.textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.handleFormSubmit();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeWindow();
      }
    });

    // Form submit
    this.dom.inputForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit();
    });
  }

  handleTextareaInput() {
    const val = this.dom.textarea.value;
    const len = val.length;

    // Auto resize
    this.dom.textarea.style.height = 'auto';
    this.dom.textarea.style.height = Math.min(this.dom.textarea.scrollHeight, 110) + 'px';

    // Update counter
    this.dom.charCounter.textContent = `${len} / ${MAX_INPUT_LENGTH}`;
    if (len >= MAX_INPUT_LENGTH) {
      this.dom.charCounter.className = 'cb-char-counter limit';
    } else if (len >= MAX_INPUT_LENGTH * 0.85) {
      this.dom.charCounter.className = 'cb-char-counter warning';
    } else {
      this.dom.charCounter.className = 'cb-char-counter';
    }

    // Enable/disable send
    this.dom.sendBtn.disabled = len === 0 || isStreaming;
  }

  handleFormSubmit() {
    if (isStreaming) return;
    this.stopListening();
    const query = this.dom.textarea.value.trim();
    if (!query) return;

    this.dom.textarea.value = '';
    this.handleTextareaInput();
    this.submitMessage(query);
  }

  toggleWindow() {
    if (this.isOpen) {
      this.closeWindow();
    } else {
      this.openWindow();
    }
  }

  openWindow() {
    this.isOpen = true;
    this.dom.windowOverlay.classList.add('open');
    this.dom.windowOverlay.setAttribute('aria-hidden', 'false');
    this.dom.floatingBtn.setAttribute('aria-expanded', 'true');
    this.dom.btnIcon.className = 'fa-solid fa-chevron-down';
    this.dom.teaserTooltip.classList.remove('visible');

    setTimeout(() => {
      this.dom.textarea.focus();
    }, 150);
  }

  closeWindow() {
    this.isOpen = false;
    this.stopListening();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    this.dom.windowOverlay.classList.remove('open');
    this.dom.windowOverlay.setAttribute('aria-hidden', 'true');
    this.dom.floatingBtn.setAttribute('aria-expanded', 'false');
    this.dom.btnIcon.className = 'fa-solid fa-robot';
    this.dom.floatingBtn.focus();
  }

  resetChat() {
    if (isStreaming && abortController) {
      abortController.abort();
      isStreaming = false;
    }
    this.stopListening();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    chatHistory = [];
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    this.renderWelcomeState();
  }

  scrollToBottom() {
    this.dom.messagesContainer.scrollTop = this.dom.messagesContainer.scrollHeight;
  }

  appendMessageBubble(role, content, animate = true, turnId = `turn-${Date.now()}`) {
    const row = document.createElement('div');
    row.className = `cb-message-row ${role}`;
    row.id = turnId;

    const bubble = document.createElement('div');
    bubble.className = 'cb-bubble';
    bubble.innerHTML = renderSafeMarkdown(content);
    row.appendChild(bubble);

    if (role === 'assistant') {
      const actions = document.createElement('div');
      actions.className = 'cb-message-actions';
      actions.innerHTML = `
        <button class="cb-action-btn cb-speak-btn" data-text="${escapeHtml(content)}" title="Listen (Text-to-Speech)">
          <i class="fa-solid fa-volume-low"></i>
          <span>Listen</span>
        </button>
        <button class="cb-action-btn cb-copy-btn" data-text="${escapeHtml(content)}" title="Copy message">
          <i class="fa-regular fa-copy"></i>
          <span>Copy</span>
        </button>
        <button class="cb-action-btn cb-feedback-btn" data-rating="up" data-turn="${turnId}" title="Helpful response">
          <i class="fa-regular fa-thumbs-up"></i>
        </button>
        <button class="cb-action-btn cb-feedback-btn" data-rating="down" data-turn="${turnId}" title="Not helpful">
          <i class="fa-regular fa-thumbs-down"></i>
        </button>
      `;
      row.appendChild(actions);
    }

    this.dom.messagesContainer.appendChild(row);
    this.scrollToBottom();
    return { row, bubble };
  }

  showTypingIndicator() {
    const typingRow = document.createElement('div');
    typingRow.className = 'cb-message-row assistant';
    typingRow.id = 'cbTypingIndicator';
    typingRow.innerHTML = `
      <div class="cb-typing-indicator" aria-label="Himanshu's AI is processing">
        <span class="cb-typing-dot"></span>
        <span class="cb-typing-dot"></span>
        <span class="cb-typing-dot"></span>
      </div>
    `;
    this.dom.messagesContainer.appendChild(typingRow);
    this.scrollToBottom();
  }

  removeTypingIndicator() {
    const indicator = document.getElementById('cbTypingIndicator');
    if (indicator) {
      indicator.remove();
    }
  }

  showErrorMessage(errorText) {
    this.removeTypingIndicator();
    const errorRow = document.createElement('div');
    errorRow.className = 'cb-message-row assistant';
    errorRow.innerHTML = `
      <div class="cb-error-card">
        <div><strong>Assistant Notice:</strong> ${escapeHtml(errorText)}</div>
        <button class="cb-retry-btn">
          <i class="fa-solid fa-rotate-right"></i> Retry Question
        </button>
      </div>
    `;
    this.dom.messagesContainer.appendChild(errorRow);
    this.scrollToBottom();
  }

  submitMessage(text) {
    if (!text || isStreaming) return;

    // Append User Message
    chatHistory.push({ role: 'user', content: text });
    this.appendMessageBubble('user', text);
    this.saveSessionHistory();

    // Send to Assistant
    this.sendToAI(text);
  }

  async sendToAI(userQuery, isRetry = false) {
    isStreaming = true;
    this.dom.sendBtn.disabled = true;
    this.showTypingIndicator();

    abortController = new AbortController();

    const isWorkerConfigured = WORKER_URL && !WORKER_URL.includes('your-subdomain') && !WORKER_URL.includes('example.com');

    if (!isWorkerConfigured) {
      await this.streamLocalMockResponse(userQuery);
      return;
    }

    try {
      const payload = {
        messages: chatHistory.slice(-MAX_HISTORY_MESSAGES)
      };

      const response = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: abortController.signal
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded (max 20 requests per 10 mins). Please pause briefly before asking another question.');
        }
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with status ${response.status}`);
      }

      this.removeTypingIndicator();

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullAssistantText = '';
      const turnId = `turn-${Date.now()}`;
      const { row, bubble } = this.appendMessageBubble('assistant', '', true, turnId);

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data: ')) continue;
          const dataStr = trimmed.slice(6);
          if (dataStr === '[DONE]') break;

          try {
            const data = JSON.parse(dataStr);
            if (data.text) {
              fullAssistantText += data.text;
              bubble.innerHTML = renderSafeMarkdown(fullAssistantText);
              this.scrollToBottom();
            } else if (data.error) {
              throw new Error(data.error);
            }
          } catch (e) {}
        }
      }

      chatHistory.push({ role: 'assistant', content: fullAssistantText });
      this.saveSessionHistory();

      // Update action button texts
      const copyBtn = row.querySelector('.cb-copy-btn');
      if (copyBtn) copyBtn.setAttribute('data-text', fullAssistantText);
      const speakBtn = row.querySelector('.cb-speak-btn');
      if (speakBtn) speakBtn.setAttribute('data-text', fullAssistantText);

      // Auto-speak if Voice Mode is active
      if (this.isVoiceModeEnabled) {
        this.speakText(fullAssistantText, speakBtn);
      }

    } catch (err) {
      if (err.name === 'AbortError') return;

      console.warn('[Chatbot Worker Error - Falling back to local intelligence]', err);
      this.removeTypingIndicator();
      await this.streamLocalMockResponse(userQuery, true);
    } finally {
      isStreaming = false;
      this.dom.sendBtn.disabled = this.dom.textarea.value.trim().length === 0;
    }
  }

  async streamLocalMockResponse(userQuery, fallbackNotice = false) {
    const kb = await getLocalKnowledge();
    let reply = generateLocalMockResponse(userQuery, kb);

    if (fallbackNotice) {
      reply = `*(Local Virtual AI Mode)*\n\n${reply}`;
    }

    this.removeTypingIndicator();
    const turnId = `turn-${Date.now()}`;
    const { row, bubble } = this.appendMessageBubble('assistant', '', true, turnId);

    const words = reply.split(' ');
    let currentText = '';

    for (let i = 0; i < words.length; i++) {
      if (!isStreaming) break;
      currentText += (i === 0 ? '' : ' ') + words[i];
      bubble.innerHTML = renderSafeMarkdown(currentText);
      this.scrollToBottom();
      await new Promise(r => setTimeout(r, 20));
    }

    chatHistory.push({ role: 'assistant', content: currentText });
    this.saveSessionHistory();

    const copyBtn = row.querySelector('.cb-copy-btn');
    if (copyBtn) copyBtn.setAttribute('data-text', currentText);
    const speakBtn = row.querySelector('.cb-speak-btn');
    if (speakBtn) speakBtn.setAttribute('data-text', currentText);

    // Auto-speak if Voice Mode is active
    if (this.isVoiceModeEnabled) {
      this.speakText(currentText, speakBtn);
    }

    isStreaming = false;
    this.dom.sendBtn.disabled = this.dom.textarea.value.trim().length === 0;
  }
}

// -----------------------------------------------------------------------------
// 6. LAZY INITIALIZATION
// -----------------------------------------------------------------------------
function initializeChatbot() {
  if (window.__hkChatbotInitialized) return;
  window.__hkChatbotInitialized = true;
  new AIChatbotWidget();
}

if (document.readyState === 'complete') {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(initializeChatbot);
  } else {
    setTimeout(initializeChatbot, 400);
  }
} else {
  window.addEventListener('load', () => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(initializeChatbot);
    } else {
      setTimeout(initializeChatbot, 400);
    }
  });
}
