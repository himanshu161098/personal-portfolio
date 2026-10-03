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
  { icon: 'fa-solid fa-calculator', text: 'Solve a Math / Physics numerical step-by-step 📐' },
  { icon: 'fa-solid fa-flask-vial', text: 'Explain Chemistry / Biology concepts simply 🧬' },
  { icon: 'fa-solid fa-landmark', text: 'Explain Indian Polity, GK/GS & Current Affairs 🌍' },
  { icon: 'fa-solid fa-bolt', text: 'Give me a 30-second pitch about Himanshu 🚀' },
  { icon: 'fa-solid fa-chart-line', text: 'Tell me about the Netflix analysis project' },
  { icon: 'fa-solid fa-envelope', text: 'How can I contact Himanshu?' }
];

// Initial welcome greeting
const WELCOME_GREETING = `Hello! 👋 I'm **Maya**, Himanshu's AI & Universal Problem-Solving Tutor (powered by **Google Gemini & Cloud AI**).

I provide the **best, simplest step-by-step solutions** across all subjects:
1. 📐 **Mathematics & Science**: Algebra, Calculus, Physics numericals, Chemistry reactions, Biology mechanisms.
2. 🌍 **GK/GS & Current Affairs**: Indian Constitution & Polity, History, Geography, Economy, and national/global news.
3. 📂 **Himanshu's Portfolio & Career Fit**: Facts on his skills, Netflix catalog analysis (8,787 titles), certifications, and honest JD fit.
4. 🎙️ **Female Voice Assistant**: Click the **Microphone** to speak in English, Hindi, or Hinglish, or toggle the speaker icon to hear my voice!`;

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
  // 1. Try Universal Dynamic Intelligence Engine (Math, Code, GK, Science, Social)
  if (typeof window !== 'undefined' && window.UniversalAIEngine && typeof window.UniversalAIEngine.generateResponse === 'function') {
    return window.UniversalAIEngine.generateResponse(userQuery, { assistantName: 'Maya' });
  }

  const q = userQuery.toLowerCase().trim();

  // 0. Maya Female Voice Identity & Assistant Intro
  if (q.includes('maya') || q.includes('prachi') || q.includes('girl') || q.includes('voice') || q.includes('ladki') || q.includes('sound') || q.includes('aawaz') || q.includes('who are you') || q.includes('tum kaun') || q.includes('apna naam') || q.includes('intro')) {
    return `Namaste! 👋 Main **Maya** hoon, Himanshu Kumar ki AI & Universal Problem-Solving Tutor, powered by **Google Gemini & Cloud AI**.

🎙️ **Female Voice Assistant Active**:
- Meri voice ek pleasant, natural **girl/female tone** me configured hai (pitch 1.18, natural cadence).
- Har message ke neeche **"Listen"** button par click karke aap meri aawaz sun sakte hain ya top bar me **Speaker toggle icon** on karke automatic voice readout enjoy kar sakte hain.
- Microphone button 🎙️ dabakar aap mujhse English, Hindi ya Hinglish me bol kar bhi sawaal pooch sakte hain.

🌟 **Aap mujhse kya pooch sakte hain?**
1. 📐 **Mathematics & Quantitative Aptitude**: Calculus (derivatives, integrals), Algebra, Quadratic equations, Probability, Percentages.
2. ⚡ **Physics**: Kinematics equations, Newton's Laws, Work-Energy, Ohm's Law, Projectile motion, Optics numericals.
3. 🧪 **Chemistry**: Photosynthesis reaction, Mole concept, pH calculation, Acids & Bases, Organic mechanisms ($S_N1/S_N2$), Periodic trends.
4. 🧬 **Biology**: Cell organelles (Mitochondria ATP powerhouse), Mitosis vs Meiosis, DNA double helix, Human heart blood circulation.
5. 📜 **General Knowledge & GS**: Indian Constitution (Preamble, Fundamental Rights, Articles), History (Harappa, Ashoka, Freedom movement), Geography (Rivers of India), Economy (GDP, Inflation, RBI).
6. 🇮🇳 **Current Affairs**: IndiaAI Mission (10,000+ GPUs), ISRO space missions (Chandrayaan-3, Aditya-L1, Gaganyaan).
7. 📂 **Himanshu's Portfolio**: Netflix analysis (8,787 titles), skills, education, certifications, and JD fit.

Aap koi bhi question poochiye, main best aur simple step-by-step solution dungi!`;
  }

  // 1. Mathematics Problem Solver (Best, Simplest Step-by-Step Solutions)
  if (q.includes('math') || q.includes('calculus') || q.includes('derivative') || q.includes('differentiate') || q.includes('integral') || q.includes('algebra') || q.includes('quadratic') || q.includes('trigonometry') || q.includes('probability') || q.includes('percentage') || q.includes('matrix') || q.includes('solve ') || q.includes('equation') || q.includes('ganit')) {
    // Specific: Derivative / Calculus
    if (q.includes('derivative') || q.includes('differentiate') || q.includes('calculus') || q.includes('d/dx')) {
      return `### 📐 Calculus Problem: Finding the Derivative $\\frac{d}{dx}[x^3 + 5x^2 - 7x + 9]$

Here is the **clearest step-by-step solution**:

1. 📌 **Given Function**:
   $$f(x) = x^3 + 5x^2 - 7x + 9$$

2. 📐 **Governing Formulas / Rules**:
   - **Power Rule**: $\\frac{d}{dx}[x^n] = n \\cdot x^{n-1}$
   - **Constant Multiple Rule**: $\\frac{d}{dx}[c \\cdot f(x)] = c \\cdot f'(x)$
   - **Constant Rule**: $\\frac{d}{dx}[C] = 0$
   - **Sum/Difference Rule**: Differentiate each term individually.

3. 🔢 **Step-by-Step Differentiation**:
   - Term 1: $\\frac{d}{dx}[x^3] = 3x^{3-1} = 3x^2$
   - Term 2: $\\frac{d}{dx}[5x^2] = 5 \\cdot (2x^{2-1}) = 10x$
   - Term 3: $\\frac{d}{dx}[-7x] = -7 \\cdot (1x^0) = -7$
   - Term 4: $\\frac{d}{dx}[9] = 0$ (derivative of a constant is always zero)

4. ✅ **Final Answer**:
   $$f'(x) = 3x^2 + 10x - 7$$

5. 💡 **Pro-Tip & Intuitive Meaning**:
   The derivative $f'(x)$ represents the **instantaneous rate of change** (slope of the tangent line) at any point $x$. If you want to find the slope at $x = 2$, simply plug in $x = 2$: $f'(2) = 3(4) + 10(2) - 7 = 12 + 20 - 7 = 25$!`;
    }

    // Specific: Quadratic Equation / Algebra
    if (q.includes('quadratic') || q.includes('x^2') || q.includes('root') || q.includes('algebra')) {
      return `### 📐 Algebra Problem: Solving Quadratic Equation $2x^2 - 7x + 3 = 0$

Here is the **best and simplest solution** using the Quadratic Formula:

1. 📌 **Given Equation**:
   $$2x^2 - 7x + 3 = 0$$
   Comparing with standard form $ax^2 + bx + c = 0$:
   - $a = 2$, $b = -7$, $c = 3$

2. 📐 **Formula Used (Shreedharacharya Formula)**:
   $$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$
   - **Discriminant ($D$)**: $D = b^2 - 4ac$

3. 🔢 **Step-by-Step Calculation**:
   - **Step 1 (Find Discriminant $D$)**:
     $$D = (-7)^2 - 4(2)(3) = 49 - 24 = 25$$
     *(Since $D > 0$, the equation has two distinct real roots)*.
   - **Step 2 (Calculate Square Root)**:
     $$\\sqrt{D} = \\sqrt{25} = 5$$
   - **Step 3 (Find the Roots)**:
     $$x = \\frac{-(-7) \\pm 5}{2(2)} = \\frac{7 \\pm 5}{4}$$
     - Root 1: $x_1 = \\frac{7 + 5}{4} = \\frac{12}{4} = 3$
     - Root 2: $x_2 = \\frac{7 - 5}{4} = \\frac{2}{4} = 0.5$ (or $\\frac{1}{2}$)

4. ✅ **Final Answer**:
   The roots of the equation are **$x = 3$** and **$x = 0.5$ (or $\\frac{1}{2}$)**.

5. 💡 **Pro-Tip / Sanity Check**:
   - Sum of roots: $3 + 0.5 = 3.5 = -\\frac{b}{a} = \\frac{7}{2} = 3.5$ (Verified! ✅)
   - Product of roots: $3 \\times 0.5 = 1.5 = \\frac{c}{a} = \\frac{3}{2} = 1.5$ (Verified! ✅)`;
    }

    // Specific: Probability
    if (q.includes('probabilit')) {
      return `### 📐 Probability Problem: Tossing Two Fair Coins Simultaneously

Here is the **clearest step-by-step solution** to find the probability of getting **at least one Head**:

1. 📌 **Given Problem**:
   Two unbiased coins are tossed together. Find $P(\\text{At least one Head})$.

2. 📐 **Probability Formula**:
   $$P(E) = \\frac{\\text{Number of Favourable Outcomes } n(E)}{\\text{Total Number of Possible Outcomes } n(S)}$$

3. 🔢 **Step-by-Step Calculation**:
   - **Sample Space ($S$)**:
     $$S = \\{(H, H), (H, T), (T, H), (T, T)\\}$$
     Total outcomes: $n(S) = 4$
   - **Favourable Event ($E$)** - at least one Head means 1 Head or 2 Heads:
     $$E = \\{(H, H), (H, T), (T, H)\\}$$
     Favourable outcomes: $n(E) = 3$
   - **Probability**:
     $$P(E) = \\frac{3}{4} = 0.75 = 75\\%$$

4. ✅ **Final Answer**:
   $$P(\\text{At least one Head}) = \\frac{3}{4} \\text{ or } 75\\%$$

5. 💡 **Shortcut (Complement Rule)**:
   $P(\\text{At least 1 Head}) = 1 - P(\\text{No Heads}) = 1 - P(T, T) = 1 - \\frac{1}{4} = \\frac{3}{4}$. Fast and reliable for exams!`;
    }

    // General Math Problem Solver Framework
    return `### 📐 Universal Mathematics Problem Solver

Aap koi bhi Math problem (Calculus, Linear Algebra, Probability, Trigonometry, ya Arithmetic) type kar sakte hain! Main hamesha ye **5-Point Standard** follow karti hoon:

1. 📌 **Given Information**: Problem ke variables aur targets ko identify karna.
2. 📐 **Formulas & Rules**: Relevant theorem ya identity state karna.
3. 🔢 **Step-by-Step Calculation**: Har step ko simple Hinglish/English me derive karna.
4. ✅ **Final Answer**: Highlighted final result with verification.
5. 💡 **Pro-Tip & Shortcut**: Exam tricks ya visual intuition.

Aap apna specific math question likhiye (jaise "solve 3x + 4 = 19" ya "derivative of sin(x)*cos(x)"), aur main turant step-by-step solution dungi!`;
  }

  // 2. Physics Numericals & Problem Solving
  if (q.includes('physic') || q.includes('newton') || q.includes('kinematic') || q.includes('velocity') || q.includes('acceleration') || q.includes('projectile') || q.includes('friction') || q.includes('thermodynamic') || q.includes('ohm') || q.includes('electricity') || q.includes('optics') || q.includes('light') || q.includes('gravity') || q.includes('numerical') || q.includes('bhautik')) {
    // Specific: Kinematics / Motion
    if (q.includes('motion') || q.includes('velocity') || q.includes('acceleration') || q.includes('kinematic') || q.includes('car')) {
      return `### ⚡ Physics Numerical: Kinematics & Equation of Motion

**Problem**: A car starts from rest and accelerates uniformly at $2 \\text{ m/s}^2$ for $5 \\text{ seconds}$. Find its final velocity and the total distance travelled.

1. 📌 **Given Data (with SI Units)**:
   - Initial velocity ($u$) = $0 \\text{ m/s}$ (starts from rest)
   - Acceleration ($a$) = $2 \\text{ m/s}^2$
   - Time taken ($t$) = $5 \\text{ s}$
   - Target: Final velocity ($v$) and Distance ($s$)

2. 📐 **Governing Equations of Motion**:
   - 1st Equation: $v = u + at$
   - 2nd Equation: $s = ut + \\frac{1}{2}at^2$

3. 🔢 **Step-by-Step Calculation**:
   - **Part A (Final Velocity)**:
     $$v = 0 + (2 \\times 5) = 10 \\text{ m/s}$$
   - **Part B (Distance Travelled)**:
     $$s = (0 \\times 5) + \\frac{1}{2} \\times 2 \\times (5)^2$$
     $$s = 0 + 1 \\times 25 = 25 \\text{ meters}$$

4. ✅ **Final Answer**:
   - Final Velocity = **$10 \\text{ m/s}$** (or $36 \\text{ km/h}$)
   - Distance Travelled = **$25 \\text{ meters}$**

5. 💡 **Physical Intuition**:
   Average velocity during uniform acceleration is $\\frac{u + v}{2} = \\frac{0 + 10}{2} = 5 \\text{ m/s}$. Distance is simply Average Velocity $\\times$ Time = $5 \\times 5 = 25 \\text{ m}$!`;
    }

    // Specific: Ohm's Law / Electricity
    if (q.includes('ohm') || q.includes('resistor') || q.includes('current') || q.includes('voltage') || q.includes('circuit')) {
      return `### ⚡ Physics Problem: Ohm's Law & Circuit Analysis

**Problem**: A $12\\text{V}$ battery is connected across two resistors of $4\\,\\Omega$ and $6\\,\\Omega$ connected in series. Find the total resistance and circuit current.

1. 📌 **Given Data**:
   - Voltage ($V$) = $12 \\text{ Volts}$
   - Resistors: $R_1 = 4\\,\\Omega$, $R_2 = 6\\,\\Omega$ (Series combination)

2. 📐 **Governing Formulas**:
   - Equivalent Resistance in Series: $R_{\\text{eq}} = R_1 + R_2$
   - Ohm's Law: $V = I \\cdot R \\implies I = \\frac{V}{R_{\\text{eq}}}$

3. 🔢 **Step-by-Step Calculation**:
   - **Step 1 (Total Resistance)**:
     $$R_{\\text{eq}} = 4 + 6 = 10\\,\\Omega$$
   - **Step 2 (Current through Circuit)**:
     $$I = \\frac{12 \\text{ V}}{10\\,\\Omega} = 1.2 \\text{ Amperes}$$
   - **Step 3 (Voltage drop across each)**:
     $$V_1 = I \\cdot R_1 = 1.2 \\times 4 = 4.8 \\text{ V}$$
     $$V_2 = I \\cdot R_2 = 1.2 \\times 6 = 7.2 \\text{ V}$$
     *(Note: $4.8 + 7.2 = 12\\text{V}$, confirming conservation of energy)*.

4. ✅ **Final Answer**:
   - Equivalent Resistance = **$10\\,\\Omega$**
   - Circuit Current = **$1.2\\text{ A}$**

5. 💡 **Pro-Tip**: In a series circuit, **current ($I$) remains the same** through all elements, while voltage divides proportionately to the resistances!`;
    }

    // General Physics
    return `### ⚡ Physics Problem Solving Hub

Aap Physics ka koi bhi numerical ya theoretical question pooch sakte hain:
- **Mechanics**: Newton's Laws ($F = ma$), Friction, Projectile motion, Circular motion.
- **Work, Energy & Power**: $W = F \\cdot d \\cos(\\theta)$, Kinetic energy $\\frac{1}{2}mv^2$, Potential energy $mgh$.
- **Thermodynamics & Heat**: Heat engines, Carnot cycle, 1st & 2nd Laws of Thermodynamics.
- **Electromagnetism**: Coulomb's Law, Gauss's Law, Ampere's Law, Faraday's Induction.
- **Optics & Modern Physics**: Snell's Law, Lens formula, Photoelectric effect ($E = h\\nu$).

Aap apna numerical likhiye, aur main SI units ke sath step-by-step derive karke samjhaungi!`;
  }

  // 3. Chemistry Problem Solving & Reactions
  if (q.includes('chemist') || q.includes('reaction') || q.includes('photosynthesis') || q.includes('acid') || q.includes('base') || q.includes('ph ') || q.includes('mole') || q.includes('periodic') || q.includes('organic') || q.includes('inorganic') || q.includes('rasayan')) {
    if (q.includes('photosynthesis')) {
      return `### 🧪 Chemistry in Biology: Photosynthesis Chemical Equation

**Photosynthesis** wo biochemical process hai jisme green plants sunlight, water aur carbon dioxide ka use karke glucose aur oxygen banate hain.

1. 📌 **Balanced Chemical Equation**:
   $$6\\text{CO}_2 + 6\\text{H}_2\\text{O} \\xrightarrow[\\text{Chlorophyll}]{\\text{Sunlight}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2$$

2. 📐 **Reactants & Products**:
   - **Reactants (Inlet)**: 6 molecules of Carbon Dioxide (from air) + 6 molecules of Water (from roots).
   - **Catalyst / Energy**: Photons absorbed by Chlorophyll pigment in chloroplasts.
   - **Products (Outlet)**: 1 molecule of Glucose (chemical energy storage) + 6 molecules of Oxygen gas (released into atmosphere).

3. 🔢 **Two Main Stages**:
   - **Light Reaction (Thylakoid)**: Photolysis of water releases $O_2$, generating ATP and NADPH.
   - **Dark Reaction / Calvin Cycle (Stroma)**: $CO_2$ is fixed into Glucose without direct requirement of light.

4. 💡 **Pro-Tip / Key Exam Fact**: Photosynthesis is an **endothermic oxidation-reduction reaction**: Water is oxidized to $O_2$, while Carbon Dioxide is reduced to Glucose!`;
    }

    if (q.includes('ph ') || q.includes('acid') || q.includes('base')) {
      return `### 🧪 Chemistry Problem: pH Calculation of an Acidic Solution

**Problem**: Calculate the pH of a $0.001\\text{ M}$ solution of Hydrochloric Acid ($HCl$).

1. 📌 **Given Data**:
   - Concentration of strong acid $HCl = 10^{-3}\\text{ M}$
   - Since $HCl$ is a strong monoprotic acid, it dissociates completely:
     $$HCl \\rightarrow H^+ + Cl^-$$
   - Therefore, $[H^+] = 10^{-3}\\text{ M}$ (or $0.001\\text{ mol/L}$)

2. 📐 **Formula**:
   $$\\text{pH} = -\\log_{10}[H^+]$$

3. 🔢 **Step-by-Step Calculation**:
   $$\\text{pH} = -\\log_{10}(10^{-3})$$
   Using logarithm power rule $\\log(a^b) = b \\log(a)$:
   $$\\text{pH} = -(-3) \\log_{10}(10) = 3 \\times 1 = 3$$

4. ✅ **Final Answer**:
   $$\\text{pH} = 3 \\text{ (Strongly Acidic)}$$

5. 💡 **Quick Reference Scale**:
   - $\\text{pH} < 7$: Acidic (Lower = Stronger acid)
   - $\\text{pH} = 7$: Neutral (Pure water at $25^\\circ\\text{C}$)
   - $\\text{pH} > 7$: Basic / Alkaline (Higher = Stronger base)`;
    }

    return `### 🧪 Chemistry Problem Solving Hub

Main Chemistry ke sabhi branches ke best aur simple solutions deti hoon:
- **Physical Chemistry**: Mole concept ($n = \\frac{m}{M}$), Gas laws ($PV = nRT$), Chemical Equilibrium ($K_c, K_p$), Electrochemistry (Nernst equation).
- **Organic Chemistry**: IUPAC nomenclature, $S_N1$ vs $S_N2$ reaction mechanisms, Markovnikov addition, named reactions (Aldol condensation, Cannizzaro, Grignard reagents).
- **Inorganic Chemistry**: Periodic table trends (Electronegativity, Ionization energy, Atomic radii), Chemical bonding (VSEPR theory, Hybridization).

Aap koi bhi chemical equation ya numerical poochiye!`;
  }

  // 4. Biology Concepts & Physiology
  if (q.includes('biolog') || q.includes('cell') || q.includes('mitochondria') || q.includes('mitosis') || q.includes('meiosis') || q.includes('dna') || q.includes('genetic') || q.includes('heart') || q.includes('circulat') || q.includes('neuron') || q.includes('respirat') || q.includes('jiv vigyan')) {
    if (q.includes('mitochondria') || q.includes('powerhouse')) {
      return `### 🧬 Biology Concept: Mitochondria — The Powerhouse of the Cell

1. 📌 **Definition**:
   Mitochondria are double-membraned cellular organelles found in eukaryotic cells responsible for producing adenosine triphosphate (**ATP**), the primary chemical energy currency of the body.

2. 🔬 **Key Structural Features**:
   - **Outer Membrane**: Smooth and permeable to small molecules.
   - **Inner Membrane**: Folded into finger-like projections called **Cristae** to dramatically increase surface area for enzyme activity.
   - **Matrix**: The fluid interior containing enzymes for the Krebs (Citric Acid) Cycle, 70S ribosomes, and circular mitochondrial DNA (mtDNA).

3. ⚙️ **Working Mechanism (Cellular Respiration)**:
   - Glucose breakdown products (pyruvate) enter mitochondria.
   - Aerobic respiration produces up to **36 to 38 ATP molecules** per glucose molecule:
     $$\\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2 \\rightarrow 6\\text{CO}_2 + 6\\text{H}_2\\text{O} + 36\\text{ ATP}$$

4. 💡 **Fascinating Fact**: Mitochondria have their own independent DNA and replicate independently via binary fission, supporting the **Endosymbiotic Theory** that they evolved from ancient aerobic bacteria!`;
    }

    if (q.includes('mitosis') || q.includes('meiosis')) {
      return `### 🧬 Biology Comparison: Mitosis vs Meiosis

| Feature | Mitosis (Equational Division) | Meiosis (Reductional Division) |
| :--- | :--- | :--- |
| **Location** | Somatic (body) cells | Germ cells (testes/ovaries) |
| **Purpose** | Growth, tissue repair, asexual reproduction | Gamete formation (sperm & egg) |
| **Divisions** | 1 nuclear division (PMAT) | 2 sequential divisions (Meiosis I & II) |
| **Daughter Cells**| 2 identical diploid ($2n$) cells | 4 genetically diverse haploid ($n$) cells |
| **Crossing Over** | Does not occur | Occurs in Pachytene of Prophase I |
| **Chromosome No.**| Remains constant ($46 \\rightarrow 46$) | Halved ($46 \\rightarrow 23$) |

💡 **Mnemonic to remember stages**: **I-PMAT** (Interphase, Prophase, Metaphase, Anaphase, Telophase).`;
    }

    return `### 🧬 Biology Concept & Mechanism Hub

Aap Biology ka koi bhi concept detail me pooch sakte hain:
- **Cell Biology**: Organelle functions, Active vs passive transport, Cell cycle regulation.
- **Genetics & Molecular Biology**: Mendel's laws, DNA replication, Transcription (DNA $\\rightarrow$ mRNA), Translation (protein synthesis).
- **Human Physiology**: Double circulation in human heart, Nephron filtration in kidneys, Synaptic nerve impulse transmission.
- **Ecology**: Energy flow 10% law, Biogeochemical cycles, Food webs.

Aap koi bhi biology term ya process likhiye, main crystal clear explanations dungi!`;
  }

  // 5. General Knowledge (GK) & General Studies (GS)
  if (q.includes('gk') || q.includes('gkgs') || q.includes('gs ') || q.includes('general knowledge') || q.includes('general studies') || q.includes('constitution') || q.includes('preamble') || q.includes('fundamental right') || q.includes('article') || q.includes('history') || q.includes('geography') || q.includes('economy') || q.includes('gdp') || q.includes('inflation') || q.includes('river') || q.includes('harappa') || q.includes('samvidhan') || q.includes('itihas') || q.includes('bhugol')) {
    if (q.includes('constitution') || q.includes('samvidhan') || q.includes('fundamental right') || q.includes('article')) {
      return `### 📜 GK / GS: Indian Constitution & Fundamental Rights

The **Constitution of India** is the supreme legal framework of the country, drafted by the Constituent Assembly headed by **Dr. B.R. Ambedkar** (Chairman of the Drafting Committee). It was adopted on **26 November 1949** and came into force on **26 January 1950**.

#### 🏛️ Key Constitutional Pillars:
- **Preamble**: Declares India a *Sovereign, Socialist, Secular, Democratic Republic* ensuring Justice, Liberty, Equality, and Fraternity.
- **Fundamental Rights (Part III, Articles 12-35)**:
  1. **Right to Equality (Articles 14-18)**: Equality before law (Art 14), abolition of untouchability (Art 17).
  2. **Right to Freedom (Articles 19-22)**: Six democratic freedoms (Art 19), **Right to Life and Personal Liberty (Article 21)**, Right to Education (Article 21A).
  3. **Right against Exploitation (Articles 23-24)**: Prohibition of human trafficking & child labor.
  4. **Right to Freedom of Religion (Articles 25-28)**: Freedom of conscience and faith practice.
  5. **Cultural and Educational Rights (Articles 29-30)**: Protection of minorities.
  6. **Right to Constitutional Remedies (Article 32)**: Writs (Habeas Corpus, Mandamus, Prohibition, Quo-Warranto, Certiorari). Dr. Ambedkar termed Article 32 the **"Heart and Soul of the Constitution"**.

💡 **Pro-Tip**: 42nd Constitutional Amendment Act (1976) is known as the **"Mini Constitution"** because it added the words *Socialist, Secular, and Integrity* to the Preamble and introduced Fundamental Duties (Part IVA, Article 51A)!`;
    }

    if (q.includes('history') || q.includes('itihas') || q.includes('harappa') || q.includes('ashoka')) {
      return `### 📜 GK / GS: Overview of Indian History

1. 🏺 **Ancient India**:
   - **Indus Valley Civilization (2500–1750 BCE)**: Famous for urban town planning, grid systems, baked brick architecture, the Great Bath at Mohenjo-daro, and dockyards at Lothal.
   - **Mauryan Empire (322–185 BCE)**: Founded by Chandragupta Maurya with Chanakya (Kautilya, author of *Arthashastra*). Emperor Ashoka embraced Buddhism after the Kalinga War (261 BCE) and propagated Dhamma through rock edicts.
   - **Gupta Golden Age (320–550 CE)**: Remarkable advancements in mathematics (Aryabhata invented 0 and decimal system), astronomy, and classical Sanskrit literature (Kalidasa).

2. 🏰 **Medieval India**:
   - **Delhi Sultanate (1206–1526 CE)**: Slave, Khalji, Tughlaq, Sayyid, and Lodi dynasties.
   - **Mughal Empire (1526–1857 CE)**: Founded by Babur after 1st Battle of Panipat. Akbar established religious tolerance (*Sulh-i-Kul*) and the Mansabdari system.
   - **Maratha Empire**: Founded by Chhatrapati Shivaji Maharaj with guerrilla warfare tactics (*Ganimi Kava*).

3. 🇮🇳 **Modern India & Freedom Struggle**:
   - **1857 Revolt**: First War of Independence; ended British East India Company rule and instituted the British Crown Raj.
   - **National Movement**: Indian National Congress formed in 1885. Mahatma Gandhi launched Non-Cooperation (1920), Salt Satyagraha / Civil Disobedience (1930), and Quit India Movement (1942), leading to independence on **15 August 1947**.`;
    }

    return `### 📜 GK & General Studies (GS) Knowledge Hub

Aap General Knowledge aur General Studies ke kisi bhi topic par guidance le sakte hain:
- **Indian Polity**: Preamble, Articles, Parliament, President, Supreme Court, Panchayati Raj.
- **Geography**: Indian Himalayas, Peninsular Plateau, River Systems (Ganga, Indus, Brahmaputra, Godavari), Monsoons.
- **Indian Economy**: GDP calculations, Inflation (CPI vs WPI), RBI Monetary Policy (Repo Rate), Fiscal deficit.
- **General Science**: Daily life physics, chemistry, and environmental science.

Aap apna GK/GS topic poochiye, main factual, accurate aur exam-ready points provide karungi!`;
  }

  // 6. Current Affairs & National Initiatives
  if (q.includes('current affair') || q.includes('isro') || q.includes('chandrayaan') || q.includes('aditya') || q.includes('gaganyaan') || q.includes('indiaai') || q.includes('summit') || q.includes('brics') || q.includes('g20') || q.includes('samachar')) {
    return `### 🌍 Current Affairs & National Strategic Initiatives

1. 🚀 **ISRO Space Exploration Milestones**:
   - **Chandrayaan-3**: Historic mission making India the **1st nation in human history to soft-land near the Moon's South Pole** on 23 August 2023 (now celebrated as National Space Day).
   - **Aditya-L1**: India's first dedicated solar space observatory stationed at the Sun-Earth Lagrangian Point 1 (L1), continuously studying the solar corona and coronal mass ejections.
   - **Gaganyaan Program**: India's flagship human spaceflight mission aiming to send Indian astronauts (Vyomnauts) to a $400\\text{ km}$ Low Earth Orbit.

2. 🤖 **IndiaAI Mission (₹10,372 Crore Allocation)**:
   - Approved by the Union Cabinet to establish sovereign compute capacity of **10,000+ GPUs**.
   - Fosters indigenous multimodal foundational models, democratizes AI access for student researchers, and strengthens AI datasets via the IndiaAI Datasets Platform.

3. 🌐 **Global Geopolitics & Summits**:
   - Expansion of **BRICS** to include new member countries.
   - Accelerated transition towards Green Hydrogen, solar energy grids, and domestic semiconductor manufacturing fabrication units (India Semiconductor Mission).

Aap kisi bhi current affairs topic ka deep-dive analysis pooch sakte hain!`;
  }

  // 7. Google Gemini & Cloud AI
  if (q.includes('gemini') || q.includes('cloud ai') || q.includes('bigquery') || q.includes('gcp') || q.includes('vertex')) {
    return `**Google Gemini & Cloud AI Collaboration**:

- **Google Gemini**: Google's most capable multimodal AI model architecture (Gemini 1.5 Flash & Pro, Gemini 2.0). It features a native 1M+ token context window, state-of-the-art multimodal reasoning across text, code, audio, and video, and low-latency response generation.
- **Google Cloud AI Ecosystem**:
  - **BigQuery & BigQuery ML**: Serverless, highly scalable enterprise data warehouse allowing direct SQL queries over terabytes of data and in-database ML modeling.
  - **Vertex AI**: Unified platform for training, tuning, and deploying generative AI and custom machine learning models at enterprise scale.
  - **Cloud AI Integration**: Powers this portfolio's real-time knowledge ingestion, voice processing, and natural conversational reasoning.

Himanshu leverages these data analytics and cloud principles in his projects! Would you like to see how he uses SQL and Python for data analysis?`;
  }

  // 8. AI & Machine Learning Questions
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

  // 9. National & International Trends
  if (q.includes('national') || q.includes('international') || q.includes('trend') || q.includes('news') || q.includes('global') || q.includes('world')) {
    return `Here are key **National & Global AI Developments**:

- **National (IndiaAI Mission)**: The Indian government approved the ₹10,372 crore IndiaAI Mission to democratize compute access (10,000+ GPUs), foster indigenous AI foundation models, and empower student researchers.
- **Global AI Trends**:
  - **Agentic Workflows**: Shifting from simple prompts to autonomous agent swarms capable of reasoning and planning.
  - **Multimodal AI**: Seamless blending of text, code, audio, and computer vision.
  - **Small Language Models (SLMs)**: High-efficiency edge models designed for localized, low-latency computing.

Himanshu tracks these advancements to apply modern AI/ML tooling to practical real-world data problems!`;
  }

  // 10. 30-Second Pitch
  if (q.includes('pitch') || q.includes('30-second') || q.includes('who is') || (q.includes('himanshu') && (q.includes('about') || q.includes('kya')))) {
    return `Himanshu Kumar is a final-year **B.Tech (CSE-IT)** student at IIMT College of Engineering (AKTU) targeting **Data Analyst internships** and entry-level roles.

He has proven hands-on experience in **Python, SQL, Exploratory Data Analysis (EDA), and Data Cleaning**, having analyzed **8,787 Netflix catalog titles**. Additionally, he has built interactive software with Three.js and holds 5 industry certifications in Data Analytics, Python, and AI/ML.

Would you like to know more about his **Netflix analysis project** or his **technical skills**?`;
  }

  // 11. Skills
  if (q.includes('skill') || q.includes('technolog') || q.includes('stack') || q.includes('tools')) {
    return `Here is a summary of Himanshu's verified technical skills:

- **Data Analytics & BI**: Python, Pandas, NumPy, Data Cleaning, EDA, Matplotlib, Power BI, Microsoft Excel.
- **Databases & Querying**: SQL (Aggregations, JOINs, Group By, Filtering), MySQL, MongoDB.
- **Programming**: Python, SQL, C++, Java, JavaScript (ES6+).
- **Web & Tools**: HTML5, CSS3, Tailwind CSS, Bootstrap, Three.js, Git, GitHub Actions, Jupyter Notebook.

Would you like to see how he applies these tools in his **Netflix project**?`;
  }

  // 12. Netflix Analysis Project
  if (q.includes('netflix') || q.includes('sales') || q.includes('content analysis')) {
    return `Himanshu executed the **Netflix Content Analysis Project** during his internship at **Auspify Technologies**:

- **Catalog Scale**: Thorough exploratory analysis on **8,787 clean movie and TV show titles**.
- **Important Note**: This project analyzes **content catalog distribution and trends**, *not* revenue or sales data (despite the repository naming).
- **Core Insights**: Quantified the international content expansion across North America, Europe, and Asia, release volume spikes over the past decade, and audience rating distributions (TV-MA, TV-14).
- **Stack**: Python, Pandas, NumPy, Matplotlib, Jupyter Notebook, ReportLab.
- **Repository**: [github.com/himanshu161098/Netfix-Sales](https://github.com/himanshu161098/Netfix-Sales).

Shall I share his **GitHub profile** or evaluate his fit for an opening you have?`;
  }

  // 13. Internship / Job Fit
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

  // 14. Contact
  if (q.includes('contact') || q.includes('email') || q.includes('reach') || q.includes('linkedin')) {
    return `You can connect with Himanshu directly through:

- **LinkedIn**: [linkedin.com/in/himanshu-kumar-1618hks/](https://www.linkedin.com/in/himanshu-kumar-1618hks/)
- **GitHub**: [github.com/himanshu161098](https://github.com/himanshu161098)
- **Portfolio**: [himanshu161098.github.io/personal-portfolio/](https://himanshu161098.github.io/personal-portfolio/)
- **Email**: \`himanshukumarsingh161098@gmail.com\`

*(Note: Phone numbers are not shared publicly for privacy).* Would you like to review his resume or project portfolio?`;
  }

  // 15. Education
  if (q.includes('education') || q.includes('college') || q.includes('degree') || q.includes('aktu')) {
    return `Himanshu's academic background:

- **B.Tech in Computer Science & Engineering (Information Technology)** at **IIMT College of Engineering, Greater Noida (AKTU)**, ongoing (Final Year, 2026).
- **Senior Secondary (Class XII)**: Bihar School Examination Board (BSEB), 2023 (67.8%).
- **Secondary (Class X)**: Bihar School Examination Board (BSEB), 2021 (68.2%).

Would you like to explore his technical certifications?`;
  }

  // 16. Python / Coding assistance
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
  return `Hello! I'm **Maya**, Himanshu's AI & Universal Problem-Solving Tutor.

Aap mujhse pooch sakte hain:
- 📐 **Mathematics & Quantitative Aptitude** (Calculus, Algebra, Probability, Equations)
- ⚡ **Physics** (Mechanics, Ohm's Law, Motion equations, Energy, Optics)
- 🧪 **Chemistry** (Chemical equations, pH calculations, Photosynthesis, Organic reactions)
- 🧬 **Biology** (Cell structures, Mitochondria, Mitosis vs Meiosis, Human heart)
- 📜 **General Knowledge & GS** (Indian Constitution, Fundamental Rights, History, Geography, Economy)
- 🇮🇳 **Current Affairs & Tech** (IndiaAI Mission, ISRO missions, Global AI summits)
- 📂 **Himanshu's Portfolio & Projects** (Netflix Analysis, Skills, Contact, JD match)

Aap type karke ya microphone 🎙️ dabakar bol kar sawaal pooch sakte hain!`;
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
        <img src="assets/prachi-logo.png" alt="AI Assistant" class="cb-teaser-logo">
        <span>👋 Chat with <strong>Maya</strong> (Voice &amp; STEM AI)!</span>
        <button class="cb-teaser-close" id="cbTeaserClose" aria-label="Dismiss notification">&times;</button>
      </div>
      <button class="cb-floating-btn" id="cbFloatingBtn" aria-label="Open Prachi AI Assistant" aria-haspopup="dialog" aria-expanded="false">
        <img src="assets/prachi-logo.png" alt="Prachi AI Logo" class="cb-floating-logo-img" id="cbBtnIcon">
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
            <img src="assets/prachi-logo.png" alt="AI Assistant Logo" class="cb-header-avatar-img">
            <span class="cb-avatar-dot"></span>
          </div>
          <div class="cb-header-info">
            <div class="cb-title">
              Maya • Universal AI Tutor
              <span class="cb-title-tag">Gemini + Cloud AI</span>
            </div>
            <span class="cb-subtitle">Math, Science, GK &amp; Portfolio • 👧 Girl Voice Live</span>
          </div>
        </div>
        <div class="cb-header-actions">
          <button class="cb-icon-btn cb-voice-toggle-btn" id="cbVoiceToggleBtn" title="Toggle Voice Mode (Speaks answers aloud in Maya's female voice)" aria-label="Toggle Auto-Speak">
            <i class="fa-solid fa-volume-high" id="cbVoiceToggleIcon" aria-hidden="true"></i>
          </button>
          <a href="chatgpt.html" class="cb-icon-btn" title="Open Fullscreen Prachi AI App" aria-label="Open Fullscreen Prachi AI App">
            <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
          </a>
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
          <span><i class="fa-solid fa-microphone-lines"></i> Maya is Listening... Speak in English, Hindi, or Hinglish</span>
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
            placeholder="Ask any Math, Science, GK question or speak via mic..."
            maxlength="${MAX_INPUT_LENGTH}"
            aria-label="Your question for Maya AI"
          ></textarea>
          <button type="button" class="cb-mic-btn" id="cbMicBtn" title="Speak via Microphone (Hindi / English)" aria-label="Voice Input">
            <i class="fa-solid fa-microphone" id="cbMicIcon" aria-hidden="true"></i>
          </button>
          <button type="submit" class="cb-send-btn" id="cbSendBtn" aria-label="Send message" disabled>
            <i class="fa-solid fa-arrow-up" aria-hidden="true"></i>
          </button>
        </form>
        <div class="cb-footer-meta">
          <span>Maya: Girl Voice Assistant • STEM &amp; GK Tutor</span>
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
