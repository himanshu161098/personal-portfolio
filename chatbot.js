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
  { icon: 'fa-solid fa-bolt', text: 'Give me a 30-second pitch about Himanshu 🚀' },
  { icon: 'fa-solid fa-chart-line', text: 'Tell me about the Netflix analysis project (8,787 titles) 📊' },
  { icon: 'fa-solid fa-laptop-code', text: 'What are Himanshu\'s core technical skills & stack? 💻' },
  { icon: 'fa-solid fa-graduation-cap', text: 'What is his education background & college? 🎓' },
  { icon: 'fa-solid fa-user-check', text: 'Why hire Himanshu for a Data Analyst role? 💼' },
  { icon: 'fa-solid fa-envelope', text: 'How can I contact or hire Himanshu? 📬' }
];

// Initial welcome greeting
const WELCOME_GREETING = `Hello! 👋 I am **Quantix AI**, Himanshu's Portfolio & Data Intelligence Assistant.

I am your dedicated interactive guide to **Himanshu Kumar's** professional profile, technical capabilities, and engineering projects:
- 📊 **Netflix Content Analysis**: Deep EDA on 8,787 clean movie and TV show titles, international catalog expansion & trends.
- 💻 **Technical Stack**: Python (Pandas, NumPy), SQL (Aggregations, JOINs), Power BI, Three.js, Tableau, Excel.
- 🎓 **Education & Background**: Final-year B.Tech in CSE-IT at IIMT College of Engineering (AKTU), Greater Noida.
- 📜 **5+ Certifications**: Python, Data Analytics, and AI/ML verified credentials.
- 💼 **Recruiter Fit**: Honest JD fit for Data Analyst / BI Internships, resume download, and contact details.

What would you like to explore about Himanshu's work?
*(Looking for an empathetic human AI friend or universal Math/Science solving? Connect with [Prachi AI](prachi.html)!)*`;

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

  // Markdown links [text](url) - Safe schemes only (external + relative/internal)
  html = html.replace(/\[([^\]]+)\]\(((?:https?:\/\/|mailto:|[a-zA-Z0-9_\-\.\/]+\.html(?:#[^\s)]*)?|#[a-zA-Z0-9_\-]+)[^\s)]*)\)/g, (match, text, url) => {
    const isExternal = url.startsWith('http://') || url.startsWith('https://');
    const targetAttr = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a href="${url}"${targetAttr}>${text}</a>`;
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
  const q = (userQuery || '').toLowerCase().trim();

  // 1. Identity / Introduction / Who are you
  if (/who are you|tum kaun ho|apna naam|identity|intro|kya ho|what is your name|who made you|creator|quantix/i.test(q)) {
    return `Namaste! 👋 Main **Quantix AI** hoon — Himanshu Kumar ka dedicated Portfolio & Data Intelligence Assistant.

🌟 **Main aapko Himanshu ke baare me kya bata sakta hoon?**
1. 📊 **Netflix Analysis Project**: 8,787 titles ka deep exploratory data analysis (EDA).
2. 💻 **Technical Stack**: Python (Pandas, NumPy), SQL, Power BI, Three.js, Tableau, Excel.
3. 🎓 **Education**: B.Tech CSE-IT (Final Year) at IIMT College of Engineering (AKTU), Greater Noida.
4. 📜 **Certifications**: 5+ verified industry credentials in Data Analytics & AI/ML.
5. 💼 **Recruiter Fit & Resume**: JD evaluation, resume download, and contact details.

Aap Himanshu ke kisi bhi project ya skill ke baare me pooch sakte hain!

💡 *Note: Agar aapko human-like conversation, emotional chat, ya deep Math/Science step-by-step numerical solving chahiye, toh aap hamari companion AI **[Prachi AI](prachi.html)** se baat kar sakte hain!*`;
  }

  // 2. Questions about Prachi AI
  if (/prachi/i.test(q)) {
    return `### 🤖 Prachi AI — Human-like AI Companion & Universal Problem Solver

**Prachi AI** hamari standalone **Human-like AI Companion** hai jo bilkul ek sachhe dost ki tarah baat karti hai:
- ❤️ **Human Emotions & Empathy**: Dil ki baatein sunna, life advice, motivation, emotional support, aur friendly chit-chat.
- 📐 **Universal STEM Solver**: Step-by-step Math numericals, Physics, Chemistry, Biology aur Coding solutions.
- 🎙️ **Sweet Female Voice**: Natural Hindi aur English female voice synthesis.

Aap Prachi AI se yahan baat kar sakte hain:
👉 **[Open Prachi AI Companion](prachi.html)**`;
  }

  // 3. 30-Second Recruiter Pitch / About Himanshu
  if (/pitch|30-second|who is himanshu|about himanshu|himanshu kaun hai|profile|bio|summary|background/i.test(q)) {
    return `### 🚀 30-Second Professional Pitch: Himanshu Kumar

Himanshu Kumar is a final-year **B.Tech (Computer Science & Engineering - IT)** student at **IIMT College of Engineering, Greater Noida (AKTU)**, actively targeting **Data Analyst internships** and entry-level Business Intelligence roles.

- 📊 **Hands-on Big Data EDA**: Analyzed an **8,787-title Netflix catalog** using Python, Pandas, and Matplotlib during his internship at **Auspify Technologies**.
- 🛠️ **Core Technical Toolkit**: Python (Pandas, NumPy), SQL (Complex JOINs, Aggregations, Window Functions), Power BI, Microsoft Excel, and interactive 3D web engineering with Three.js.
- 📜 **Certified Competency**: 5 completed industry credentials in Data Analytics, Python, and AI/ML foundations.
- 💼 **Ready to Contribute**: Strong analytical mindset, clean coding practices, and business data storytelling.

Would you like to review his **Netflix analysis project** or his **technical skill stack**?`;
  }

  // 4. Netflix Content Analysis Project
  if (/netflix|sales|auspify|catalog|eda|content analysis|8787/i.test(q)) {
    return `### 🎬 Project Spotlight: Netflix Content Analysis (8,787 Titles)
*Executed by Himanshu Kumar during his Data Analytics Internship at Auspify Technologies*

- 📊 **Dataset Scope**: Thorough exploratory analysis on **8,787 clean movie and TV show titles**.
- ⚠️ **Key Clarification**: This project analyzes **Content Catalog Trends & Distribution** (movie vs. TV show ratio, release year spikes, international expansion across US, India, UK, and rating distributions like TV-MA & TV-14) — *not* sales or subscription financial revenues (despite the repository naming).
- 🛠️ **Tech Stack Used**: Python, Pandas, NumPy, Matplotlib, Jupyter Notebook, ReportLab.
- 🔍 **Core Insights Discovered**:
  1. Exponential surge in international content additions after 2015.
  2. TV-MA and TV-14 account for over 60% of all catalog offerings.
  3. India and the US represent the largest regional content clusters.
- 🔗 **GitHub Repository**: [github.com/himanshu161098/Netfix-Sales](https://github.com/himanshu161098/Netfix-Sales)`;
  }

  // 5. Technical Skills & Stack
  if (/skill|technolog|stack|tools|python|sql|power bi|excel|three\.?js|tableau|mongo/i.test(q)) {
    return `### 🛠️ Himanshu Kumar — Verified Technical Skills

- 📊 **Data Analytics & BI**: Python (Pandas, NumPy), Exploratory Data Analysis (EDA), Data Cleaning & Imputation, Matplotlib, Power BI (Interactive Dashboards, DAX), Microsoft Excel (Pivot Tables, VLOOKUP, XLOOKUP).
- 🗄️ **Databases & Querying**: SQL (MySQL, PostgreSQL basics), Complex JOINs, Aggregations, GROUP BY, Subqueries, Indexing, MongoDB.
- 💻 **Programming Languages**: Python, SQL, JavaScript (ES6+), C++, Java (Core).
- 🌐 **Web & Interactive Engineering**: HTML5, Modern CSS3 (Glassmorphism, Cyberpunk UI, Flexbox, Grid), Three.js (WebGL 3D graphics).
- ⚙️ **Developer Tooling**: Git, GitHub Actions (Automated CI/CD Cron), Jupyter Notebook, VS Code.

Would you like to know how he applied these in his **projects** or his **education**?`;
  }

  // 6. Education & Academic Background
  if (/education|college|degree|b\.?tech|aktu|iimt|school|bseb|10th|12th|academic/i.test(q)) {
    return `### 🎓 Himanshu Kumar — Academic Qualifications

- 🎓 **B.Tech in Computer Science & Engineering (Information Technology)**:
  - **Institution**: IIMT College of Engineering, Greater Noida (Affiliated with Dr. A.P.J. Abdul Kalam Technical University - AKTU).
  - **Status**: Final-Year Undergraduate (Class of 2026).
  - **Focus**: Data Structures, Database Management Systems (DBMS), Operating Systems, Software Engineering & Data Analytics.
- 🏫 **Senior Secondary (Class XII)**: Bihar School Examination Board (BSEB), 2023 — **67.8%**.
- 🏫 **Secondary (Class X)**: Bihar School Examination Board (BSEB), 2021 — **68.2%**.`;
  }

  // 7. Projects Overview (All 4 Projects)
  if (/project|work|portfolio project|uno|card game|smart house|security|repo/i.test(q)) {
    return `### 📂 Himanshu Kumar — Featured Engineering Projects

1. 📊 **Netflix Content Analysis Project**:
   - Python EDA on 8,787 Netflix titles; data cleansing, distributions, genre & regional trends.
   - [GitHub Repo](https://github.com/himanshu161098/Netfix-Sales)
2. 🌐 **Interactive 3D Developer Portfolio**:
   - Built with Three.js, WebGL 3D procedural animations, and vanilla CSS glassmorphism.
   - GitHub Actions automated cron for real-time live sync.
   - [Live Portfolio](https://himanshu161098.github.io/personal-portfolio/)
3. 🃏 **UNO Browser Card Game**:
   - Fully interactive web implementation of the classic UNO card game built with OOP JavaScript, custom turn logic, special cards (Skip, Reverse, Draw Two, Wild Draw Four), and smooth animations.
4. 🏡 **AI Smart House Security System**:
   - Integrated sensor monitoring architecture with cloud alert endpoints, camera feed simulation, and anomaly detection rules.`;
  }

  // 8. Contact Details & Socials
  if (/contact|email|reach|linkedin|github|phone|whatsapp|location|address|kahan rehta/i.test(q)) {
    return `### 📬 Contact & Connect with Himanshu Kumar

- 💼 **LinkedIn**: [linkedin.com/in/himanshu-kumar-1618hks/](https://www.linkedin.com/in/himanshu-kumar-1618hks/)
- 💻 **GitHub**: [github.com/himanshu161098](https://github.com/himanshu161098)
- 🌐 **Live Portfolio**: [himanshu161098.github.io/personal-portfolio/](https://himanshu161098.github.io/personal-portfolio/)
- 📧 **Email**: \`himanshukumarsingh161098@gmail.com\`
- 📍 **Location**: Greater Noida / Delhi NCR, India (Open to on-site, hybrid, and remote roles across India).`;
  }

  // 9. Resume & Download
  if (/resume|cv|biodata|download resume/i.test(q)) {
    return `### 📄 Himanshu Kumar — Resume

- 📥 **Download PDF Resume**: [Download Himanshu_Kumar_Resume.pdf](assets/Himanshu_Kumar_Resume.pdf)
- **Summary**:
  - Target Role: Data Analyst Intern / Junior BI Analyst
  - Education: B.Tech CSE-IT at IIMT (AKTU), Class of 2026
  - Key Project: 8,787 Netflix content analysis
  - Top Skills: Python, SQL, Power BI, Excel, EDA, Three.js
  - Status: Immediately available for internships & entry-level openings.`;
  }

  // 10. Why Hire Himanshu / Recruiter Fit / Role Fit
  if (/why hire|fit|role|job|internship|jd|recruit|salary|experience|fresher/i.test(q)) {
    return `### 💼 Why Hire Himanshu Kumar? (Recruiter Fit)

1. ✅ **Demonstrated Data Cleaning & EDA Ability**:
   Unlike candidates who only use clean textbook samples, Himanshu cleaned and parsed an **8,787-row real-world dataset** with complex missing values, nested genres, and inconsistent date formats.
2. ✅ **Solid SQL & Python Foundations**:
   Proficient in writing optimized SQL queries (JOINs, aggregations, window functions) and Python analysis workflows with Pandas and NumPy.
3. ✅ **Visual Storytelling & Business Sense**:
   Transforms raw data into clear, intuitive insights using Power BI, Excel, and Matplotlib.
4. ✅ **Full-Stack & Web Savvy**:
   Understands modern web engineering (JavaScript, HTML, Three.js, Git CI/CD), making cross-functional team collaboration seamless.
5. ✅ **Availability**:
   Final-year student available immediately for 3-to-6 month internships and full-time placement upon graduation.`;
  }

  // 11. Certifications
  if (/certificat|course|license|credential|ibm|coursera|hackerrank/i.test(q)) {
    return `### 📜 Himanshu Kumar — Industry Certifications

Himanshu has earned **5 industry-recognized credentials** demonstrating verified practical competence:
1. 🏅 **Data Analytics Professional Certificate** (Hands-on EDA, Data Cleaning & Reporting)
2. 🐍 **Python for Data Science & AI** (Pandas, NumPy, Matplotlib)
3. 🗄️ **SQL Database Essentials & Advanced Querying** (Relational Modeling, JOINs, Optimization)
4. 🤖 **AI/ML Foundations** (Supervised & Unsupervised Learning Concepts)
5. 📊 **Business Intelligence & Dashboarding with Power BI & Excel**`;
  }

  // 12. Strengths and Work Ethic
  if (/strength|weakness|advantage|work ethic/i.test(q)) {
    return `### 💡 Strengths & Self-Awareness

- 🌟 **Core Strengths**:
  - High attention to detail in data cleaning and edge-case validation.
  - Quick learner capable of picking up new frameworks and cloud tools rapidly.
  - Clear communicator who bridges technical code with understandable insights.
- 🎯 **Areas Currently Leveling Up**:
  - Gaining deeper enterprise experience with distributed computing tools like Apache Spark / PySpark.
  - Expanding exposure to cloud data warehouses (Google BigQuery / Snowflake).`;
  }

  // 13. General Greetings
  if (/^(hi|hello|hey|namaste|pranam|greetings)\b/i.test(q) || q === 'hi' || q === 'hello') {
    return `Namaste! 👋 Swagat hai aapka! Main **Quantix AI** hoon — Himanshu's Portfolio & Data Intelligence Assistant.

Main Himanshu Kumar ke projects, skills, education aur career portfolio ke baare me sab kuch explain kar sakta hoon:
- 📊 **Netflix Content Analysis Project (8,787 titles)**
- 💻 **Technical Stack (Python, SQL, Power BI, Three.js)**
- 🎓 **Education (B.Tech CSE-IT at IIMT AKTU)**
- 💼 **Recruiter Fit & Resume Highlights**
- 📬 **Contact & Hiring Details**

Aap Himanshu ke baare me kya jaan-na chahenge?

*(Human-like companion chat ya universal Math/Science questions ke liye hamari companion AI [Prachi AI](prachi.html) check kijiye!)*`;
  }

  // 14. Fallback for non-portfolio questions (e.g. math or general queries)
  // Check if it's a math calculation
  if (typeof window !== 'undefined' && window.UniversalAIEngine && typeof window.UniversalAIEngine.evaluateMath === 'function') {
    const mathCalc = window.UniversalAIEngine.evaluateMath(userQuery);
    if (mathCalc) {
      return `${mathCalc}\n\n💡 *Note: Main Himanshu ka dedicated Quantix AI assistant hoon. Deep human-like conversations, feelings, aur universal Math/Science step-by-step solving ke liye aap hamari companion AI [Prachi AI](prachi.html) visit kar sakte hain!*`;
    }
  }

  // Fallback: If UniversalAIEngine is loaded, get an answer, but wrap it as Portfolio Assistant
  if (typeof window !== 'undefined' && window.UniversalAIEngine && typeof window.UniversalAIEngine.generateResponse === 'function') {
    const uniAns = window.UniversalAIEngine.generateResponse(userQuery, { assistantName: 'Quantix AI' });
    return `${uniAns}\n\n💡 *Note: Main Himanshu Kumar ka dedicated Quantix AI Portfolio Assistant hoon. Deep human-like friendly chat, emotional support, and complete universal problem-solving ke liye aap [Prachi AI](prachi.html) try kar sakte hain!*`;
  }

  return `Main **Quantix AI** hoon — Himanshu Kumar ka Portfolio & Data Intelligence Assistant! 

Aap Himanshu ke baare me ye sawaal pooch sakte hain:
- 📊 *"Tell me about the Netflix analysis project"*
- 💻 *"What are Himanshu's technical skills?"*
- 🎓 *"What is his educational background?"*
- 💼 *"Why should we hire Himanshu for a Data Analyst role?"*
- 📬 *"How can I contact Himanshu?"*

💡 *Agar aapko human-like conversation, emotional chat, ya deep Math/Science step-by-step solving chahiye, toh aap hamari companion AI **[Prachi AI](prachi.html)** se baat kar sakte hain!*`;
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
        <img src="assets/quantix-logo.png" alt="Quantix AI" class="cb-teaser-logo">
        <span>👋 Chat with <strong>Quantix AI</strong> • Meet the Mind Behind the Code.</span>
        <button class="cb-teaser-close" id="cbTeaserClose" aria-label="Dismiss notification">&times;</button>
      </div>
      <button class="cb-floating-btn" id="cbFloatingBtn" aria-label="Open Quantix AI Assistant" aria-haspopup="dialog" aria-expanded="false">
        <img src="assets/quantix-logo.png" alt="Quantix AI Logo" class="cb-floating-logo-img" id="cbFloatingImg">
        <i class="fa-solid fa-chevron-down cb-floating-close-icon" id="cbFloatingCloseIcon" style="display:none;font-size:1.3rem;"></i>
        <span class="cb-online-badge" aria-hidden="true"></span>
      </button>
    `;

    // 2. Chat Window Panel
    const windowOverlay = document.createElement('section');
    windowOverlay.className = 'cb-window-overlay';
    windowOverlay.id = 'cbWindowOverlay';
    windowOverlay.setAttribute('role', 'dialog');
    windowOverlay.setAttribute('aria-label', 'Quantix AI — Meet the Mind Behind the Code.');
    windowOverlay.setAttribute('aria-hidden', 'true');
    windowOverlay.innerHTML = `
      <!-- Header -->
      <header class="cb-header">
        <div class="cb-header-identity">
          <div class="cb-avatar" aria-hidden="true">
            <img src="assets/quantix-logo.png" alt="Quantix AI Logo" class="cb-header-avatar-img">
            <span class="cb-avatar-dot"></span>
          </div>
          <div class="cb-header-info">
            <div class="cb-title">
              Quantix AI
              <span class="cb-title-tag">Meet the Mind Behind the Code.</span>
            </div>
            <span class="cb-subtitle">Projects • Skills • 8,787 Netflix Analysis • Resume Fit</span>
          </div>
        </div>
        <div class="cb-header-actions">
          <button class="cb-icon-btn cb-voice-toggle-btn" id="cbVoiceToggleBtn" title="Toggle Voice Readout" aria-label="Toggle Auto-Speak">
            <i class="fa-solid fa-volume-high" id="cbVoiceToggleIcon" aria-hidden="true"></i>
          </button>
          <a href="prachi.html" class="cb-icon-btn" title="Open Prachi AI (Human-like AI Companion)" aria-label="Open Prachi AI">
            <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
          </a>
          <button class="cb-icon-btn" id="cbNewChatBtn" title="Reset &amp; Start New Chat" aria-label="Start New Chat">
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
          <span><i class="fa-solid fa-microphone-lines"></i> Quantix AI is Listening... Speak in English or Hindi</span>
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
            placeholder="Ask Quantix AI about Netflix project, skills, experience, or resume..."
            maxlength="${MAX_INPUT_LENGTH}"
            aria-label="Your question for Quantix AI"
          ></textarea>
          <button type="button" class="cb-mic-btn" id="cbMicBtn" title="Speak via Microphone (Hindi / English)" aria-label="Voice Input">
            <i class="fa-solid fa-microphone" id="cbMicIcon" aria-hidden="true"></i>
          </button>
          <button type="submit" class="cb-send-btn" id="cbSendBtn" aria-label="Send message" disabled>
            <i class="fa-solid fa-arrow-up" aria-hidden="true"></i>
          </button>
        </form>
        <div class="cb-footer-meta">
          <span>Quantix AI • Meet the Mind Behind the Code.</span>
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
      floatingImg: document.getElementById('cbFloatingImg'),
      floatingCloseIcon: document.getElementById('cbFloatingCloseIcon'),
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
    // Female voice acoustic settings: pleasant, warm feminine pitch & clear rate
    utterance.pitch = 1.18;
    utterance.rate = 0.98;

    // Detect language: check for Hindi Devanagari or common Hindi phonetic words
    const isHindi = /[\u0900-\u097F]/.test(text) || /\b(hai|hote|karein|batao|kya|aur|ka|ki|ke|se|unhone|usne|samvidhan|ganit|rasayan)\b/i.test(text);
    const voices = window.speechSynthesis.getVoices();

    // Select natural female voice
    const femaleNameRegex = /swara|heera|kalpana|lekha|neerja|priya|anjali|veena|zira|jenny|aria|samantha|victoria|karen|moira|tessa|fiona|eva|kendra|susan|cathy|allison|ava|stephanie|sarah|female|woman|girl/i;

    if (isHindi) {
      const hiFemale = voices.find(v => 
        v.lang.toLowerCase().includes('hi') && femaleNameRegex.test(v.name)
      );
      const anyHindi = hiFemale || voices.find(v => v.lang.toLowerCase().includes('hi') || /hindi/i.test(v.name));
      const fallbackEnInFemale = voices.find(v => v.lang.toLowerCase().includes('en-in') && femaleNameRegex.test(v.name));
      
      if (hiFemale) {
        utterance.voice = hiFemale;
      } else if (anyHindi) {
        utterance.voice = anyHindi;
      } else if (fallbackEnInFemale) {
        utterance.voice = fallbackEnInFemale;
      }
      utterance.lang = 'hi-IN';
    } else {
      // Prioritize natural Indian English female voices or Global English female voices
      const enInFemale = voices.find(v => 
        v.lang.toLowerCase().includes('en-in') && femaleNameRegex.test(v.name)
      );
      const globalFemale = voices.find(v => 
        v.lang.toLowerCase().startsWith('en') && femaleNameRegex.test(v.name)
      );
      const anyFemale = enInFemale || globalFemale || voices.find(v => femaleNameRegex.test(v.name));
      
      if (anyFemale) {
        utterance.voice = anyFemale;
      } else {
        const defaultVoice = voices.find(v => v.lang.toLowerCase().includes('en-in')) || 
                             voices.find(v => v.lang.toLowerCase().includes('en-us')) || 
                             voices[0];
        if (defaultVoice) utterance.voice = defaultVoice;
      }
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
    if (this.dom.floatingImg) this.dom.floatingImg.style.display = 'none';
    if (this.dom.floatingCloseIcon) this.dom.floatingCloseIcon.style.display = 'block';
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
    if (this.dom.floatingImg) this.dom.floatingImg.style.display = 'block';
    if (this.dom.floatingCloseIcon) this.dom.floatingCloseIcon.style.display = 'none';
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
        assistant: 'quantix',
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
