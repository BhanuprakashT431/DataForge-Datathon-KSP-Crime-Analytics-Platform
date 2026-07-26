import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { PoliceBadge } from './PoliceBadge';
import { Search, Bell, MonitorPlay, X, Moon, Sun } from 'lucide-react';
import { usePresentation } from '../App';

const NAV_ITEMS = [
  { path: '/command-center',   icon: '🏠', label: 'Command Center',   desc: 'Strategic Overview' },
  { path: '/dashboard',        icon: '📊', label: 'KPI Dashboard',        desc: 'State Metrics' },
  { path: '/workspace',        icon: '📂', label: 'Investigation Workspace', desc: 'Active FIRs & Intel' },
  { path: '/map',             icon: '📍', label: 'Crime Map',         desc: 'Geospatial Hotspots' },
  { path: '/network',         icon: '⬡', label: 'Network Analysis',  desc: 'Criminal Links' },
  { path: '/predictions',     icon: '⚡', label: 'AI Predictions',    desc: 'Risk & Forecasts' },
  { path: '/offenders',       icon: '◎', label: 'Offender Profiles', desc: 'Repeat Offenders' },
  { path: '/sociological',    icon: '🧠', label: 'Sociological Intel',desc: 'Demographic Trends' },
  { path: '/evidence',        icon: '💽', label: 'Evidence Repo',     desc: 'CCTV & forensics' },
  { path: '/reports',         icon: '📋', label: 'Decision Reports',  desc: 'PDF Export & Exec' },
  { path: '/security',        icon: '🛡️', label: 'Security Dashboard', desc: 'Catalyst Edge & Auth' },
  { path: '/ai-governance',   icon: '⚖️', label: 'AI Governance',     desc: 'XAI Audit Log' },
  { path: '/model-monitoring',icon: '📈', label: 'Model Monitoring',  desc: 'Latency & Drift' },
];

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { setPresentation } = usePresentation();
  
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showNotifications, setShowNotifications] = React.useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (e) {
      console.error('Logout error', e);
    }
  };

  return (
    <nav style={{
      position: 'fixed', left: 0, top: 0, bottom: 0, width: 240,
      background: 'var(--gradient-nav)',
      borderRight: '1px solid var(--border-glass)',
      backdropFilter: 'blur(20px)',
      display: 'flex', flexDirection: 'column',
      zIndex: 1000, padding: '0',
    }}>
      {/* Logo */}
      <div style={{
        padding: '20px 18px 16px',
        borderBottom: '1px solid var(--border-glass)',
      }}>
        <NavLink to="/command-center" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #1d4ed8, #1e3a8a)',
              border: '1px solid var(--accent-gold)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, boxShadow: '0 0 16px rgba(29,78,216,0.3)',
            }}>
              <PoliceBadge size={20} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>
                KSP Analytics
              </div>
              <div style={{ fontSize: 10, color: 'var(--accent-gold)', letterSpacing: '0.5px', fontWeight: 700 }}>
                GOVT. OF KARNATAKA
              </div>
            </div>
          </div>
        </NavLink>
        <div style={{
          marginTop: 10,
          padding: '6px 10px',
          background: 'rgba(34, 197, 94, 0.08)',
          border: '1px solid rgba(34, 197, 94, 0.2)',
          borderRadius: 8,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <div style={{
            width: 7, height: 7, borderRadius: '50%',
            background: '#22c55e',
            animation: 'pulse-ring 2s ease-in-out infinite',
          }} />
          <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 600 }}>LIVE — Karnataka State</span>
        </div>
      </div>

      {/* Global Search & Notifications */}
      <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-glass)', position: 'relative' }}>
         <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ flex: 1, position: 'relative' }}>
               <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: 10, top: 8 }} />
               <input 
                 type="text" 
                 placeholder="Search entities..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 style={{ 
                   width: '100%', padding: '6px 10px 6px 32px', borderRadius: 6, fontSize: 12,
                   background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)', color: 'white'
                 }}
               />
               {searchQuery && (
                  <div style={{ position: 'absolute', top: 35, left: 0, right: 0, background: 'var(--bg-card)', border: '1px solid var(--border-glass)', borderRadius: 6, zIndex: 100, padding: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
                     <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Suggestions</div>
                     <div style={{ fontSize: 12, color: 'var(--accent-info)', padding: '4px 8px', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', borderRadius: 4 }}>🔍 Search FIRs for "{searchQuery}"</div>
                     <div style={{ fontSize: 12, color: 'var(--accent-info)', padding: '4px 8px', cursor: 'pointer' }}>🔍 Search Suspects for "{searchQuery}"</div>
                  </div>
               )}
            </div>
            <button onClick={() => setShowNotifications(!showNotifications)} style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: 6, borderRadius: 6, cursor: 'pointer', color: '#f59e0b', position: 'relative' }}>
               <Bell size={16} />
               <div style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, background: '#ef4444', borderRadius: '50%' }} />
            </button>
         </div>
         
         {/* Notification Panel */}
         {showNotifications && (
            <div style={{ position: 'absolute', top: 50, left: 14, width: 260, background: 'var(--bg-card)', border: '1px solid var(--border-glass)', borderRadius: 8, zIndex: 100, padding: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.8)' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>Alerts</span>
                  <X size={14} style={{ cursor: 'pointer' }} onClick={() => setShowNotifications(false)} />
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontSize: 11, padding: 8, background: 'rgba(239, 68, 68, 0.1)', borderLeft: '2px solid #ef4444', borderRadius: 4 }}>
                     <strong style={{ color: '#ef4444', display: 'block' }}>High Risk District</strong>
                     Cyber fraud surge in Bengaluru.
                  </div>
                  <div style={{ fontSize: 11, padding: 8, background: 'rgba(245, 158, 11, 0.1)', borderLeft: '2px solid #f59e0b', borderRadius: 4 }}>
                     <strong style={{ color: '#f59e0b', display: 'block' }}>Organized Crime Alert</strong>
                     New network detected in Mysuru.
                  </div>
               </div>
            </div>
         )}
      </div>

      {/* Nav Links */}
      <div style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '1px', padding: '8px 10px 4px', fontWeight: 600 }}>
          COMMAND CENTER
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 10px',
                borderRadius: 10,
                marginBottom: 4,
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                background: isActive ? 'rgba(29, 78, 216, 0.15)' : 'transparent',
                border: `1px solid ${isActive ? 'var(--border-glow)' : 'transparent'}`,
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: isActive ? 'var(--accent-primary)' : 'var(--bg-card)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14,
                color: isActive ? '#ffffff' : 'var(--text-muted)',
                flexShrink: 0,
              }}>
                {item.icon}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: isActive ? 700 : 500 }}>{item.label}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>{item.desc}</div>
              </div>
              {isActive && (
                <div style={{
                  marginLeft: 'auto', width: 3, height: 20, borderRadius: 2,
                  background: 'var(--accent-primary)',
                }} />
              )}
            </NavLink>
          );
        })}
      </div>

      {/* User Profile Card & Actions */}
      <div style={{
        padding: '14px',
        borderTop: '1px solid var(--border-glass)',
        background: 'rgba(9, 14, 26, 0.4)',
      }}>
        {/* User Card */}
        {user && (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-glass)',
            borderRadius: 10,
            padding: '10px 12px',
            marginBottom: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#ffffff', fontWeight: 700, fontSize: 14,
              flexShrink: 0,
            }}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{
                fontSize: 12, fontWeight: 700, color: 'var(--text-primary)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {user.name || 'Police Officer'}
              </div>
              <div style={{
                fontSize: 10, color: 'var(--text-muted)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {user.email}
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 6 }}>
          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 8,
              background: 'var(--bg-card)',
              border: '1px solid var(--border-glass)',
              color: 'var(--text-secondary)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            title="Sign out of account"
            style={{
              flex: 2,
              padding: '8px 12px',
              borderRadius: 8,
              background: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#fda4af',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              transition: 'all 0.2s ease',
            }}
          >
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

