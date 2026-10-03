/**
 * ==============================================================================
 * Prachi AI Logic (prachi.js)
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
const STORAGE_KEY_CONVERSATIONS = 'hk_prachi_conversations_v1';
const STORAGE_KEY_ACTIVE_CONV = 'hk_prachi_active_id_v1';
const STORAGE_KEY_MODEL = 'hk_prachi_model_v1';
const STORAGE_KEY_VOICE = 'hk_prachi_voice_mode_v1';
const LEGACY_STORAGE_KEY_CONVERSATIONS = 'hk_chatgpt_conversations_v1';
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
  html = html.replace(/`([^`\n]+)`/g, '<code class="gpt-inline-code">$1</code>');

  // 3. Bold & Italic
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // 4. Headings
  html = html.replace(/^#### (.*$)/gim, '<h4 class="gpt-h4">$1</h4>');
  html = html.replace(/^### (.*$)/gim, '<h3 class="gpt-h3">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="gpt-h2">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="gpt-h1">$1</h1>');

  // 5. Blockquotes
  html = html.replace(/^\> (.*$)/gim, '<blockquote class="gpt-blockquote">$1</blockquote>');

  // 6. Mathematical Display Expressions ($$...$$)
  html = html.replace(/\$\$([\s\S]*?)\$\$/g, '<div class="gpt-math-display">$1</div>');
  html = html.replace(/\$([^\$\n]+)\$/g, '<span class="gpt-math-inline">$1</span>');

  // 7. Markdown links
  html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)/g, (match, text, url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="gpt-link">${text} <i class="fa-solid fa-arrow-up-right-from-square gpt-link-icon"></i></a>`;
  });

  // 8. Lists & Paragraphs
  const lines = html.split('\n');
  let inList = false;
  let inNumList = false;
  let processed = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (/^[\-\*]\s+(.*)$/.test(line)) {
      if (inNumList) { processed.push('</ol>'); inNumList = false; }
      if (!inList) { processed.push('<ul class="gpt-list">'); inList = true; }
      processed.push(`<li>${line.replace(/^[\-\*]\s+/, '')}</li>`);
    } else if (/^\d+\.\s+(.*)$/.test(line)) {
      if (inList) { processed.push('</ul>'); inList = false; }
      if (!inNumList) { processed.push('<ol class="gpt-num-list">'); inNumList = true; }
      processed.push(`<li>${line.replace(/^\d+\.\s+/, '')}</li>`);
    } else {
      if (inList) { processed.push('</ul>'); inList = false; }
      if (inNumList) { processed.push('</ol>'); inNumList = false; }

      if (line.startsWith('<div class="gpt-code-block">') ||
          line.startsWith('<h1') || line.startsWith('<h2') ||
          line.startsWith('<h3') || line.startsWith('<h4') ||
          line.startsWith('<blockquote') || line.startsWith('<div class="gpt-math-display">') ||
          line === '') {
        processed.push(line);
      } else {
        processed.push(`<p class="gpt-p">${line}</p>`);
      }
    }
  }

  if (inList) processed.push('</ul>');
  if (inNumList) processed.push('</ol>');

  return processed.join('\n');
}

// -----------------------------------------------------------------------------
// 4. SPEECH SYNTHESIS & RECOGNITION (Prachi Female Voice Engine)
// -----------------------------------------------------------------------------
function cleanTextForPrachiSpeech(markdown) {
  if (!markdown) return '';
  return markdown
    .replace(/```[\s\S]*?```/g, 'Code example provided.')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\$\$[\s\S]*?\$\$/g, 'Mathematical equation.')
    .replace(/\$([^\$]+)\$/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[-*#]/g, '')
    .replace(/\n+/g, ' ')
    .trim();
}

function speakPrachiVoice(text, btnElement = null) {
  if (!('speechSynthesis' in window)) return;

  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    if (currentSpeakingBtn) {
      currentSpeakingBtn.classList.remove('speaking');
      const span = currentSpeakingBtn.querySelector('span');
      if (span) span.textContent = 'Listen';
      currentSpeakingBtn = null;
    }
    if (btnElement && btnElement === window.__lastClickedSpeakBtn) {
      window.__lastClickedSpeakBtn = null;
      return;
    }
  }

  const clean = cleanTextForPrachiSpeech(text);
  if (!clean) return;

  const utterance = new SpeechSynthesisUtterance(clean);
  // Prachi's pleasant, warm feminine pitch & articulate cadence
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
    else {
      const defaultVoice = voices.find(v => v.lang.toLowerCase().includes('en-in')) || 
                           voices.find(v => v.lang.toLowerCase().includes('en-us')) || 
                           voices[0];
      if (defaultVoice) utterance.voice = defaultVoice;
    }
    utterance.lang = 'en-IN';
  }

  if (btnElement) {
    currentSpeakingBtn = btnElement;
    window.__lastClickedSpeakBtn = btnElement;
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
  if (q.includes('prachi') || q.includes('girl') || q.includes('voice') || q.includes('who are you') || q.includes('tum kaun') || q.includes('ladki')) {
    return `Namaste! 👋 Main **Prachi** hoon — Himanshu Kumar ki **Human-like AI Companion & Universal Problem Solver**, powered by **Google Gemini & Cloud AI**.

🌸 **Human-like Emotional & Friendly Companion**:
- Main sirf machine nahi, ek sachhe dost ki tarah feelings samajhti hoon, baat karti hoon, aur dukh-sukh me saath deti hoon.
- Meri voice ek sweet, pleasant **female (girl) tone** me configured hai (pitch 1.18, rate 0.98).
- Kisi bhi message ke neeche **"Listen"** dabakar meri aawaz sun sakte hain ya **Voice Mode** on karke auto-readout enjoy kar sakte hain.

🌟 **Main aapko kya kya help provide kar sakti hoon?**
1. 💬 **Human Chat & Feelings**: Life advice, dost ki tarah baatein, emotional comfort, motivation, stories & funny jokes.
2. 📐 **Mathematics**: Step-by-step calculus, algebra, quadratic equations, probability, percentages.
3. ⚡ **Physics & STEM**: Kinematics numericals, Newton's laws, Ohm's law, thermodynamics, optics.
4. 🧪 **Chemistry & Biology**: Photosynthesis reactions, pH scale, DNA structure, mitochondria mechanisms.
5. 📜 **General Knowledge & Polity**: Samvidhan (Indian Constitution), Fundamental Rights, History, Geography.
6. 💻 **Coding & Programming**: Python, SQL queries, JavaScript, C++.

Aap kisi dost ki tarah mujhse baat kijiye ya koi bhi problem solve karwaiye!`;
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

  // Default Prachi Response
  return `I am **Prachi**, your Personal AI Tutor powered by **Google Gemini & Cloud AI**.

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
// 6. PRACHI AI APP CONTROLLER CLASS
// -----------------------------------------------------------------------------
class PrachiAIApp {
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
      sidebarOverlay: document.getElementById('gptSidebarOverlay'),
      sidebarToggle: document.getElementById('gptSidebarToggle'),
      sidebarCloseMobile: document.getElementById('gptSidebarCloseMobile'),
      newChatBtn: document.getElementById('gptNewChatBtn'),
      searchInput: document.getElementById('gptSearchInput'),
      historyList: document.getElementById('gptHistoryList'),
      clearAllBtn: document.getElementById('gptClearAllBtn'),
      modelSelector: document.getElementById('gptModelSelector'),
      modelBtn: document.getElementById('gptModelBtn'),
      currentModelName: document.getElementById('gptCurrentModelName'),
      modelMenu: document.getElementById('gptModelMenu'),
      modelItems: document.querySelectorAll('.gpt-model-item'),
      voiceToggleBtn: document.getElementById('gptVoiceToggleBtn'),
      voiceIcon: document.getElementById('gptVoiceIcon'),
      exportBtn: document.getElementById('gptExportBtn'),
      fullscreenBtn: document.getElementById('gptFullscreenBtn'),
      fullscreenIcon: document.getElementById('gptFullscreenIcon'),
      chatContainer: document.getElementById('gptChatContainer'),
      welcomeScreen: document.getElementById('gptWelcomeScreen'),
      messagesList: document.getElementById('gptMessagesList'),
      voiceIndicator: document.getElementById('gptVoiceIndicator'),
      voiceStopBtn: document.getElementById('gptVoiceStopBtn'),
      inputForm: document.getElementById('gptInputForm'),
      textarea: document.getElementById('gptTextarea'),
      micBtn: document.getElementById('gptMicBtn'),
      micIcon: document.getElementById('gptMicIcon'),
      sendBtn: document.getElementById('gptSendBtn'),
      presetBtns: document.querySelectorAll('.gpt-preset-item'),
      promptCards: document.querySelectorAll('.gpt-prompt-card')
    };
  }

  loadState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CONVERSATIONS) || localStorage.getItem(LEGACY_STORAGE_KEY_CONVERSATIONS);
      if (stored) {
        conversations = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('[Prachi AI] Failed to load conversations', e);
      conversations = [];
    }

    try {
      activeConversationId = localStorage.getItem(STORAGE_KEY_ACTIVE_CONV);
      if (!conversations.find(c => c.id === activeConversationId)) {
        activeConversationId = conversations.length > 0 ? conversations[0].id : null;
      }
    } catch (e) {
      activeConversationId = null;
    }

    try {
      currentModel = localStorage.getItem(STORAGE_KEY_MODEL) || 'prachi-gemini';
    } catch (e) {
      currentModel = 'prachi-gemini';
    }

    try {
      isVoiceModeEnabled = localStorage.getItem(STORAGE_KEY_VOICE) === 'true';
    } catch (e) {
      isVoiceModeEnabled = false;
    }

    this.updateVoiceToggleUI();
    this.updateModelUI();
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY_CONVERSATIONS, JSON.stringify(conversations));
      if (activeConversationId) {
        localStorage.setItem(STORAGE_KEY_ACTIVE_CONV, activeConversationId);
      }
      localStorage.setItem(STORAGE_KEY_MODEL, currentModel);
      localStorage.setItem(STORAGE_KEY_VOICE, String(isVoiceModeEnabled));
    } catch (e) {
      console.warn('[Prachi AI] Failed to save state', e);
    }
  }

  initSpeech() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        isListening = true;
        this.dom.voiceIndicator.classList.add('active');
        this.dom.micBtn.classList.add('listening');
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
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

      recognition.onerror = (e) => {
        console.warn('[Prachi Voice Notice]', e.error);
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

  startListening() {
    if (!recognition) {
      alert('Speech recognition is supported in Chrome, Edge, Safari, and Android.');
      return;
    }
    try {
      recognition.start();
    } catch (e) {
      this.stopListening();
    }
  }

  stopListening() {
    isListening = false;
    if (this.dom.voiceIndicator) this.dom.voiceIndicator.classList.remove('active');
    if (this.dom.micBtn) this.dom.micBtn.classList.remove('listening');
    if (recognition) {
      try { recognition.stop(); } catch (e) {}
    }
  }

  toggleVoiceMode() {
    isVoiceModeEnabled = !isVoiceModeEnabled;
    this.saveState();
    this.updateVoiceToggleUI();

    if (!isVoiceModeEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (currentSpeakingBtn) {
        currentSpeakingBtn.classList.remove('speaking');
        currentSpeakingBtn.querySelector('span').textContent = 'Listen';
        currentSpeakingBtn = null;
      }
    }
  }

  updateVoiceToggleUI() {
    if (!this.dom.voiceToggleBtn) return;
    if (isVoiceModeEnabled) {
      this.dom.voiceToggleBtn.classList.add('active');
      this.dom.voiceIcon.className = 'fa-solid fa-volume-high';
      this.dom.voiceToggleBtn.title = "Voice Mode: ON (Prachi reads replies aloud in her female voice)";
    } else {
      this.dom.voiceToggleBtn.classList.remove('active');
      this.dom.voiceIcon.className = 'fa-solid fa-volume-xmark';
      this.dom.voiceToggleBtn.title = "Voice Mode: OFF (Click to enable auto-reading)";
    }
  }

  updateModelUI() {
    const titles = {
      'prachi-gemini': 'Prachi 4o • Pro',
      'maya-gemini': 'Prachi 4o • Pro',
      'claude-sonnet': 'Claude 3.7 Sonnet',
      'stem-tutor': 'STEM & Academic Solver',
      'portfolio-dossier': "Himanshu's Portfolio Dossier"
    };

    if (this.dom.currentModelName) {
      this.dom.currentModelName.textContent = titles[currentModel] || 'Prachi 4o • Pro';
    }

    if (this.dom.modelItems) {
      this.dom.modelItems.forEach(item => {
        const m = item.getAttribute('data-model');
        const isActive = (m === currentModel) || (currentModel === 'maya-gemini' && m === 'prachi-gemini');
        item.classList.toggle('active', isActive);
        item.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
    }
  }

  createNewConversation() {
    const newConv = {
      id: 'conv-' + Date.now(),
      title: 'New conversation',
      createdAt: new Date().toISOString(),
      messages: []
    };
    conversations.unshift(newConv);
    activeConversationId = newConv.id;
    this.saveState();
    this.renderSidebarHistory();
    this.renderCurrentConversation();
    if (window.innerWidth <= 768) {
      this.closeMobileSidebar();
    }
    this.dom.textarea.focus();
  }

  getActiveConversation() {
    return conversations.find(c => c.id === activeConversationId);
  }

  renderSidebarHistory(query = '') {
    if (!this.dom.historyList) return;
    this.dom.historyList.innerHTML = '';

    const filter = query.toLowerCase().trim();
    const filtered = filter
      ? conversations.filter(c => c.title.toLowerCase().includes(filter))
      : conversations;

    if (filtered.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'gpt-history-empty';
      empty.textContent = filter ? 'No conversations found.' : 'No recent chats yet.';
      this.dom.historyList.appendChild(empty);
      return;
    }

    filtered.forEach(conv => {
      const item = document.createElement('div');
      item.className = 'gpt-history-item' + (conv.id === activeConversationId ? ' active' : '');
      item.setAttribute('data-id', conv.id);

      item.innerHTML = `
        <div class="gpt-history-item-content">
          <i class="fa-regular fa-message gpt-history-icon"></i>
          <span class="gpt-history-title" title="${escapeHtml(conv.title)}">${escapeHtml(conv.title)}</span>
        </div>
        <div class="gpt-history-actions">
          <button class="gpt-history-action-btn edit-title-btn" title="Rename chat">
            <i class="fa-regular fa-pen-to-square"></i>
          </button>
          <button class="gpt-history-action-btn delete-conv-btn" title="Delete chat">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
      `;

      item.addEventListener('click', (e) => {
        if (e.target.closest('.gpt-history-actions')) return;
        activeConversationId = conv.id;
        this.saveState();
        this.renderSidebarHistory();
        this.renderCurrentConversation();
        if (window.innerWidth <= 768) this.closeMobileSidebar();
      });

      const editBtn = item.querySelector('.edit-title-btn');
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const newTitle = prompt('Enter new conversation title:', conv.title);
        if (newTitle && newTitle.trim()) {
          conv.title = newTitle.trim();
          this.saveState();
          this.renderSidebarHistory();
        }
      });

      const deleteBtn = item.querySelector('.delete-conv-btn');
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm(`Delete "${conv.title}"?`)) {
          this.deleteConversation(conv.id);
        }
      });

      this.dom.historyList.appendChild(item);
    });
  }

  deleteConversation(convId) {
    conversations = conversations.filter(c => c.id !== convId);
    if (activeConversationId === convId) {
      activeConversationId = conversations.length > 0 ? conversations[0].id : null;
    }
    this.saveState();
    this.renderSidebarHistory();
    this.renderCurrentConversation();
  }

  clearAllConversations() {
    if (conversations.length === 0) return;
    if (confirm('Are you sure you want to clear all conversation history?')) {
      conversations = [];
      activeConversationId = null;
      this.saveState();
      this.renderSidebarHistory();
      this.renderCurrentConversation();
    }
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

    conv.messages.forEach(msg => {
      this.appendMessageRow(msg.role, msg.content);
    });

    this.scrollToBottom();
  }

  appendMessageRow(role, content, isStreamingMessage = false) {
    const row = document.createElement('div');
    row.className = `gpt-msg-row ${role === 'user' ? 'gpt-user-row' : 'gpt-assistant-row'}`;

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

  async handleUserSubmit(e) {
    if (e) e.preventDefault();
    const query = this.dom.textarea.value.trim();
    if (!query || isStreaming) return;

    // Reset textarea
    this.dom.textarea.value = '';
    this.dom.textarea.style.height = 'auto';
    this.dom.sendBtn.disabled = true;

    // Ensure active conversation exists
    let conv = this.getActiveConversation();
    if (!conv) {
      conv = {
        id: 'conv-' + Date.now(),
        title: query.slice(0, 32) + (query.length > 32 ? '...' : ''),
        createdAt: new Date().toISOString(),
        messages: []
      };
      conversations.unshift(conv);
      activeConversationId = conv.id;
    } else if (conv.messages.length === 0) {
      conv.title = query.slice(0, 32) + (query.length > 32 ? '...' : '');
    }

    // Add user message
    conv.messages.push({ role: 'user', content: query });
    this.saveState();
    this.dom.welcomeScreen.style.display = 'none';
    this.appendMessageRow('user', query);
    this.renderSidebarHistory();

    // Start Assistant Streaming
    await this.streamAssistantResponse(query, conv);
  }

  async streamAssistantResponse(userQuery, conv) {
    isStreaming = true;
    this.dom.sendBtn.disabled = true;

    // Prepare assistant message bubble
    const assistantRow = this.appendMessageRow('assistant', '', true);
    const bubble = assistantRow.querySelector('.gpt-assistant-bubble');
    const speakBtn = assistantRow.querySelector('.speak-btn');

    let fullReply = '';

    // First attempt Cloudflare Worker proxy if configured
    let successWithWorker = false;

    if (WORKER_URL && !WORKER_URL.includes('your-subdomain')) {
      try {
        abortController = new AbortController();
        const response = await fetch(WORKER_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userQuery,
            model: currentModel,
            history: conv.messages.slice(-8)
          }),
          signal: abortController.signal
        });

        if (response.ok && response.body) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder('utf-8');
          let done = false;

          while (!done) {
            const { value, done: readerDone } = await reader.read();
            done = readerDone;
            if (value) {
              const chunk = decoder.decode(value, { stream: true });
              fullReply += chunk;
              bubble.innerHTML = renderSafeMarkdown(fullReply) + '<span class="gpt-typing-cursor"></span>';
              this.scrollToBottom();
            }
          }
          successWithWorker = true;
        }
      } catch (err) {
        console.warn('[Prachi AI Worker stream notice]', err);
      }
    }

    // Fallback: Local High-Intelligence Academic & Portfolio Engine
    if (!successWithWorker) {
      fullReply = generateTutorResponse(userQuery, currentModel);
      const words = fullReply.split(' ');
      let currentText = '';

      for (let i = 0; i < words.length; i++) {
        currentText += (i === 0 ? '' : ' ') + words[i];
        bubble.innerHTML = renderSafeMarkdown(currentText) + '<span class="gpt-typing-cursor"></span>';
        this.scrollToBottom();
        await new Promise(r => setTimeout(r, 16));
      }
    }

    // Finalize message rendering
    bubble.innerHTML = renderSafeMarkdown(fullReply);
    conv.messages.push({ role: 'assistant', content: fullReply });
    this.saveState();

    isStreaming = false;
    this.handleTextareaInput();

    // If voice mode is on, auto-read Prachi's reply aloud
    if (isVoiceModeEnabled) {
      setTimeout(() => {
        speakPrachiVoice(fullReply, speakBtn);
      }, 250);
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

    this.dom.sidebarCloseMobile.addEventListener('click', () => this.closeMobileSidebar());
    this.dom.sidebarOverlay.addEventListener('click', () => this.closeMobileSidebar());

    // 2. New chat button
    this.dom.newChatBtn.addEventListener('click', () => this.createNewConversation());

    // 3. Clear all chats
    this.dom.clearAllBtn.addEventListener('click', () => this.clearAllConversations());

    // 4. Search input
    this.dom.searchInput.addEventListener('input', (e) => {
      this.renderSidebarHistory(e.target.value);
    });

    // 5. Model Switcher Dropdown
    this.dom.modelBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = this.dom.modelMenu.classList.contains('open');
      this.dom.modelMenu.classList.toggle('open', !isOpen);
      this.dom.modelBtn.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
    });

    document.addEventListener('click', (e) => {
      if (!this.dom.modelSelector.contains(e.target)) {
        this.dom.modelMenu.classList.remove('open');
        this.dom.modelBtn.setAttribute('aria-expanded', 'false');
      }
    });

    this.dom.modelItems.forEach(item => {
      item.addEventListener('click', () => {
        currentModel = item.getAttribute('data-model');
        this.saveState();
        this.updateModelUI();
        this.dom.modelMenu.classList.remove('open');
        this.dom.modelBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // 6. Voice Mode Toggle
    this.dom.voiceToggleBtn.addEventListener('click', () => this.toggleVoiceMode());

    // 7. Microphone input
    this.dom.micBtn.addEventListener('click', () => {
      if (isListening) this.stopListening();
      else this.startListening();
    });

    this.dom.voiceStopBtn.addEventListener('click', () => this.stopListening());

    // 8. Textarea Auto-Resize & Enter to submit
    this.dom.textarea.addEventListener('input', () => this.handleTextareaInput());
    this.dom.textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.handleUserSubmit();
      }
    });

    // 9. Form Submit
    this.dom.inputForm.addEventListener('submit', (e) => this.handleUserSubmit(e));

    // 10. Subject Presets
    this.dom.presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const preset = btn.getAttribute('data-preset');
        this.dom.textarea.value = preset;
        this.handleTextareaInput();
        this.dom.textarea.focus();
      });
    });

    // 11. Welcome Prompt Cards
    this.dom.promptCards.forEach(card => {
      card.addEventListener('click', () => {
        const prompt = card.getAttribute('data-prompt');
        this.dom.textarea.value = prompt;
        this.handleTextareaInput();
        this.handleUserSubmit();
      });
    });

    // 12. Export Chat
    this.dom.exportBtn.addEventListener('click', () => this.exportConversation());

    // 13. Fullscreen
    this.dom.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());

    // 14. Global Keyboard Shortcuts (Ctrl+K = New Chat, Esc = Close Menu)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.createNewConversation();
      }
      if (e.key === 'Escape') {
        this.dom.modelMenu.classList.remove('open');
        this.dom.modelBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // 15. Delegated Actions (Copy, Listen, Thumbs)
    this.dom.messagesList.addEventListener('click', (e) => {
      // Copy code inside codeblock
      const copyCodeBtn = e.target.closest('.gpt-copy-code-btn');
      if (copyCodeBtn) {
        const code = copyCodeBtn.getAttribute('data-code');
        if (code) {
          navigator.clipboard.writeText(code).then(() => {
            const span = copyCodeBtn.querySelector('span');
            if (span) span.textContent = 'Copied!';
            setTimeout(() => { if (span) span.textContent = 'Copy code'; }, 2000);
          });
        }
        return;
      }

      // Copy entire assistant message
      const copyMsgBtn = e.target.closest('.copy-btn');
      if (copyMsgBtn) {
        const row = copyMsgBtn.closest('.gpt-msg-row');
        const bubble = row ? row.querySelector('.gpt-msg-bubble') : null;
        if (bubble) {
          navigator.clipboard.writeText(bubble.innerText).then(() => {
            const span = copyMsgBtn.querySelector('span');
            if (span) span.textContent = 'Copied!';
            setTimeout(() => { if (span) span.textContent = 'Copy'; }, 2000);
          });
        }
        return;
      }

      // Readout response aloud in Prachi's female voice
      const speakBtn = e.target.closest('.speak-btn');
      if (speakBtn) {
        const row = speakBtn.closest('.gpt-msg-row');
        const bubble = row ? row.querySelector('.gpt-msg-bubble') : null;
        if (bubble) {
          speakPrachiVoice(bubble.innerText, speakBtn);
        }
        return;
      }

      // Thumbs up / down feedback
      const thumbsUp = e.target.closest('.thumbs-up-btn');
      if (thumbsUp) {
        thumbsUp.classList.toggle('active');
        const sibling = thumbsUp.parentElement.querySelector('.thumbs-down-btn');
        if (sibling) sibling.classList.remove('active');
        return;
      }

      const thumbsDown = e.target.closest('.thumbs-down-btn');
      if (thumbsDown) {
        thumbsDown.classList.toggle('active');
        const sibling = thumbsDown.parentElement.querySelector('.thumbs-up-btn');
        if (sibling) sibling.classList.remove('active');
        return;
      }
    });
  }

  closeMobileSidebar() {
    this.dom.sidebar.classList.remove('open');
    this.dom.sidebarOverlay.classList.remove('active');
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn('Error attempting to enable fullscreen:', err.message);
      });
      if (this.dom.fullscreenIcon) this.dom.fullscreenIcon.className = 'fa-solid fa-compress';
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      if (this.dom.fullscreenIcon) this.dom.fullscreenIcon.className = 'fa-solid fa-expand';
    }
  }
}

// -----------------------------------------------------------------------------
// 7. APP BOOTSTRAP
// -----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  window.prachiAIApp = new PrachiAIApp();
  window.chatGptCloneApp = window.prachiAIApp; // Backward-compatibility
});
