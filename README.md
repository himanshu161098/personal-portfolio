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

3. **Manually Sync GitHub Activity:**
   ```bash
   node scripts/sync-activity.js
   ```

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
