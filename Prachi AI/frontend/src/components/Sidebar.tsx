import React from 'react';
import {
  MessageSquare,
  LayoutDashboard,
  Brain,
  FileText,
  Eye,
  TrendingUp,
  Wrench,
  Search,
  FileCode,
  Shield,
  ChevronLeft,
  ChevronRight,
  Database
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export type NavView =
  | 'chat'
  | 'dashboard'
  | 'memory'
  | 'rag'
  | 'vision'
  | 'forecasting'
  | 'tools'
  | 'research'
  | 'artifacts'
  | 'admin';

interface SidebarProps {
  currentView: NavView;
  onSelectView: (view: NavView) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  collapsed,
  onToggleCollapse,
}) => {
  const { user } = useAuth();

  const navItems: Array<{ id: NavView; label: string; icon: React.ReactNode; badge?: string; adminOnly?: boolean }> = [
    { id: 'chat', label: 'AI Chat & Assistant', icon: <MessageSquare size={18} /> },
    { id: 'dashboard', label: 'Personal Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'memory', label: 'Memory Bank', icon: <Brain size={18} />, badge: 'Isolated' },
    { id: 'rag', label: 'Knowledge Base (RAG)', icon: <FileText size={18} /> },
    { id: 'vision', label: 'Multimodal Vision', icon: <Eye size={18} /> },
    { id: 'forecasting', label: 'ML Forecasting', icon: <TrendingUp size={18} /> },
    { id: 'tools', label: 'Tool Sandbox & Policy', icon: <Wrench size={18} /> },
    { id: 'research', label: 'Research Studio', icon: <Search size={18} /> },
    { id: 'artifacts', label: 'Workspace Artifacts', icon: <FileCode size={18} /> },
    { id: 'admin', label: 'Admin & Observability', icon: <Shield size={18} />, adminOnly: true },
  ];

  return (
    <aside className="app-sidebar" style={{ width: collapsed ? '72px' : '260px' }}>
      <div className="sidebar-header">
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={16} style={{ color: 'var(--accent-indigo)' }} />
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>MODULES</span>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="btn btn-secondary btn-sm"
          style={{ padding: '6px', margin: collapsed ? '0 auto' : '0' }}
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          if (item.adminOnly && user?.role !== 'admin') return null;

          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelectView(item.id)}
              title={collapsed ? item.label : undefined}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {item.icon}
              </div>
              {!collapsed && (
                <>
                  <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.label}
                  </span>
                  {item.badge && <span className="nav-badge">{item.badge}</span>}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {!collapsed && (
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span>Security</span>
            <span style={{ color: 'var(--accent-emerald)' }}>Enforced</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Tenant Isolation</span>
            <span style={{ color: 'var(--accent-indigo)' }}>Active</span>
          </div>
        </div>
      )}
    </aside>
  );
};
