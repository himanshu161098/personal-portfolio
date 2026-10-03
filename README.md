# 🚀 Himanshu Kumar - Personal Developer Portfolio

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/himanshu161098/personal-portfolio?style=for-the-badge&color=00f2fe)
![GitHub forks](https://img.shields.io/github/forks/himanshu161098/personal-portfolio?style=for-the-badge&color=4facfe)
![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)

**Interactive 3D Futuristic Portfolio & Developer Dossier**

[🌐 View Live Site](https://himanshu161098.github.io/personal-portfolio/) • [💼 LinkedIn Profile](https://www.linkedin.com/in/himanshu-kumar-1618hks/) • [📧 Get in Touch](mailto:himanshukumarsingh161098@gmail.com)

</div>

---

## 🌟 Highlights

A state-of-the-art interactive developer portfolio engineered with modern vanilla web technologies, dynamic 3D WebGL visualizations, real-time GitHub telemetry, and an automated GitHub Actions sync workflow.

- 🌌 **Interactive 3D WebGL Canvas**: Three.js particle constellation & floating 3D geometric matrix reacting to cursor movement and scroll dynamics.
- 🎯 **Cyberpunk HUD & Telemetry**: Dynamic metrics HUD displaying live status, uptime, and active tech stacks.
- 🔄 **Automated GitHub & Social Sync**: Built-in GitHub Action (`sync-portfolio.yml`) running a cron worker (`scripts/sync-activity.js`) that automatically updates latest public repos, events, and stats directly into `data/social_feed.json`.
- 📁 **Detailed Project Case Studies**: Interactive modals and project showcases with live previews, technology tags, and source code links.
- 📱 **Ultra-Responsive Glassmorphic UI**: Tailored with custom typography (`Plus Jakarta Sans` & `JetBrains Mono`), sleek gradient borders, and mobile-first design.

---

## 🛠️ Tech Stack

- **Frontend Core**: HTML5, CSS3, Modern JavaScript (ES6+)
- **Visuals & 3D**: Three.js / WebGL Canvas, CSS 3D Transforms, Custom Cyber Cursor
- **Icons & Typography**: Font Awesome 6, Google Fonts (Plus Jakarta Sans, JetBrains Mono)
- **CI/CD & Automation**: GitHub Actions, Node.js Cron Sync
- **Data Source**: Live GitHub REST API & Local JSON Feed Store

---

## 📂 Project Architecture

```
Personal Portfolio/
│
├── .github/
│   └── workflows/
│       └── sync-portfolio.yml   # Auto-sync action for GitHub activities
│
├── assets/                      # Media assets, icons & images
├── data/
│   └── social_feed.json         # Real-time data feed & synced statistics
│
├── scripts/
│   └── sync-activity.js         # Automated sync fetcher script
│
├── index.html                   # Main portfolio layout & markup
├── style.css                    # Futuristic dark-mode design system & animations
├── script.js                    # 3D canvas, cursor effects, navigation & UI logic
├── ai-engine.js                 # Universal STEM, Math, Coding & Dynamic AI Intelligence Engine
├── prachi.html                  # Standalone Prachi Human-like AI Companion web application with 3D colorful logo
├── prachi.css                   # Prachi AI OpenAI dark aesthetic & sidebar styles
├── prachi.js                    # Prachi AI multi-chat state, models & female voice engine
│
├── chatbot.css                  # Floating portfolio chatbot cyber glassmorphism styles
├── chatbot.js                   # Dedicated Quantix AI Assistant widget (projects, skills & resume)
│
├── worker/                      # Cloudflare Worker serverless AI proxy (Gemini + Claude)
├── .gitignore                   # Git ignore specifications
└── README.md                    # Project documentation
```

---

## 🚀 Getting Started

### Local Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/himanshu161098/personal-portfolio.git
   cd personal-portfolio
   ```

2. **Open in browser:**
   Open `index.html` in your favorite web browser or run using a lightweight local server:
   ```bash
   # Using VS Code Live Server extension OR Python:
   python -m http.server 8000
   ```
   Navigate to `http://localhost:8000`.

3. **Manually Sync GitHub Activity & Knowledge Base:**
   ```bash
   node scripts/sync-activity.js
   ```

---

## 🤖 Prachi: AI + Universal Academic Tutor & Female Voice Assistant

The portfolio features **Prachi**, an advanced dark glassmorphic AI Assistant & Universal Tutor powered by **Google Gemini & Cloud AI** (with Anthropic Claude failover) via a dedicated Cloudflare Worker serverless proxy:

```
[Portfolio Visitor] ◄──(Voice / STT / Female TTS)──► [chatbot.js Widget / prachi.html] ◄──► [Cloudflare Worker Proxy]
                                                                                                  │
                                                                                   ┌──────────────┴──────────────┐
                                                                                   ▼                             ▼
                                                                          [Google Gemini AI]            [Anthropic Claude]
                                                                                   │
                                                         ┌─────────────────────── Fetch & 5-min Cache ───────────┴──────────────────────┐
                                                         ▼                                                                               ▼
                                               [data/knowledge.md]                                                             [data/social_feed.json]
                               (Portfolio + STEM + GK/GS Academic Knowledge)                                                  (Auto-synced GitHub data)
```

### 🌟 Key Superpowers:
- 👧 **Female Voice Assistant ("Prachi")**: Features sweet, articulate female voice synthesis (pitch 1.18, rate 0.98, tuned for Hindi & English) plus real-time hands-free microphone speech-to-text.
- 📐 **Universal Subject Problem Solver**:
  - **Mathematics**: Calculus (derivatives, integrals), Algebra, Quadratic equations, Trigonometry, Probability, Percentages.
  - **Physics**: Kinematics numericals, Newton's Laws, Work-Energy, Ohm's Law, Projectile motion, Optics.
  - **Chemistry**: Balanced chemical equations, Photosynthesis, pH calculations, Acids & Bases, Organic mechanisms ($S_N1/S_N2$), Periodic table trends.
  - **Biology**: Cell biology (Mitochondria powerhouse), Mitosis vs Meiosis, DNA double helix, Human heart blood circulation.
  - **General Knowledge & GS**: Indian Constitution (Preamble, Fundamental Rights, Articles), History (Harappa, Ashoka, Freedom movement), Geography (Rivers of India), Economy (GDP, Inflation, RBI).
  - **Current Affairs**: IndiaAI Mission (10,000+ GPUs), ISRO space missions (Chandrayaan-3, Aditya-L1, Gaganyaan).
- 📂 **Himanshu's Portfolio Dossier**: Answers on skills, projects, certifications, education, and honest job-description match analysis.
- 💬 **Multi-Language Fluency**: Seamlessly interacts in English, Hindi, or conversational Hinglish.

---

## 🔄 How to update the chatbot's knowledge

The chatbot automatically stays updated with your latest achievements, projects, and certifications without changing any code or system prompts:

1. **Step 1: Edit `data/knowledge.md`**  
   Add your new project, skill, certification, or update under the corresponding section. Update the `Last updated: YYYY-MM-DD` date at the top.
2. **Step 2: Commit and Push to GitHub**  
   ```bash
   git add data/knowledge.md
   git commit -m "docs: add new project and update skills in knowledge base"
   git push origin main
   ```
3. **Step 3: Auto-Refresh within 5 Minutes**  
   Once pushed, GitHub Pages serves the updated markdown file. The Cloudflare Worker cache automatically expires after 5 minutes and immediately streams answers incorporating your latest updates!

*(Note: Public GitHub repository changes and commits are also automatically synced into `data/social_feed.json` and the bottom of `data/knowledge.md` every 6 hours via `.github/workflows/sync-portfolio.yml`.)*

---

## 🧪 Comprehensive Chatbot Test Checklist

Use this checklist to verify that all functional, academic, stylistic, edge-case, and voice behaviors operate properly:

| Test Case | Prompt / Action | Expected Behavior |
| :--- | :--- | :--- |
| **1. Girl Voice Persona** | *"Tum kaun ho aur tumhari aawaz kaisi hai?"* | Prachi introduces herself as Himanshu's AI & Academic Tutor speaking in a sweet girl voice; clicks "Listen" to hear speech. |
| **2. Mathematics Problem** | *"Solve derivative of x^3 + 5x^2 - 7x + 9"* | Provides 5-point solution: Given, Power Rule formulas, Step-by-Step differentiation, boxed final answer ($3x^2 + 10x - 7$), and tangent slope intuition. |
| **3. Physics Numerical** | *"A car accelerates at 2m/s^2 for 5s from rest. Find velocity and distance"* | Solves with SI units: $v = u + at = 10\text{ m/s}$, $s = ut + \frac{1}{2}at^2 = 25\text{ m}$. |
| **4. Chemistry Reaction** | *"Explain photosynthesis chemical equation"* | Shows balanced equation $6\text{CO}_2 + 6\text{H}_2\text{O} \rightarrow \text{C}_6\text{H}_{12}\text{O}_6 + 6\text{O}_2$, reactants, products, and light/dark reactions. |
| **5. Biology Mechanism** | *"Why is mitochondria called powerhouse of the cell?"* | Explains double membrane, cristae, matrix, ATP synthesis (36-38 ATP per glucose), and independent mtDNA. |
| **6. GK / Indian Constitution** | *"Indian Constitution ke Fundamental Rights batao"* | Explains Part III (Articles 12-35), Right to Equality, Freedom (Art 21), and Article 32 (Heart and Soul of Constitution). |
| **7. Current Affairs** | *"IndiaAI Mission aur ISRO Chandrayaan-3 ke baare me batao"* | Summarizes ₹10,372 Cr IndiaAI Mission (10,000+ GPUs) and Chandrayaan-3 lunar south pole achievement. |
| **8. 30-Second Pitch** | *"Give me a 30-second pitch about Himanshu"* | Concisely explains final-year B.Tech CSE-IT at IIMT (AKTU), targeting Data Analyst internships, highlights Python, SQL, and 8,787 Netflix catalog EDA. |
| **9. Core Skills** | *"What are his strongest skills?"* | Summarizes Python, SQL, Pandas, NumPy, Data Cleaning, EDA, Matplotlib, Power BI, Excel, and Git. |
| **10. Netflix Project** | *"Tell me about the Netflix analysis project"* | Details catalog analysis across 8,787 clean titles; explicitly clarifies it evaluates catalog content and NOT revenue/sales. |
| **11. Internship Fit** | *"Is he a good fit for a Data Analyst internship?"* | Gives honest fit breakdown: highlights data wrangling and SQL strengths while noting he is a final-year student, not a senior lead. |
| **12. Contact Options** | *"How can I contact Himanshu?"* | Provides LinkedIn and Email (`himanshukumarsingh161098@gmail.com`); does **NOT** reveal or output any phone number. |
| **13. Multi-language (Hinglish)** | *"Himanshu ke projects ke baare me batao"* | Responds warmly in natural Hinglish or Hindi while keeping all factual project points intact. |
| **14. Hands-Free Voice Input** | *Click Microphone button 🎙️ and speak* | Transcribes speech live into input box and allows sending question via voice. |
| **15. Auto-Speak Toggle** | *Click Volume icon in header* | Automatically speaks Prachi's replies aloud using natural female voice. |
| **16. Rate Limiting Check** | *Send > 20 requests within 10 minutes* | Serverless proxy responds with HTTP 429 and displays a friendly cooldown notice with retry capability. |

---

## 👤 Author

**Himanshu Kumar**
- 🎓 Final-year B.Tech (CSE-IT) at IIMT College of Engineering, AKTU
- 💼 LinkedIn: [@himanshu-kumar-1618hks](https://www.linkedin.com/in/himanshu-kumar-1618hks/)
- 💻 GitHub: [@himanshu161098](https://github.com/himanshu161098)
- ✉️ Email: [himanshukumarsingh161098@gmail.com](mailto:himanshukumarsingh161098@gmail.com)

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
