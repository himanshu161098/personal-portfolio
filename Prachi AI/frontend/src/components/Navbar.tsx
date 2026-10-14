import React from 'react';
import { Sparkles, Mic, Sun, Moon, ShieldAlert, Cpu, HelpCircle, ArrowLeft, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentModel: string;
  onModelChange: (model: string) => void;
  onOpenVoice: () => void;
  onOpenAuth?: () => void;
  onOpenTour: () => void;
  theme: string;
  onToggleTheme: () => void;
  onToggleMobileSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentModel,
  onModelChange,
  onOpenVoice,
  onOpenTour,
  theme,
  onToggleTheme,
  onToggleMobileSidebar,
}) => {
  const { user } = useAuth();

  return (
    <header className="top-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {onToggleMobileSidebar && (
          <button
            className="btn btn-secondary btn-sm mobile-menu-toggle-btn"
            onClick={onToggleMobileSidebar}
            title="Toggle Navigation Menu"
          >
            <Menu size={18} />
          </button>
        )}
        <div className="brand-badge">
          <div className="brand-logo-icon" style={{ padding: '2px', background: 'transparent', boxShadow: 'none' }}>
            <img
              src="./assets/prachi-logo.png"
              alt="Prachi AI"
              style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 2px 8px rgba(99,102,241,0.5))' }}
              onError={(e) => {
                const el = e.target as HTMLImageElement;
                if (!el.src.includes('prachi-logo.svg')) {
                  el.src = './assets/prachi-logo.svg';
                }
              }}
            />
          </div>
          <div>
            <span className="brand-name">Prachi AI</span>
            <span className="brand-version" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '8px' }}>v1.0-factory</span>
          </div>
          <div className="status-pill nav-status-pill" style={{ marginLeft: '12px' }}>
            <span className="status-dot"></span>
            <span>Core Operational</span>
          </div>
        </div>
      </div>

      <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Back to Portfolio Link */}
        <a
          href="../index.html"
          onClick={(e) => {
            e.preventDefault();
            if (window.history.length > 1 && document.referrer && (document.referrer.includes('index.html') || document.referrer.includes('portfolio') || document.referrer.includes('Level%201') || document.referrer.includes('Level 1'))) {
              window.history.back();
            } else {
              try {
                window.location.href = new URL('../index.html', window.location.href).href;
              } catch {
                window.location.href = '../index.html';
              }
            }
          }}
          className="btn btn-secondary btn-sm nav-portfolio-link"
          title="Return to Personal Portfolio"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={15} style={{ color: 'var(--accent-indigo)' }} />
          <span className="nav-btn-text">Portfolio</span>
        </a>
        {/* Prachi AI Tag & Engine Badge */}
        <div className="prachi-tag-badge" title="Prachi AI Intelligent Companion">
          <div className="prachi-tag-icon-wrap">
            <Cpu size={14} className="prachi-tag-sparkle" />
          </div>
          <span className="prachi-tag-brand">Prachi AI</span>
          <span className="prachi-tag-pill">Pro Active</span>
          <select
            value={currentModel}
            onChange={(e) => onModelChange(e.target.value)}
            aria-label="Select AI Engine"
            className="prachi-tag-select"
          >
            <option value="gemini" style={{ background: '#0f172a', color: '#f8fafc' }}>Prachi Neural Core (Active)</option>
            <option value="local_heuristic" style={{ background: '#0f172a', color: '#f8fafc' }}>Prachi AI Offline (Local Fast)</option>
            <option value="claude" style={{ background: '#0f172a', color: '#f8fafc' }}>Prachi AI — Claude Reasoning</option>
            <option value="openai" style={{ background: '#0f172a', color: '#f8fafc' }}>Prachi AI — GPT-4o Engine</option>
          </select>
        </div>

        {/* Voice Trigger */}
        <button
          className="btn btn-secondary btn-sm nav-voice-btn"
          onClick={onOpenVoice}
          title="Interactive Voice Assistant"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Mic size={15} style={{ color: 'var(--accent-cyan)' }} />
          <span className="nav-btn-text">Voice</span>
        </button>

        {/* Tour Guide Button */}
        <button
          className="btn btn-secondary btn-sm nav-tour-btn"
          onClick={onOpenTour}
          title="Interactive Feature Guide"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <HelpCircle size={15} style={{ color: 'var(--accent-indigo)' }} />
          <span className="nav-btn-text">Tour</span>
        </button>

        {/* Theme Toggle */}
        <button
          className="btn btn-secondary btn-sm"
          onClick={onToggleTheme}
          title="Toggle Light/Dark Theme"
          style={{ padding: '6px 10px' }}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Open Access Workspace Badge (No login barrier required) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            className="status-pill"
            style={{
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              color: 'var(--accent-emerald)',
              padding: '4px 10px',
              fontSize: '0.74rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderRadius: '999px'
            }}
            title="Instant Open Access — Anyone can explore Prachi AI freely"
          >
            <span
              className="status-dot"
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--accent-emerald)',
                boxShadow: '0 0 8px var(--accent-emerald)'
              }}
            ></span>
            <span>Open Access</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {user?.fullName || 'Guest User'}
            </div>
            <div style={{ fontSize: '0.70rem', color: 'var(--accent-cyan)' }}>
              Ready to Chat
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
