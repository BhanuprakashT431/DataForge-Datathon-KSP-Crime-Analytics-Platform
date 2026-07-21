import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/',                icon: '◉', label: 'Dashboard',         desc: 'Overview & KPIs' },
  { path: '/map',             icon: '◈', label: 'Crime Map',          desc: 'Geospatial Hotspots' },
  { path: '/network',         icon: '⬡', label: 'Network Analysis',   desc: 'Criminal Links' },
  { path: '/predictions',     icon: '◈', label: 'AI Predictions',     desc: 'Risk & Forecasts' },
  { path: '/offenders',       icon: '◎', label: 'Offender Profiles',  desc: 'Repeat Offenders' },
];

export const Navbar: React.FC = () => {
  const location = useLocation();

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
        padding: '24px 20px 20px',
        borderBottom: '1px solid var(--border-glass)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #ef4444, #7c1d1d)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, boxShadow: '0 0 20px rgba(239,68,68,0.4)',
          }}>🛡️</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>
              KSP Analytics
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
              CRIME INTELLIGENCE
            </div>
          </div>
        </div>
        <div style={{
          marginTop: 12,
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
          MODULES
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
                marginBottom: 2,
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                background: isActive ? 'rgba(79, 126, 255, 0.12)' : 'transparent',
                border: `1px solid ${isActive ? 'rgba(79, 126, 255, 0.25)' : 'transparent'}`,
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: isActive ? 'rgba(79, 126, 255, 0.2)' : 'rgba(255,255,255,0.04)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14,
                color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                flexShrink: 0,
              }}>
                {item.icon}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: isActive ? 600 : 400 }}>{item.label}</div>
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

      {/* Footer */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid var(--border-glass)',
        fontSize: 11, color: 'var(--text-muted)',
      }}>
        <div style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2 }}>
          Karnataka State Police
        </div>
        <div>State Crime Records Bureau</div>
        <div style={{ marginTop: 6, color: 'rgba(79,126,255,0.6)' }}>
          © 2024 KSP SCRB Platform
        </div>
      </div>
    </nav>
  );
};
