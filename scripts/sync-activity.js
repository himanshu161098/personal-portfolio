/**
 * Automated Activity & Profile Sync Script
 * Runs in GitHub Actions or locally with: node scripts/sync-activity.js
 * Keeps data/social_feed.json fresh with latest GitHub repos and events
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const USERNAME = process.env.GH_USERNAME || 'himanshu161098';
const FEED_PATH = path.join(__dirname, '..', 'data', 'social_feed.json');

const KNOWN_REPO_DESCRIPTIONS = {
  "UNO-playing-Card-": "Interactive UNO playing card game featuring smooth animations, responsive layout, and modular component-based architecture built with HTML, CSS, JavaScript, and Bootstrap/Tailwind.",
  "Netfix-Sales": "Comprehensive Netflix sales data analysis and visualization utilizing Python, Pandas, and Jupyter Notebooks.",
  "Happy-birthday-Day-": "Interactive web application with creative DOM animations, sound effects, and custom UI components."
};

function fetchJson(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const defaultHeaders = {
      'User-Agent': 'Portfolio-Sync-Agent',
      'Accept': 'application/vnd.github.v3+json',
      ...headers
    };
    if (process.env.GITHUB_TOKEN) {
      defaultHeaders['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    https.get(url, { headers: defaultHeaders }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    }).on('error', reject);
  });
}

async function runSync() {
  console.log(`[Auto-Sync] Fetching latest info for @${USERNAME}...`);
  try {
    let currentFeed = {};
    if (fs.existsSync(FEED_PATH)) {
      try {
        currentFeed = JSON.parse(fs.readFileSync(FEED_PATH, 'utf-8'));
      } catch (e) {
        currentFeed = {};
      }
    }

    const [profile, repos, events] = await Promise.all([
      fetchJson(`https://api.github.com/users/${USERNAME}`),
      fetchJson(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=8`),
      fetchJson(`https://api.github.com/users/${USERNAME}/events/public?per_page=10`).catch(() => [])
    ]);

    currentFeed.last_synced = new Date().toISOString();

    // Update GitHub info
    currentFeed.github = {
      username: USERNAME,
      profile_url: profile.html_url || `https://github.com/${USERNAME}`,
      avatar_url: profile.avatar_url,
      name: profile.name || "Himanshu Kumar",
      bio: profile.bio || "Final-year B.Tech (CSE-IT) student | Python, ML & Full-Stack Web Dev",
      public_repos: profile.public_repos,
      followers: profile.followers,
      following: profile.following,
      featured_repos: repos.map(r => ({
        name: r.name,
        description: r.description || KNOWN_REPO_DESCRIPTIONS[r.name] || "Repository created on GitHub",
        html_url: r.html_url,
        language: r.language || (r.name.includes('UNO') ? 'JavaScript' : (r.name.includes('Sales') ? 'Python / Jupyter' : 'HTML/CSS/JS')),
        stargazers_count: r.stargazers_count,
        forks_count: r.forks_count,
        updated_at: r.updated_at
      })),
      recent_events: (events || []).slice(0, 6).map(e => ({
        type: e.type,
        repo: e.repo.name,
        created_at: e.created_at
      }))
    };

    // Ensure LinkedIn section exists
    if (!currentFeed.linkedin) {
      currentFeed.linkedin = {
        profile_url: "https://www.linkedin.com/in/himanshu-kumar-1618hks/",
        name: "Himanshu Kumar",
        headline: "Final-Year B.Tech CSE-IT | Python · Data Analytics · Machine Learning · Full-Stack Web Development",
        connections: "500+",
        posts: [
          {
            id: "post-1",
            date: "Recent Update",
            title: "Excited to share my latest Project: House Security App Using AI! 🚀",
            content: "Developed a smart house security system using JavaScript and machine learning models integrated with Cloud API for real-time threat analysis and automated event alerts based on sensor data inputs. Loving the journey of building AI-driven solutions!",
            tags: ["#MachineLearning", "#AI", "#JavaScript", "#CloudAPI", "#CyberSecurity", "#BTech"],
            likes: 48,
            comments: 12,
            url: "https://www.linkedin.com/in/himanshu-kumar-1618hks/"
          },
          {
            id: "post-2",
            date: "1 week ago",
            title: "Completed 5 Industry-Recognized Certifications in Data Analytics & AI/ML 🎓",
            content: "Thrilled to have completed certifications covering Foundations of Cybersecurity, Data Analysis with Python, Foundations: Data, Data, Everywhere, Introduction to Data Analytics, and Fundamentals of ML & AI. Ready to apply these skills to solve real-world engineering challenges!",
            tags: ["#Certifications", "#Python", "#DataAnalytics", "#ContinuousLearning", "#MachineLearning"],
            likes: 65,
            comments: 16,
            url: "https://www.linkedin.com/in/himanshu-kumar-1618hks/"
          },
          {
            id: "post-3",
            date: "2 weeks ago",
            title: "UNO Playing Card Game Live on GitHub! 🃏🎮",
            content: "Built an interactive UNO playing card game featuring smooth animations, responsive layout, and modular component architecture using HTML, CSS, JavaScript, and Bootstrap/Tailwind CSS. Check out the source code on my GitHub!",
            tags: ["#WebDevelopment", "#JavaScript", "#Frontend", "#GitHub", "#CodingProjects"],
            likes: 39,
            comments: 8,
            url: "https://github.com/himanshu161098/UNO-playing-Card-"
          }
        ]
      };
    }

    fs.writeFileSync(FEED_PATH, JSON.stringify(currentFeed, null, 2), 'utf-8');
    console.log('[Auto-Sync] Successfully updated data/social_feed.json!');

    // Keep Recent GitHub Activity section in data/knowledge.md fresh
    const KNOWLEDGE_PATH = path.join(__dirname, '..', 'data', 'knowledge.md');
    if (fs.existsSync(KNOWLEDGE_PATH) && currentFeed.github && currentFeed.github.featured_repos) {
      try {
        let kbContent = fs.readFileSync(KNOWLEDGE_PATH, 'utf-8');
        const startTag = '<!-- GITHUB_ACTIVITY_START -->';
        const endTag = '<!-- GITHUB_ACTIVITY_END -->';
        if (kbContent.includes(startTag) && kbContent.includes(endTag)) {
          const activityLines = currentFeed.github.featured_repos.map(r => {
            const updatedDate = r.updated_at ? r.updated_at.split('T')[0] : 'Recently';
            return `- **${r.name}**: ${r.description} (Updated: ${updatedDate})`;
          }).join('\n');
          const replacement = `${startTag}\n${activityLines}\n${endTag}`;
          const updatedKb = kbContent.replace(new RegExp(`${startTag}[\\s\\S]*?${endTag}`), replacement);
          fs.writeFileSync(KNOWLEDGE_PATH, updatedKb, 'utf-8');
          console.log('[Auto-Sync] Successfully updated Recent GitHub Activity in data/knowledge.md!');
        }
      } catch (e) {
        console.warn('[Auto-Sync Warning] Could not update knowledge.md activity:', e.message);
      }
    }
  } catch (err) {
    console.error('[Auto-Sync Error]', err.message);
  }
}

runSync();
