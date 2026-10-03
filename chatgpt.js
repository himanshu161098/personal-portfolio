/**
 * ==============================================================================
 * Prachi AI Logic (chatgpt.js)
 * Personal AI & Universal Problem-Solving Tutor by Himanshu Kumar
 * Features:
 * - Multi-conversation storage & history management (localStorage)
 * - Model Switcher (Prachi 4o • Pro, Claude Sonnet, STEM Solver, Portfolio Dossier)
 * - Sweet Female Voice ("Prachi") Speech-to-Text & Text-to-Speech
 * - Full Markdown, Code blocks with copy button, and Table rendering
 * - Export chat as Markdown, Fullscreen toggle, and Subject Presets
 * ==============================================================================
 */

// -----------------------------------------------------------------------------
// 1. CONSTANTS & STORAGE KEYS
// -----------------------------------------------------------------------------
const STORAGE_KEY_CONVERSATIONS = 'hk_chatgpt_conversations_v1';
const STORAGE_KEY_ACTIVE_CONV = 'hk_chatgpt_active_id_v1';
const STORAGE_KEY_MODEL = 'hk_chatgpt_model_v1';
const STORAGE_KEY_VOICE = 'hk_chatgpt_voice_mode_v1';
const WORKER_URL = "https://portfolio-chatbot-proxy.your-subdomain.workers.dev/api/chat";

// -----------------------------------------------------------------------------
// 2. STATE MANAGEMENT
// -----------------------------------------------------------------------------
let conversations = [];
let activeConversationId = null;
let currentModel = 'prachi-gemini';
let isVoiceModeEnabled = false;
let isStreaming = false;
let abortController = null;
let recognition = null;
let isListening = false;
let currentSpeakingBtn = null;

// -----------------------------------------------------------------------------
// 3. UTILITY FUNCTIONS (Markdown, Escaping & Formatting)
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
  let html = markdown;

  // 1. Code blocks with copy button
  html = html.replace(/```([a-zA-Z0-9_\-\+]*)\n([\s\S]*?)```/g, (match, lang, code) => {
    const language = lang.trim() || 'code';
    const escapedCode = escapeHtml(code.trim());
    return `
      <div class="gpt-code-block">
        <div class="gpt-code-header">
          <span>${escapeHtml(language)}</span>
          <button type="button" class="gpt-copy-code-btn" data-code="${escapeHtml(code.trim())}">
            <i class="fa-regular fa-copy"></i>
            <span>Copy code</span>
          </button>
        </div>
        <pre><code class="language-${escapeHtml(language)}">${escapedCode}</code></pre>
      </div>
    `;
  });

  // 2. Inline code
  html = html.replace(/`([^`]+)`/g, (match, code) => `<code>${escapeHtml(code)}</code>`);

  // 3. Markdown Tables
  html = html.replace(/(?:(?:\|.+)+\|\n?)+/g, (tableMatch) => {
    const rows = tableMatch.trim().split('\n').filter(r => r.trim().startsWith('|'));
    if (rows.length < 2) return tableMatch;

    let tableHtml = '<div class="gpt-table-wrap"><table class="gpt-table">';
    rows.forEach((row, idx) => {
      if (row.includes('---')) return; // separator
      const cols = row.split('|').filter((_, i, arr) => i > 0 && i < arr.length - 1).map(c => c.trim());
      if (idx === 0) {
        tableHtml += '<thead><tr>' + cols.map(c => `<th>${c}</th>`).join('') + '</tr></thead><tbody>';
      } else {
        tableHtml += '<tr>' + cols.map(c => `<td>${c}</td>`).join('') + '</tr>';
      }
    });
    tableHtml += '</tbody></table></div>';
    return tableHtml;
  });

  // 4. Headings
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // 5. Bold & Italics
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // 6. Links
  html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1 <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:0.7em;"></i></a>');

  // 7. Unordered lists
  html = html.replace(/^\s*[-*]\s+(.*)$/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/gims, (match) => {
    if (!match.startsWith('<ul>')) return `<ul>${match}</ul>`;
    return match;
  });

  // 8. Paragraphs & Linebreaks
  const paragraphs = html.split(/\n{2,}/);
  html = paragraphs.map(p => {
    const trimmed = p.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('<h') || trimmed.startsWith('<div') || trimmed.startsWith('<ul') || trimmed.startsWith('<table')) {
      return trimmed;
    }
    return `<p>${trimmed.replace(/\n/g, '<br>')}</p>`;
  }).join('');

  return html;
}

// -----------------------------------------------------------------------------
// 4. SPEECH SYNTHESIS & RECOGNITION (Maya Female Voice Engine)
// -----------------------------------------------------------------------------
function cleanTextForSpeech(markdown) {
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

function speakMayaVoice(text, btnElement = null) {
  if (!('speechSynthesis' in window)) return;

  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    if (currentSpeakingBtn) {
      currentSpeakingBtn.classList.remove('speaking');
      const span = currentSpeakingBtn.querySelector('span');
      if (span) span.textContent = 'Listen';
      currentSpeakingBtn = null;
    }
    if (btnElement && btnElement === currentSpeakingBtn) return;
  }

  const clean = cleanTextForSpeech(text);
  if (!clean) return;

  const utterance = new SpeechSynthesisUtterance(clean);
  // Maya's pleasant, warm feminine pitch & articulate cadence
  utterance.pitch = 1.18;
  utterance.rate = 0.98;

  const isHindi = /[\u0900-\u097F]/.test(text) || /\b(hai|hote|karein|batao|kya|aur|ka|ki|ke|se|unhone|usne|samvidhan|ganit|rasayan)\b/i.test(text);
  const voices = window.speechSynthesis.getVoices();
  const femaleNameRegex = /swara|heera|kalpana|lekha|neerja|priya|anjali|veena|zira|jenny|aria|samantha|victoria|karen|moira|tessa|fiona|eva|kendra|susan|cathy|allison|ava|stephanie|sarah|female|woman|girl/i;

  if (isHindi) {
    const hiFemale = voices.find(v => v.lang.toLowerCase().includes('hi') && femaleNameRegex.test(v.name));
    const anyHindi = hiFemale || voices.find(v => v.lang.toLowerCase().includes('hi') || /hindi/i.test(v.name));
    const fallbackEnInFemale = voices.find(v => v.lang.toLowerCase().includes('en-in') && femaleNameRegex.test(v.name));
    if (hiFemale) utterance.voice = hiFemale;
    else if (anyHindi) utterance.voice = anyHindi;
    else if (fallbackEnInFemale) utterance.voice = fallbackEnInFemale;
    utterance.lang = 'hi-IN';
  } else {
    const enInFemale = voices.find(v => v.lang.toLowerCase().includes('en-in') && femaleNameRegex.test(v.name));
    const globalFemale = voices.find(v => v.lang.toLowerCase().startsWith('en') && femaleNameRegex.test(v.name));
    const anyFemale = enInFemale || globalFemale || voices.find(v => femaleNameRegex.test(v.name));
    if (anyFemale) utterance.voice = anyFemale;
    utterance.lang = 'en-IN';
  }

  if (btnElement) {
    currentSpeakingBtn = btnElement;
    btnElement.classList.add('speaking');
    const span = btnElement.querySelector('span');
    if (span) span.textContent = 'Speaking...';
  }

  utterance.onend = () => {
    if (currentSpeakingBtn) {
      currentSpeakingBtn.classList.remove('speaking');
      const span = currentSpeakingBtn.querySelector('span');
      if (span) span.textContent = 'Listen';
      currentSpeakingBtn = null;
    }
  };

  utterance.onerror = () => {
    if (currentSpeakingBtn) {
      currentSpeakingBtn.classList.remove('speaking');
      const span = currentSpeakingBtn.querySelector('span');
      if (span) span.textContent = 'Listen';
      currentSpeakingBtn = null;
    }
  };

  window.speechSynthesis.speak(utterance);
}

// -----------------------------------------------------------------------------
// 5. LOCAL ADVANCED TUTOR INTELLIGENCE (Academic + Portfolio)
// -----------------------------------------------------------------------------
function generateTutorResponse(userQuery, model) {
  // 1. Try Universal Dynamic Intelligence Engine (Math, Code, GK, Science, Social)
  if (typeof window !== 'undefined' && window.UniversalAIEngine && typeof window.UniversalAIEngine.generateResponse === 'function') {
    return window.UniversalAIEngine.generateResponse(userQuery, { assistantName: 'Prachi' });
  }

  const q = userQuery.toLowerCase().trim();

  // Prachi Identity / Girl Voice
  if (q.includes('prachi') || q.includes('maya') || q.includes('girl') || q.includes('voice') || q.includes('who are you') || q.includes('tum kaun') || q.includes('ladki')) {
    return `Namaste! 👋 Main **Prachi** hoon, Himanshu Kumar ki **Universal AI Tutor & Assistant**, powered by **Google Gemini & Cloud AI**.

🎙️ **Female Voice Persona**:
- Meri voice ek natural, sweet **female (girl) tone** me configured hai (pitch 1.18, rate 0.98).
- Kisi bhi response ke neeche **"Listen"** button dabakar aap meri aawaz sun sakte hain, ya top-right me **Voice Mode** enable karke auto-readout enjoy kar sakte hain!
- Microphone button 🎙️ se aap bolkar bhi sawaal pooch sakte hain.

🌟 **Main aapko kya kya sikha aur solve karke de sakti hoon?**
1. 📐 **Mathematics**: Calculus (derivatives, integrals), Algebra, Quadratic equations, Probability, Percentages.
2. ⚡ **Physics**: Kinematics numericals, Newton's Laws ($F = ma$), Ohm's Law, Projectile motion, Energy.
3. 🧪 **Chemistry**: Photosynthesis reaction, pH calculation, Acids & Bases, Organic mechanisms ($S_N1/S_N2$).
4. 🧬 **Biology**: Mitochondria powerhouse of the cell, Mitosis vs Meiosis, DNA double helix, Human heart blood circulation.
5. 📜 **General Knowledge & GS**: Indian Constitution (Preamble, Fundamental Rights, Articles), History (Harappa, Ashoka, Freedom movement), Geography (Rivers of India), Economy (GDP, Inflation, RBI).
6. 🇮🇳 **Current Affairs**: IndiaAI Mission (10,000+ GPUs), ISRO space missions (Chandrayaan-3, Aditya-L1, Gaganyaan).
7. 📂 **Himanshu's Portfolio**: 8,787 Netflix catalog analysis, skills, certifications, and JD fit analysis.

Aap koi bhi sawal poochiye, main best aur simple solution dungi!`;
  }

  // Mathematics Problem Solver
  if (q.includes('math') || q.includes('calculus') || q.includes('derivative') || q.includes('differentiate') || q.includes('integral') || q.includes('algebra') || q.includes('quadratic') || q.includes('trigonometry') || q.includes('probability') || q.includes('percentage') || q.includes('solve')) {
    if (q.includes('derivative') || q.includes('differentiate') || q.includes('calculus')) {
      return `### 📐 Calculus Problem: Finding the Derivative $\\frac{d}{dx}[x^3 + 5x^2 - 7x + 9]$

Here is the **clearest step-by-step solution**:

1. 📌 **Given Function**:
   $$f(x) = x^3 + 5x^2 - 7x + 9$$

2. 📐 **Governing Formulas / Rules**:
   - **Power Rule**: $\\frac{d}{dx}[x^n] = n \\cdot x^{n-1}$
   - **Constant Multiple Rule**: $\\frac{d}{dx}[c \\cdot f(x)] = c \\cdot f'(x)$
   - **Constant Rule**: $\\frac{d}{dx}[C] = 0$
   - **Sum/Difference Rule**: Differentiate term by term.

3. 🔢 **Step-by-Step Differentiation**:
   - $\\frac{d}{dx}[x^3] = 3x^{3-1} = 3x^2$
   - $\\frac{d}{dx}[5x^2] = 5 \\times (2x^{2-1}) = 10x$
   - $\\frac{d}{dx}[-7x] = -7 \\times (1x^0) = -7$
   - $\\frac{d}{dx}[9] = 0$ (constant)

4. ✅ **Final Answer**:
   $$f'(x) = 3x^2 + 10x - 7$$

5. 💡 **Pro-Tip & Intuitive Meaning**:
   The derivative $f'(x)$ represents the **instantaneous rate of change** (the slope of the tangent line). At $x = 2$, the slope is: $f'(2) = 3(4) + 10(2) - 7 = 12 + 20 - 7 = 25$!`;
    }

    if (q.includes('quadratic') || q.includes('x^2') || q.includes('root')) {
      return `### 📐 Algebra Problem: Solving Quadratic Equation $2x^2 - 7x + 3 = 0$

1. 📌 **Given Equation**:
   $$2x^2 - 7x + 3 = 0$$
   Standard form $ax^2 + bx + c = 0 \\implies a = 2, b = -7, c = 3$.

2. 📐 **Quadratic Formula (Shreedharacharya Formula)**:
   $$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

3. 🔢 **Step-by-Step Calculation**:
   - **Discriminant ($D$)**:
     $$D = (-7)^2 - 4(2)(3) = 49 - 24 = 25$$
   - **Square Root**: $\\sqrt{D} = \\sqrt{25} = 5$
   - **Roots**:
     $$x = \\frac{7 \\pm 5}{2(2)} = \\frac{7 \\pm 5}{4}$$
     - Root 1: $x_1 = \\frac{7 + 5}{4} = \\frac{12}{4} = 3$
     - Root 2: $x_2 = \\frac{7 - 5}{4} = \\frac{2}{4} = 0.5$ (or $\\frac{1}{2}$)

4. ✅ **Final Answer**:
   $$x = 3 \\quad \\text{and} \\quad x = 0.5$$

5. 💡 **Sanity Check**: Sum of roots $3 + 0.5 = 3.5 = -\\frac{b}{a} = \\frac{7}{2} = 3.5$ (Verified! ✅)`;
    }

    return `### 📐 Universal Mathematics Problem Solver

Aap koi bhi Math problem (Calculus, Linear Algebra, Probability, Trigonometry, ya Arithmetic) pooch sakte hain! Main hamesha ye **5-Point Standard** follow karti hoon:

1. 📌 **Given Information**: Identifies provided parameters with units.
2. 📐 **Formulas & Rules**: Relevant theorem ya identity state karna.
3. 🔢 **Step-by-Step Calculation**: Clear derivation without skipping steps.
4. ✅ **Final Answer**: Highlighted boxed result with verification.
5. 💡 **Pro-Tip & Shortcut**: Exam tricks ya visual intuition.

Aap apna specific math question likhiye!`;
  }

  // Physics Numericals & Concepts
  if (q.includes('physic') || q.includes('newton') || q.includes('kinematic') || q.includes('velocity') || q.includes('acceleration') || q.includes('projectile') || q.includes('ohm') || q.includes('optics') || q.includes('energy')) {
    if (q.includes('car') || q.includes('motion') || q.includes('velocity') || q.includes('acceleration') || q.includes('kinematic')) {
      return `### ⚡ Physics Numerical: Kinematics & Equations of Motion

**Problem**: A car starts from rest and accelerates uniformly at $2 \\text{ m/s}^2$ for $5 \\text{ seconds}$. Find its final velocity and distance travelled.

1. 📌 **Given Data (SI Units)**:
   - Initial velocity ($u$) = $0 \\text{ m/s}$ (starts from rest)
   - Acceleration ($a$) = $2 \\text{ m/s}^2$
   - Time ($t$) = $5 \\text{ s}$

2. 📐 **Governing Equations**:
   - $v = u + at$
   - $s = ut + \\frac{1}{2}at^2$

3. 🔢 **Step-by-Step Calculation**:
   - Final Velocity: $v = 0 + (2 \\times 5) = 10 \\text{ m/s}$ ($36 \\text{ km/h}$)
   - Distance Travelled: $s = (0 \\times 5) + \\frac{1}{2} \\times 2 \\times (5)^2 = 0 + 25 = 25 \\text{ meters}$

4. ✅ **Final Answer**:
   - Final Velocity = **$10 \\text{ m/s}$**
   - Distance Travelled = **$25 \\text{ meters}$**

5. 💡 **Physical Intuition**: Average velocity during uniform acceleration is $\\frac{0 + 10}{2} = 5 \\text{ m/s}$. Distance is simply Average Velocity $\\times$ Time = $5 \\times 5 = 25 \\text{ m}$!`;
    }

    if (q.includes('ohm') || q.includes('resistor') || q.includes('circuit')) {
      return `### ⚡ Physics Problem: Ohm's Law & Circuit Analysis

**Problem**: A $12\\text{V}$ battery is connected across two series resistors of $4\\,\\Omega$ and $6\\,\\Omega$. Find the circuit current.

1. 📌 **Given Data**: $V = 12\\text{V}$, $R_1 = 4\\,\\Omega$, $R_2 = 6\\,\\Omega$ (Series).
2. 📐 **Formulas**: $R_{\\text{eq}} = R_1 + R_2$, and Ohm's Law $I = \\frac{V}{R_{\\text{eq}}}$.
3. 🔢 **Calculation**:
   - Total Resistance: $R_{\\text{eq}} = 4 + 6 = 10\\,\\Omega$
   - Current: $I = \\frac{12\\text{ V}}{10\\,\\Omega} = 1.2\\text{ Amperes}$
4. ✅ **Final Answer**: Circuit Current = **$1.2\\text{ A}$**.`;
    }

    return `### ⚡ Physics Problem Solving Hub
Aap Mechanics, Kinematics, Thermodynamics, Optics, ya Electromagnetism ka koi bhi numerical pooch sakte hain!`;
  }

  // Chemistry Reactions & Principles
  if (q.includes('chemist') || q.includes('reaction') || q.includes('photosynthesis') || q.includes('acid') || q.includes('base') || q.includes('ph ') || q.includes('mole')) {
    if (q.includes('photosynthesis')) {
      return `### 🧪 Chemistry in Biology: Photosynthesis Chemical Equation

1. 📌 **Balanced Chemical Equation**:
   $$6\\text{CO}_2 + 6\\text{H}_2\\text{O} \\xrightarrow[\\text{Chlorophyll}]{\\text{Sunlight}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2$$

2. 📐 **Reactants & Products**:
   - **Reactants**: 6 Carbon Dioxide molecules + 6 Water molecules.
   - **Energy Source**: Photons absorbed by Chlorophyll in chloroplasts.
   - **Products**: 1 Glucose molecule (stored chemical energy) + 6 Oxygen gas molecules (released).

3. 💡 **Key Exam Point**: Photosynthesis is an **endothermic oxidation-reduction reaction** where water is oxidized to oxygen and $CO_2$ is reduced to glucose!`;
    }

    if (q.includes('ph ')) {
      return `### 🧪 Chemistry Problem: pH Calculation of an Acidic Solution
**Problem**: Find pH of $0.001\\text{ M } HCl$.
- $HCl$ is a strong monoprotic acid: $[H^+] = 10^{-3}\\text{ M}$.
- Formula: $\\text{pH} = -\\log_{10}[H^+] = -\\log_{10}(10^{-3}) = 3$.
- ✅ **Final Answer**: $\\text{pH} = 3$ (Acidic).`;
    }

    return `### 🧪 Chemistry Problem Solving Hub
Main Physical, Organic ($S_N1/S_N2$, IUPAC), aur Inorganic Chemistry ke complete solutions deti hoon!`;
  }

  // Biology Concepts
  if (q.includes('biolog') || q.includes('cell') || q.includes('mitochondria') || q.includes('mitosis') || q.includes('meiosis') || q.includes('dna') || q.includes('heart')) {
    if (q.includes('mitochondria') || q.includes('powerhouse')) {
      return `### 🧬 Biology Concept: Mitochondria — The Powerhouse of the Cell

1. 📌 **Definition**: Double-membraned cellular organelles in eukaryotic cells producing **ATP** (Adenosine Triphosphate).
2. 🔬 **Key Features**: Outer membrane, folded inner membrane (**Cristae**) for surface area, and fluid **Matrix**.
3. ⚙️ **Mechanism**: Cellular respiration yields up to **36 to 38 ATP molecules** per glucose molecule.
4. 💡 **Fascinating Fact**: Mitochondria contain their own circular DNA (mtDNA) and 70S ribosomes!`;
    }

    return `### 🧬 Biology Concept & Mechanism Hub
Cell biology, Molecular genetics, Human physiology, aur Ecology ke simple solutions poochiye!`;
  }

  // General Knowledge & GS
  if (q.includes('constitution') || q.includes('samvidhan') || q.includes('fundamental right') || q.includes('article') || q.includes('gk') || q.includes('history') || q.includes('geography') || q.includes('economy')) {
    return `### 📜 GK & Indian Polity: Indian Constitution & Fundamental Rights

The **Constitution of India** was drafted under **Dr. B.R. Ambedkar** (Drafting Committee Chairman), adopted on **26 November 1949**, and enacted on **26 January 1950**.

#### 🏛️ Fundamental Rights (Part III, Articles 12-35):
1. **Right to Equality (Articles 14-18)**: Equality before law (Art 14), abolition of untouchability (Art 17).
2. **Right to Freedom (Articles 19-22)**: Six freedoms (Art 19), **Right to Life (Article 21)**.
3. **Right against Exploitation (Articles 23-24)**: Prohibits human trafficking & child labor.
4. **Freedom of Religion (Articles 25-28)**: Freedom of conscience and practice.
5. **Cultural & Educational Rights (Articles 29-30)**: Minority protections.
6. **Constitutional Remedies (Article 32)**: Writs (Habeas Corpus, Mandamus, etc.) — **"Heart and Soul of the Constitution"**.

💡 **Pro-Tip**: 42nd Amendment Act (1976) is known as the **"Mini Constitution"**!`;
  }

  // Himanshu Portfolio
  if (q.includes('himanshu') || q.includes('portfolio') || q.includes('netflix') || q.includes('skills') || q.includes('contact') || q.includes('education')) {
    return `### 📂 Himanshu Kumar — Developer & Data Analyst Dossier

- **Profile**: Final-year **B.Tech (CSE-IT)** student at IIMT College of Engineering (AKTU), targeting Data Analyst internships and entry-level positions.
- **Top Project (Netflix Analysis)**: Exploratory Data Analysis on **8,787 clean movie & TV show titles** with Python, Pandas, NumPy, and Matplotlib.
- **Key Skills**: Python, SQL (MySQL, JOINs, Group By), Pandas, Matplotlib, Power BI, Excel, JavaScript, HTML5/CSS3, Git & GitHub Actions.
- **Certifications**: 5 completed industry certifications in Data Analytics, Python, and AI/ML fundamentals.
- **Connect**: [LinkedIn Profile](https://www.linkedin.com/in/himanshu-kumar-1618hks/) • [GitHub Repositories](https://github.com/himanshu161098) • Email: \`himanshukumarsingh161098@gmail.com\`.`;
  }

  // Default Response
  return `I am **Prachi**, your AI Assistant & Universal Tutor powered by **Google Gemini & Cloud AI**.

You can ask me to:
- 📐 **Solve Math Problems** (Calculus, Linear Algebra, Probability, Equations)
- ⚡ **Solve Physics Numericals** (Kinematics, Newton's Laws, Electricity)
- 🧪 **Explain Chemistry Reactions** (Equations, pH, Organic mechanisms)
- 🧬 **Understand Biology** (Cell structure, DNA, Genetics, Physiology)
- 📜 **Learn GK & Current Affairs** (Constitution, History, ISRO, IndiaAI)
- 💻 **Write & Debug Code** in Python, SQL, JavaScript, C++, or Java!

What would you like to explore next?`;
}

// -----------------------------------------------------------------------------
// 6. CHATGPT CLONE APP CONTROLLER CLASS
// -----------------------------------------------------------------------------
class ChatGPTCloneApp {
  constructor() {
    this.dom = {};
    this.init();
  }

  init() {
    this.cacheDom();
    this.loadState();
    this.initSpeech();
    this.bindEvents();
    this.renderSidebarHistory();
    this.renderCurrentConversation();
  }

  cacheDom() {
    this.dom = {
      app: document.getElementById('gptApp'),
      sidebar: document.getElementById('gptSidebar'),
      sidebarToggle: document.getElementById('gptSidebarToggle'),
      sidebarCloseMobile: document.getElementById('gptSidebarCloseMobile'),
      sidebarOverlay: document.getElementById('gptSidebarOverlay'),
      newChatBtn: document.getElementById('gptNewChatBtn'),
      searchInput: document.getElementById('gptSearchInput'),
      historyList: document.getElementById('gptHistoryList'),
      clearAllBtn: document.getElementById('gptClearAllBtn'),
      // Model dropdown
      modelSelector: document.getElementById('gptModelSelector'),
      modelBtn: document.getElementById('gptModelBtn'),
      modelMenu: document.getElementById('gptModelMenu'),
      currentModelName: document.getElementById('gptCurrentModelName'),
      // Topbar buttons
      voiceToggleBtn: document.getElementById('gptVoiceToggleBtn'),
      voiceIcon: document.getElementById('gptVoiceIcon'),
      exportBtn: document.getElementById('gptExportBtn'),
      fullscreenBtn: document.getElementById('gptFullscreenBtn'),
      fullscreenIcon: document.getElementById('gptFullscreenIcon'),
      // Chat area
      chatContainer: document.getElementById('gptChatContainer'),
      welcomeScreen: document.getElementById('gptWelcomeScreen'),
      messagesList: document.getElementById('gptMessagesList'),
      voiceIndicator: document.getElementById('gptVoiceIndicator'),
      // Input form
      inputForm: document.getElementById('gptInputForm'),
      textarea: document.getElementById('gptTextarea'),
      micBtn: document.getElementById('gptMicBtn'),
      micIcon: document.getElementById('gptMicIcon'),
      sendBtn: document.getElementById('gptSendBtn'),
      // Presets
      presetDropdown: document.getElementById('gptPresetDropdown'),
      presetBtn: document.getElementById('gptPresetBtn'),
      presetMenu: document.getElementById('gptPresetMenu')
    };
  }

  loadState() {
    // 1. Conversations
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CONVERSATIONS);
      conversations = stored ? JSON.parse(stored) : [];
    } catch (e) {
      conversations = [];
    }

    // 2. Active conversation ID
    try {
      activeConversationId = localStorage.getItem(STORAGE_KEY_ACTIVE_CONV);
    } catch (e) {
      activeConversationId = null;
    }

    // If active conversation doesn't exist, create a new one
    if (!activeConversationId || !conversations.some(c => c.id === activeConversationId)) {
      this.createNewConversation(false);
    }

    // 3. Saved Model
    try {
      currentModel = localStorage.getItem(STORAGE_KEY_MODEL) || 'prachi-gemini';
      if (currentModel === 'maya-gemini') currentModel = 'prachi-gemini';
    } catch (e) {
      currentModel = 'prachi-gemini';
    }
    this.updateModelUI();

    // 4. Voice Mode
    try {
      isVoiceModeEnabled = localStorage.getItem(STORAGE_KEY_VOICE) === 'true';
    } catch (e) {
      isVoiceModeEnabled = false;
    }
    this.updateVoiceToggleUI();
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY_CONVERSATIONS, JSON.stringify(conversations));
      if (activeConversationId) {
        localStorage.setItem(STORAGE_KEY_ACTIVE_CONV, activeConversationId);
      }
    } catch (e) {
      console.warn('[Storage Error]', e);
    }
  }

  initSpeech() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Indian English / Hindi

      recognition.onstart = () => {
        isListening = true;
        this.dom.micBtn.classList.add('listening');
        this.dom.voiceIndicator.classList.add('active');
      };

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          this.dom.textarea.value = transcript;
          this.handleTextareaInput();
        }
      };

      recognition.onerror = () => {
        this.stopListening();
      };

      recognition.onend = () => {
        this.stopListening();
      };
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }

  toggleListening() {
    if (!recognition) {
      alert('Voice speech-to-text is supported in Google Chrome, Microsoft Edge, and Safari.');
      return;
    }
    if (isListening) {
      this.stopListening();
    } else {
      try {
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        recognition.start();
      } catch (e) {
        this.stopListening();
      }
    }
  }

  stopListening() {
    isListening = false;
    this.dom.micBtn.classList.remove('listening');
    this.dom.voiceIndicator.classList.remove('active');
    if (recognition) {
      try { recognition.stop(); } catch (e) {}
    }
  }

  toggleVoiceMode() {
    isVoiceModeEnabled = !isVoiceModeEnabled;
    try {
      localStorage.setItem(STORAGE_KEY_VOICE, String(isVoiceModeEnabled));
    } catch (e) {}
    this.updateVoiceToggleUI();

    if (!isVoiceModeEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  updateVoiceToggleUI() {
    if (isVoiceModeEnabled) {
      this.dom.voiceToggleBtn.classList.add('active');
      this.dom.voiceIcon.className = 'fa-solid fa-volume-high';
      this.dom.voiceToggleBtn.title = 'Voice Mode: ON (Prachi reads replies aloud in her female voice)';
    } else {
      this.dom.voiceToggleBtn.classList.remove('active');
      this.dom.voiceIcon.className = 'fa-solid fa-volume-xmark';
      this.dom.voiceToggleBtn.title = 'Voice Mode: OFF (Click to enable Voice Readout)';
    }
  }

  updateModelUI() {
    const modelItems = this.dom.modelMenu.querySelectorAll('.gpt-model-item');
    modelItems.forEach(item => {
      if (item.dataset.model === currentModel) {
        item.classList.add('active');
        const title = item.querySelector('.gpt-model-item-title span');
        if (title) this.dom.currentModelName.textContent = title.textContent;
      } else {
        item.classList.remove('active');
      }
    });
  }

  createNewConversation(render = true) {
    const newId = 'conv-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
    const newConv = {
      id: newId,
      title: 'New Chat',
      createdAt: new Date().toISOString(),
      messages: []
    };

    conversations.unshift(newConv);
    activeConversationId = newId;
    this.saveState();

    if (render) {
      this.renderSidebarHistory();
      this.renderCurrentConversation();
      this.dom.textarea.focus();
    }
    return newConv;
  }

  getActiveConversation() {
    return conversations.find(c => c.id === activeConversationId);
  }

  deleteConversation(id, event) {
    if (event) event.stopPropagation();
    conversations = conversations.filter(c => c.id !== id);
    if (activeConversationId === id) {
      activeConversationId = conversations.length > 0 ? conversations[0].id : null;
      if (!activeConversationId) {
        this.createNewConversation(false);
      }
    }
    this.saveState();
    this.renderSidebarHistory();
    this.renderCurrentConversation();
  }

  clearAllConversations() {
    if (confirm('Are you sure you want to clear all conversations?')) {
      conversations = [];
      this.createNewConversation(true);
    }
  }

  renderSidebarHistory(filterQuery = '') {
    const list = this.dom.historyList;
    list.innerHTML = '';

    const filtered = filterQuery
      ? conversations.filter(c => c.title.toLowerCase().includes(filterQuery.toLowerCase()))
      : conversations;

    if (filtered.length === 0) {
      list.innerHTML = `<div class="gpt-history-empty">No conversations found</div>`;
      return;
    }

    filtered.forEach(conv => {
      const item = document.createElement('div');
      item.className = `gpt-history-item ${conv.id === activeConversationId ? 'active' : ''}`;
      item.dataset.id = conv.id;
      item.innerHTML = `
        <span class="gpt-item-title">${escapeHtml(conv.title)}</span>
        <div class="gpt-item-actions">
          <button class="gpt-item-btn delete-btn" title="Delete conversation" data-id="${conv.id}">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
      `;
      list.appendChild(item);
    });
  }

  renderCurrentConversation() {
    const conv = this.getActiveConversation();
    if (!conv || conv.messages.length === 0) {
      this.dom.welcomeScreen.style.display = 'flex';
      this.dom.messagesList.innerHTML = '';
      return;
    }

    this.dom.welcomeScreen.style.display = 'none';
    this.dom.messagesList.innerHTML = '';

    conv.messages.forEach((msg, idx) => {
      this.appendMessageRow(msg.role, msg.content, false, `msg-${idx}`);
    });

    this.scrollToBottom();
  }

  appendMessageRow(role, content, isStreamingMessage = false, messageId = null) {
    const row = document.createElement('div');
    row.className = `gpt-msg-row ${role}`;
    if (messageId) row.id = messageId;

    if (role === 'user') {
      row.innerHTML = `
        <div class="gpt-msg-avatar">
          <span>You</span>
        </div>
        <div class="gpt-msg-content-wrap">
          <div class="gpt-msg-bubble">
            ${escapeHtml(content).replace(/\n/g, '<br>')}
          </div>
        </div>
      `;
    } else {
      row.innerHTML = `
        <div class="gpt-msg-avatar" title="Prachi • AI Assistant">
          <img src="assets/prachi-logo.png" alt="Prachi AI" class="gpt-msg-avatar-img">
        </div>
        <div class="gpt-msg-content-wrap">
          <div class="gpt-msg-bubble gpt-assistant-bubble">
            ${renderSafeMarkdown(content)}
            ${isStreamingMessage ? '<span class="gpt-typing-cursor"></span>' : ''}
          </div>
          <div class="gpt-msg-toolbar">
            <button class="gpt-action-pill copy-btn" title="Copy answer">
              <i class="fa-regular fa-copy"></i>
              <span>Copy</span>
            </button>
            <button class="gpt-action-pill speak-btn" title="Listen in Prachi's sweet female voice">
              <i class="fa-solid fa-volume-high"></i>
              <span>Listen</span>
            </button>
            <button class="gpt-action-pill thumbs-up-btn" title="Helpful response">
              <i class="fa-regular fa-thumbs-up"></i>
            </button>
            <button class="gpt-action-pill thumbs-down-btn" title="Needs improvement">
              <i class="fa-regular fa-thumbs-down"></i>
            </button>
          </div>
        </div>
      `;
    }

    this.dom.messagesList.appendChild(row);
    this.scrollToBottom();
    return row;
  }

  scrollToBottom() {
    this.dom.chatContainer.scrollTop = this.dom.chatContainer.scrollHeight;
  }

  handleTextareaInput() {
    const ta = this.dom.textarea;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 180) + 'px';
    const hasText = ta.value.trim().length > 0;
    this.dom.sendBtn.disabled = !hasText || isStreaming;
  }

  async sendMessage(customQuery = null) {
    const query = customQuery !== null ? customQuery.trim() : this.dom.textarea.value.trim();
    if (!query || isStreaming) return;

    // Reset textarea
    this.dom.textarea.value = '';
    this.dom.textarea.style.height = 'auto';
    this.dom.sendBtn.disabled = true;
    this.stopListening();

    // Hide welcome screen
    this.dom.welcomeScreen.style.display = 'none';

    // Get current conversation
    let conv = this.getActiveConversation();
    if (!conv) conv = this.createNewConversation(false);

    // If first message in conversation, update title
    if (conv.messages.length === 0) {
      conv.title = query.length > 28 ? query.substring(0, 28) + '...' : query;
      this.renderSidebarHistory();
    }

    // Append user message
    conv.messages.push({ role: 'user', content: query });
    this.saveState();
    this.appendMessageRow('user', query);

    // Prepare assistant streaming placeholder
    isStreaming = true;
    const msgId = 'stream-' + Date.now();
    const assistantRow = this.appendMessageRow('assistant', '', true, msgId);
    const bubble = assistantRow.querySelector('.gpt-assistant-bubble');

    // Generate response (from Cloudflare Worker proxy or smart local tutor)
    let fullReply = '';

    try {
      // 1. Try streaming from Cloudflare Worker if online
      abortController = new AbortController();
      const res = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conv.messages.slice(-8),
          model: currentModel
        }),
        signal: abortController.signal
      });

      if (res.ok && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
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
              const parsed = JSON.parse(dataStr);
              if (parsed.text) {
                fullReply += parsed.text;
                bubble.innerHTML = renderSafeMarkdown(fullReply) + '<span class="gpt-typing-cursor"></span>';
                this.scrollToBottom();
              }
            } catch (e) {}
          }
        }
      } else {
        throw new Error('Fallback to local intelligence');
      }
    } catch (err) {
      // 2. Local Fallback with typewriter streaming simulation
      fullReply = generateTutorResponse(query, currentModel);
      bubble.innerHTML = '';

      let displayedLength = 0;
      const step = Math.max(2, Math.floor(fullReply.length / 45));
      while (displayedLength < fullReply.length) {
        displayedLength = Math.min(displayedLength + step, fullReply.length);
        const chunk = fullReply.slice(0, displayedLength);
        bubble.innerHTML = renderSafeMarkdown(chunk) + '<span class="gpt-typing-cursor"></span>';
        this.scrollToBottom();
        await new Promise(r => setTimeout(r, 16));
      }
    } finally {
      // Finish streaming
      isStreaming = false;
      const cursor = bubble.querySelector('.gpt-typing-cursor');
      if (cursor) cursor.remove();
      bubble.innerHTML = renderSafeMarkdown(fullReply);

      // Save assistant message to conversation
      conv.messages.push({ role: 'assistant', content: fullReply });
      this.saveState();
      this.scrollToBottom();

      // If voice mode is on, auto-read Prachi's reply aloud
      if (isVoiceModeEnabled) {
        const speakBtn = assistantRow.querySelector('.speak-btn');
        speakMayaVoice(fullReply, speakBtn);
      }
    }
  }

  exportConversation() {
    const conv = this.getActiveConversation();
    if (!conv || conv.messages.length === 0) {
      alert('Current conversation is empty.');
      return;
    }

    let markdown = `# ${conv.title}\n\n*Created on: ${new Date(conv.createdAt).toLocaleString()}*\n\n---\n\n`;
    conv.messages.forEach(msg => {
      const sender = msg.role === 'user' ? '### 👤 User' : '### 🤖 Prachi (AI Assistant)';
      markdown += `${sender}\n\n${msg.content}\n\n---\n\n`;
    });

    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${conv.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  bindEvents() {
    // 1. Sidebar open/close
    this.dom.sidebarToggle.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        this.dom.sidebar.classList.toggle('open');
        this.dom.sidebarOverlay.classList.toggle('active');
      } else {
        this.dom.sidebar.classList.toggle('collapsed');
      }
    });

    this.dom.sidebarCloseMobile.addEventListener('click', () => {
      this.dom.sidebar.classList.remove('open');
      this.dom.sidebarOverlay.classList.remove('active');
    });

    this.dom.sidebarOverlay.addEventListener('click', () => {
      this.dom.sidebar.classList.remove('open');
      this.dom.sidebarOverlay.classList.remove('active');
    });

    // 2. New Chat
    this.dom.newChatBtn.addEventListener('click', () => {
      this.createNewConversation(true);
      if (window.innerWidth <= 768) {
        this.dom.sidebar.classList.remove('open');
        this.dom.sidebarOverlay.classList.remove('active');
      }
    });

    // Ctrl+K Shortcut
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.createNewConversation(true);
      }
    });

    // 3. Search Conversations
    this.dom.searchInput.addEventListener('input', (e) => {
      this.renderSidebarHistory(e.target.value.trim());
    });

    // 4. Conversation History Click & Delete Delegation
    this.dom.historyList.addEventListener('click', (e) => {
      const deleteBtn = e.target.closest('.delete-btn');
      if (deleteBtn) {
        this.deleteConversation(deleteBtn.dataset.id, e);
        return;
      }

      const item = e.target.closest('.gpt-history-item');
      if (item && item.dataset.id) {
        activeConversationId = item.dataset.id;
        this.saveState();
        this.renderSidebarHistory();
        this.renderCurrentConversation();
        if (window.innerWidth <= 768) {
          this.dom.sidebar.classList.remove('open');
          this.dom.sidebarOverlay.classList.remove('active');
        }
      }
    });

    // 5. Clear All Chats
    this.dom.clearAllBtn.addEventListener('click', () => this.clearAllConversations());

    // 6. Model Switcher Dropdown
    this.dom.modelBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.dom.modelSelector.classList.toggle('open');
    });

    this.dom.modelMenu.addEventListener('click', (e) => {
      const item = e.target.closest('.gpt-model-item');
      if (item && item.dataset.model) {
        currentModel = item.dataset.model;
        try { localStorage.setItem(STORAGE_KEY_MODEL, currentModel); } catch (e) {}
        this.updateModelUI();
        this.dom.modelSelector.classList.remove('open');
      }
    });

    document.addEventListener('click', (e) => {
      if (!this.dom.modelSelector.contains(e.target)) {
        this.dom.modelSelector.classList.remove('open');
      }
      if (!this.dom.presetDropdown.contains(e.target)) {
        this.dom.presetDropdown.classList.remove('open');
      }
    });

    // 7. Topbar actions
    this.dom.voiceToggleBtn.addEventListener('click', () => this.toggleVoiceMode());
    this.dom.exportBtn.addEventListener('click', () => this.exportConversation());

    this.dom.fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
        this.dom.fullscreenIcon.className = 'fa-solid fa-compress';
      } else {
        document.exitFullscreen().catch(() => {});
        this.dom.fullscreenIcon.className = 'fa-solid fa-expand';
      }
    });

    // 8. Welcome Screen prompt cards
    this.dom.welcomeScreen.addEventListener('click', (e) => {
      const card = e.target.closest('.gpt-prompt-card');
      if (card && card.dataset.prompt) {
        this.sendMessage(card.dataset.prompt);
      }
    });

    // 9. Input Form & Textarea
    this.dom.textarea.addEventListener('input', () => this.handleTextareaInput());
    this.dom.textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    this.dom.inputForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.sendMessage();
    });

    // 10. Microphone Voice Input
    this.dom.micBtn.addEventListener('click', () => this.toggleListening());

    // 11. Presets / Subject modes dropdown
    this.dom.presetBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.dom.presetDropdown.classList.toggle('open');
    });

    this.dom.presetMenu.addEventListener('click', (e) => {
      const item = e.target.closest('.gpt-preset-item');
      if (item && item.dataset.preset) {
        this.dom.textarea.value = item.dataset.preset;
        this.dom.textarea.focus();
        this.handleTextareaInput();
        this.dom.presetDropdown.classList.remove('open');
      }
    });

    // 12. Message toolbar actions delegation
    this.dom.messagesList.addEventListener('click', (e) => {
      // Copy code button inside pre block
      const copyCodeBtn = e.target.closest('.gpt-copy-code-btn');
      if (copyCodeBtn && copyCodeBtn.dataset.code) {
        navigator.clipboard.writeText(copyCodeBtn.dataset.code);
        const span = copyCodeBtn.querySelector('span');
        if (span) {
          span.textContent = 'Copied!';
          setTimeout(() => { span.textContent = 'Copy code'; }, 2000);
        }
        return;
      }

      // Copy entire answer
      const copyBtn = e.target.closest('.copy-btn');
      if (copyBtn) {
        const bubble = copyBtn.closest('.gpt-msg-content-wrap').querySelector('.gpt-assistant-bubble');
        if (bubble) {
          navigator.clipboard.writeText(bubble.innerText);
          const span = copyBtn.querySelector('span');
          if (span) {
            span.textContent = 'Copied!';
            setTimeout(() => { span.textContent = 'Copy'; }, 2000);
          }
        }
        return;
      }

      // Speak answer (female voice)
      const speakBtn = e.target.closest('.speak-btn');
      if (speakBtn) {
        const bubble = speakBtn.closest('.gpt-msg-content-wrap').querySelector('.gpt-assistant-bubble');
        if (bubble) {
          speakMayaVoice(bubble.innerText, speakBtn);
        }
        return;
      }

      // Thumbs feedback
      const thumbsUp = e.target.closest('.thumbs-up-btn');
      if (thumbsUp) {
        thumbsUp.style.color = '#10b981';
        return;
      }

      const thumbsDown = e.target.closest('.thumbs-down-btn');
      if (thumbsDown) {
        thumbsDown.style.color = '#ef4444';
        return;
      }
    });
  }
}

// -----------------------------------------------------------------------------
// 7. INITIALIZE ON DOM READY
// -----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  window.chatGptCloneApp = new ChatGPTCloneApp();
});
