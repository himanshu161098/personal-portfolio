import React from 'react';
import { Sparkles, Mic, Sun, Moon, LogIn, LogOut, ShieldAlert, Cpu, HelpCircle, ArrowLeft, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentModel: string;
  onModelChange: (model: string) => void;
  onOpenVoice: () => void;
  onOpenAuth: () => void;
  onOpenTour: () => void;
  theme: string;
  onToggleTheme: () => void;
  onToggleMobileSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentModel,
  onModelChange,
  onOpenVoice,
  onOpenAuth,
  onOpenTour,
  theme,
  onToggleTheme,
  onToggleMobileSidebar,
}) => {
  const { user, logout } = useAuth();

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
          href="/"
          className="btn btn-secondary btn-sm nav-portfolio-link"
          title="Return to Personal Portfolio"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', color: 'inherit' }}
        >
          <ArrowLeft size={15} style={{ color: 'var(--accent-indigo)' }} />
          <span>Portfolio</span>
        </a>
        {/* Model Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-surface)', padding: '4px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <Cpu size={15} style={{ color: 'var(--accent-indigo)' }} />
          <select
            value={currentModel}
            onChange={(e) => onModelChange(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              fontWeight: 500,
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="gemini" style={{ background: '#0f172a' }}>Prachi AI (Human Companion & STEM ✨)</option>
            <option value="local_heuristic" style={{ background: '#0f172a' }}>Prachi Local Heuristic (Offline)</option>
            <option value="claude" style={{ background: '#0f172a' }}>Anthropic Claude 3.5 Sonnet</option>
            <option value="openai" style={{ background: '#0f172a' }}>OpenAI GPT-4o</option>
          </select>
        </div>

        {/* Voice Trigger */}
        <button
          className="btn btn-secondary btn-sm"
          onClick={onOpenVoice}
          title="Interactive Voice Assistant"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Mic size={15} style={{ color: 'var(--accent-cyan)' }} />
          <span>Voice</span>
        </button>

        {/* Tour Guide Button */}
        <button
          className="btn btn-secondary btn-sm"
          onClick={onOpenTour}
          title="Interactive Feature Guide"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <HelpCircle size={15} style={{ color: 'var(--accent-indigo)' }} />
          <span>Tour</span>
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

        {/* User Account / Auth */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.86rem', fontWeight: 600 }}>{user.fullName}</div>
              <div style={{ fontSize: '0.72rem', color: user.role === 'admin' ? 'var(--accent-amber)' : 'var(--text-muted)' }}>
                {user.role === 'admin' ? 'Administrator' : 'Verified Member'}
              </div>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={logout}
              title="Sign Out"
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <button className="btn btn-primary btn-sm" onClick={onOpenAuth}>
            <LogIn size={15} />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
