import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { PoliceBadge } from './PoliceBadge';

export const LandingNavbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      width: '100%',
      background: 'var(--gradient-nav)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-glass)',
      transition: 'all var(--transition-normal)',
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Brand / Crest */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none' }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
            border: '1.5px solid var(--accent-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(217, 119, 6, 0.25)',
            fontSize: 20,
            flexShrink: 0,
          }}>
            <PoliceBadge size={24} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              flexWrap: 'nowrap',
            }}>
              <span style={{
                fontSize: 16,
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '-0.3px',
                whiteSpace: 'nowrap',
              }}>
                KARNATAKA STATE POLICE
              </span>
              <span style={{
                fontSize: 10,
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 999,
                background: 'rgba(217, 119, 6, 0.12)',
                color: 'var(--accent-gold)',
                border: '1px solid rgba(217, 119, 6, 0.3)',
                letterSpacing: '0.5px',
                whiteSpace: 'nowrap',
              }}>
                GOVT. OF KARNATAKA
              </span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500, letterSpacing: '0.3px' }}>
              DataForge AI-Driven Crime Analytics Platform
            </div>
          </div>
        </Link>

        {/* Center Section Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <a href="#overview" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 13, fontWeight: 600, transition: 'color 0.2s' }}>
            Overview
          </a>
          <a href="#capabilities" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 13, fontWeight: 600, transition: 'color 0.2s' }}>
            Capabilities
          </a>
          <a href="#modules" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 13, fontWeight: 600, transition: 'color 0.2s' }}>
            Live Modules
          </a>
          <a href="#governance" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 13, fontWeight: 600, transition: 'color 0.2s' }}>
            Governance
          </a>
        </nav>

        {/* Right Action & Theme Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            style={{
              padding: '8px 14px',
              borderRadius: 10,
              background: 'var(--bg-card)',
              border: '1px solid var(--border-glass)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 12,
              fontWeight: 600,
              backdropFilter: 'blur(10px)',
              transition: 'all 0.2s ease',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          {/* Portal Launch Button */}
          <Link
            to="/auth"
            style={{
              padding: '10px 18px',
              borderRadius: 10,
              background: 'linear-gradient(135deg, var(--accent-primary) 0%, #1d4ed8 100%)',
              color: '#ffffff',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 16px rgba(29, 78, 216, 0.35)',
              transition: 'all 0.2s ease',
            }}
          >
            <span>Launch Command Center</span>
            <span style={{ fontSize: 14 }}>➔</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
