import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { path: '/dashboard',        icon: '📊', label: 'Dashboard',        desc: 'Overview & KPIs' },
  { path: '/map',             icon: '📍', label: 'Crime Map',         desc: 'Geospatial Hotspots' },
  { path: '/network',         icon: '⬡', label: 'Network Analysis',  desc: 'Criminal Links' },
  { path: '/predictions',     icon: '⚡', label: 'AI Predictions',    desc: 'Risk & Forecasts' },
  { path: '/offenders',       icon: '◎', label: 'Offender Profiles', desc: 'Repeat Offenders' },
];

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

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
        <NavLink to="/dashboard" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #1d4ed8, #1e3a8a)',
              border: '1px solid var(--accent-gold)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, boxShadow: '0 0 16px rgba(29,78,216,0.3)',
            }}>🛡️</div>
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
            title="Toggle theme"
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 8,
              background: 'var(--bg-card)',
              border: '1px solid var(--border-glass)',
              color: 'var(--text-primary)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              transition: 'all 0.2s ease',
            }}
          >
            <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
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

