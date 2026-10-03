/**
 * ==============================================================================
 * Himanshu Kumar - AI Portfolio Assistant Chatbot Widget
 * Stack: Vanilla ES6+ JavaScript, Serverless Streaming (SSE), Session Persistence
 * ==============================================================================
 */

// -----------------------------------------------------------------------------
// 1. CONFIGURATION
// -----------------------------------------------------------------------------
// Replace with your deployed Cloudflare Worker endpoint (e.g. https://portfolio-chatbot-proxy.your-subdomain.workers.dev/api/chat)
const WORKER_URL = "https://portfolio-chatbot-proxy.your-subdomain.workers.dev/api/chat";

const SESSION_STORAGE_KEY = 'hk_portfolio_chat_session_v1';
const MAX_INPUT_LENGTH = 500;
const MAX_HISTORY_MESSAGES = 10;

// Suggested initial chips for quick visitor exploration
const SUGGESTED_QUESTIONS = [
  { icon: 'fa-solid fa-bolt', text: 'Give me a 30-second pitch about Himanshu' },
  { icon: 'fa-solid fa-code', text: 'What are his strongest skills?' },
  { icon: 'fa-solid fa-chart-line', text: 'Tell me about the Netflix analysis project' },
  { icon: 'fa-solid fa-user-check', text: 'Is he a good fit for a Data Analyst internship?' },
  { icon: 'fa-solid fa-briefcase', text: 'Analyze fit for a Job Description (Paste JD)' },
  { icon: 'fa-solid fa-envelope', text: 'How can I contact him?' }
];

// Initial welcome greeting
const WELCOME_GREETING = `Hello! 👋 I'm **Himanshu's AI Portfolio Assistant**.

I can answer questions about his **skills, data analysis projects, certifications, education**, or evaluate how well he matches your **job description**.

Feel free to ask a question in **English, Hindi, or Hinglish**, or pick a prompt below!`;

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

  // Markdown links [text](url) - Only allow safe http(s) & mailto
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
// 4. LOCAL INTELLIGENT FALLBACK ENGINE
// -----------------------------------------------------------------------------
// Used when WORKER_URL is placeholder or offline so portfolio visitors can test immediately
async function getLocalKnowledge() {
  if (localKnowledgeCache) return localKnowledgeCache;
  try {
    const res = await fetch('data/knowledge.md');
    if (res.ok) {
      localKnowledgeCache = await res.text();
    }
  } catch (e) {
    console.warn('[Chatbot] Local knowledge.md fetch fallback:', e);
  }
  return localKnowledgeCache || '';
}

function generateLocalMockResponse(userQuery, kb) {
  const q = userQuery.toLowerCase();

  if (q.includes('pitch') || q.includes('30-second') || q.includes('intro') || q.includes('who is')) {
    return `Himanshu Kumar is a final-year **B.Tech (CSE-IT)** student at IIMT College of Engineering (AKTU) targeting **Data Analyst internships** and entry-level roles.

He has proven hands-on experience in **Python, SQL, Exploratory Data Analysis (EDA), and Data Cleaning**, having analyzed **8,787 Netflix catalog titles**. Additionally, he has built interactive software with Three.js and holds 5 industry certifications in Data Analytics, Python, and AI/ML.

Would you like to know more about his **Netflix analysis project** or his **technical skills**?`;
  }

  if (q.includes('skill') || q.includes('technolog') || q.includes('stack') || q.includes('tools')) {
    return `Here is a summary of Himanshu's verified technical skills:

- **Data Analytics & BI**: Python, Pandas, NumPy, Data Cleaning, EDA, Matplotlib, Power BI, Microsoft Excel.
- **Databases & Querying**: SQL (Aggregations, JOINs, Group By, Filtering), MySQL, MongoDB.
- **Programming**: Python, SQL, C++, Java, JavaScript (ES6+).
- **Web & Tools**: HTML5, CSS3, Tailwind CSS, Bootstrap, Three.js, Git, GitHub Actions, Jupyter Notebook.

Would you like to see how he applies these tools in his **Netflix project**?`;
  }

  if (q.includes('netflix') || q.includes('sales') || q.includes('content analysis')) {
    return `Himanshu executed the **Netflix Content Analysis Project** during his internship at **Auspify Technologies**:

- **Catalog Scale**: Thorough exploratory analysis on **8,787 clean movie and TV show titles**.
- **Important Note**: This project analyzes **content catalog distribution and trends**, *not* revenue or sales data (despite the repository naming).
- **Core Insights**: Quantified the international content expansion across North America, Europe, and Asia, release volume spikes over the past decade, and audience rating distributions (TV-MA, TV-14).
- **Stack**: Python, Pandas, NumPy, Matplotlib, Jupyter Notebook, ReportLab.
- **Repository**: [github.com/himanshu161098/Netfix-Sales](https://github.com/himanshu161098/Netfix-Sales).

Shall I share his **GitHub profile** or evaluate his fit for an opening you have?`;
  }

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

  if (q.includes('contact') || q.includes('email') || q.includes('reach') || q.includes('linkedin')) {
    return `You can connect with Himanshu directly through:

- **LinkedIn**: [linkedin.com/in/himanshu-kumar-1618hks/](https://www.linkedin.com/in/himanshu-kumar-1618hks/)
- **GitHub**: [github.com/himanshu161098](https://github.com/himanshu161098)
- **Portfolio**: [himanshu161098.github.io/personal-portfolio/](https://himanshu161098.github.io/personal-portfolio/)
- **Email**: \`himanshukumarsingh161098@gmail.com\`

*(Note: Phone numbers are not shared publicly for privacy).* Would you like to review his resume or project portfolio?`;
  }

  if (q.includes('education') || q.includes('college') || q.includes('degree') || q.includes('aktu')) {
    return `Himanshu's academic background:

- **B.Tech in Computer Science & Engineering (Information Technology)** at **IIMT College of Engineering, Greater Noida (AKTU)**, ongoing (Final Year, 2026).
- **Senior Secondary (Class XII)**: Bihar School Examination Board (BSEB), 2023 (67.8%).
- **Secondary (Class X)**: Bihar School Examination Board (BSEB), 2021 (68.2%).

Would you like to explore his technical certifications?`;
  }

  if (q.includes('uno') || q.includes('game')) {
    return `Himanshu built an interactive **1v1 UNO Playing Card Game** browser web app:

- **Stack**: HTML5, CSS3, JavaScript (ES6+), Bootstrap/Tailwind CSS.
- **Features**: Complete turn-based game loop against an AI bot, card draw/discard rules, wild cards, and mobile-friendly responsive layout.
- **Repository**: [github.com/himanshu161098/UNO-playing-Card-](https://github.com/himanshu161098/UNO-playing-Card-).

Would you like to know about his other projects?`;
  }

  // General response
  return `Himanshu is a final-year B.Tech CSE-IT student specializing in **Data Analysis, Python, SQL, and EDA**. 

You can ask me about:
- His **Netflix catalog data analysis project**
- His **technical skills & certifications**
- An **honest fit evaluation against your job description**
- How to **contact Himanshu on LinkedIn or Email**

What would you like to explore next?`;
}

// -----------------------------------------------------------------------------
// 5. CHATBOT WIDGET DOM INJECTION & UI
// -----------------------------------------------------------------------------
class AIChatbotWidget {
  constructor() {
    this.isOpen = false;
    this.hasUnreadPrompt = false;
    this.dom = {};
    this.init();
  }

  init() {
    this.createWidgetDOM();
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
        <span>Ask Himanshu's AI about projects & skills!</span>
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
    windowOverlay.setAttribute('aria-label', 'Himanshu Kumar AI Portfolio Assistant');
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
              <span class="cb-title-tag">Claude Sonnet</span>
            </div>
            <span class="cb-subtitle">Portfolio Assistant • Live</span>
          </div>
        </div>
        <div class="cb-header-actions">
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
        <form class="cb-input-form" id="cbInputForm" autocomplete="off">
          <textarea
            id="cbInputTextarea"
            class="cb-textarea"
            rows="1"
            placeholder="Ask anything or paste a job description..."
            maxlength="${MAX_INPUT_LENGTH}"
            aria-label="Your question for Himanshu's AI"
          ></textarea>
          <button type="submit" class="cb-send-btn" id="cbSendBtn" aria-label="Send message" disabled>
            <i class="fa-solid fa-arrow-up" aria-hidden="true"></i>
          </button>
        </form>
        <div class="cb-footer-meta">
          <span>Trained on portfolio & live GitHub telemetry</span>
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
      messagesContainer: document.getElementById('cbMessagesContainer'),
      inputForm: document.getElementById('cbInputForm'),
      textarea: document.getElementById('cbInputTextarea'),
      sendBtn: document.getElementById('cbSendBtn'),
      charCounter: document.getElementById('cbCharCounter')
    };
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

    // Default welcome state
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
      <span class="cb-suggestions-label">Suggested Questions:</span>
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

    // Suggested chip clicks
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
      <div class="cb-typing-indicator" aria-label="Himanshu's AI is typing">
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

    // Check if worker endpoint is configured or if we should use local smart mock mode
    const isWorkerConfigured = WORKER_URL && !WORKER_URL.includes('your-subdomain') && !WORKER_URL.includes('example.com');

    if (!isWorkerConfigured) {
      // Local intelligent streaming engine based on actual knowledge.md
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

      // Read SSE stream
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
          } catch (e) {
            // Ignore parse errors on individual SSE chunks
          }
        }
      }

      // Add actions to final bubble
      chatHistory.push({ role: 'assistant', content: fullAssistantText });
      this.saveSessionHistory();

      // Update copy button data
      const copyBtn = row.querySelector('.cb-copy-btn');
      if (copyBtn) {
        copyBtn.setAttribute('data-text', fullAssistantText);
      }

    } catch (err) {
      if (err.name === 'AbortError') return;

      console.warn('[Chatbot Worker Error - Falling back to local knowledge]', err);
      // Fallback to local intelligence if proxy has an issue
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
      reply = `*(Local Offline Knowledge Mode)*\n\n${reply}`;
    }

    this.removeTypingIndicator();
    const turnId = `turn-${Date.now()}`;
    const { row, bubble } = this.appendMessageBubble('assistant', '', true, turnId);

    // Stream word-by-word with realistic token rhythm
    const words = reply.split(' ');
    let currentText = '';

    for (let i = 0; i < words.length; i++) {
      if (!isStreaming) break;
      currentText += (i === 0 ? '' : ' ') + words[i];
      bubble.innerHTML = renderSafeMarkdown(currentText);
      this.scrollToBottom();
      await new Promise(r => setTimeout(r, 22));
    }

    chatHistory.push({ role: 'assistant', content: currentText });
    this.saveSessionHistory();

    const copyBtn = row.querySelector('.cb-copy-btn');
    if (copyBtn) {
      copyBtn.setAttribute('data-text', currentText);
    }

    isStreaming = false;
    this.dom.sendBtn.disabled = this.dom.textarea.value.trim().length === 0;
  }
}

// -----------------------------------------------------------------------------
// 6. LAZY INITIALIZATION (Non-blocking performance)
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
