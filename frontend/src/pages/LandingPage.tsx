import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LandingNavbar } from '../components/LandingNavbar';
import { useTheme } from '../context/ThemeContext';

export const LandingPage: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'overview' | 'map' | 'network' | 'predictions' | 'offenders'>('overview');

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflowX: 'hidden',
    }}>
      {/* Top Navbar */}
      <LandingNavbar />

      {/* ─── Hero Section ────────────────────────────────────────────────────────── */}
      <section id="overview" style={{
        position: 'relative',
        padding: '70px 24px 90px',
        maxWidth: 1280,
        margin: '0 auto',
      }}>
        {/* Ambient Glow Effects */}
        <div style={{
          position: 'absolute',
          top: -40,
          left: '15%',
          width: 550,
          height: 550,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(29, 78, 216, 0.12) 0%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          top: 80,
          right: '10%',
          width: 450,
          height: 450,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(217, 119, 6, 0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 56, alignItems: 'center' }}>
          {/* Left Column: Headline & Action */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 999,
              background: 'var(--bg-card)',
              border: '1px solid var(--border-glass)',
              backdropFilter: 'blur(12px)',
              boxShadow: 'var(--shadow-card)',
              marginBottom: 24,
            }}>
              <span style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#22c55e',
                boxShadow: '0 0 10px #22c55e',
                animation: 'pulse-ring 2s infinite',
              }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.8px', color: 'var(--text-primary)' }}>
                KARNATAKA STATE POLICE — INTELLIGENCE COMMAND
              </span>
            </div>

            <h1 style={{
              fontSize: 44,
              fontWeight: 900,
              lineHeight: 1.18,
              letterSpacing: '-1px',
              color: 'var(--text-primary)',
              marginBottom: 20,
            }}>
              AI-Driven Crime Analytics & <br />
              <span className="gradient-text-blue">
                Predictive Policing Platform
              </span>
            </h1>

            <p style={{
              fontSize: 16,
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              marginBottom: 32,
              maxWidth: 560,
            }}>
              Transforming multi-precinct incident records into real-time tactical intelligence. Powered by DBSCAN geospatial clustering, graph link analysis, risk forecasting, and automated recidivism tracking.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 44 }}>
              <Link
                to="/dashboard"
                style={{
                  padding: '14px 28px',
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  boxShadow: '0 8px 24px rgba(29, 78, 216, 0.35)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <span>Access Command Portal</span>
                <span style={{ fontSize: 16 }}>➔</span>
              </Link>

              <a
                href="#capabilities"
                style={{
                  padding: '14px 24px',
                  borderRadius: 12,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-glass)',
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  backdropFilter: 'blur(12px)',
                  transition: 'all 0.2s',
                }}
              >
                <span>View Capabilities</span>
                <span style={{ fontSize: 14 }}>↓</span>
              </a>
            </div>

            {/* Quick Metrics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 20,
              paddingTop: 28,
              borderTop: '1px solid var(--border-glass)',
            }}>
              <div>
                <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--accent-primary)' }}>5,000+</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginTop: 2 }}>Incidents Mapped</div>
              </div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--accent-gold)' }}>31</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginTop: 2 }}>Districts Monitored</div>
              </div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--accent-low)' }}>94.2%</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginTop: 2 }}>Forecast Precision</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Card */}
          <div className="animate-float" style={{ position: 'relative' }}>
            <div style={{
              background: 'var(--gradient-card)',
              border: '1px solid var(--border-glow)',
              borderRadius: 24,
              padding: 24,
              boxShadow: 'var(--shadow-elevated)',
              backdropFilter: 'blur(20px)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Card Top Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16,
                paddingBottom: 14,
                borderBottom: '1px solid var(--border-glass)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: 'rgba(29, 78, 216, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                  }}>
                    🏛️
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                      Karnataka State Overview
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                      Real-Time Operational Feeds
                    </div>
                  </div>
                </div>

                <div style={{
                  padding: '4px 10px',
                  borderRadius: 20,
                  background: 'rgba(34, 197, 94, 0.1)',
                  color: '#22c55e',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  fontSize: 11,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
                  ACTIVE
                </div>
              </div>

              {/* Map Radar View */}
              <div style={{
                height: 180,
                borderRadius: 16,
                background: theme === 'dark' ? '#081329' : '#e2e8f0',
                border: '1px solid var(--border-glass)',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: 'radial-gradient(circle, var(--border-glass) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                  opacity: 0.5,
                }} />

                <div style={{
                  position: 'absolute',
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(239,68,68,0.35) 0%, rgba(239,68,68,0) 70%)',
                  animation: 'pulse-glow 3s infinite',
                }} />

                <div style={{
                  position: 'relative',
                  zIndex: 2,
                  textAlign: 'center',
                  padding: '12px 18px',
                  background: 'var(--bg-card)',
                  borderRadius: 12,
                  border: '1px solid var(--border-glow)',
                  backdropFilter: 'blur(12px)',
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-critical)', marginBottom: 2 }}>
                    📍 Hotspot Alert: Indiranagar Zone 4
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>
                    High Density: Cyber & Commercial Theft • 84% Risk
                  </div>
                </div>
              </div>

              {/* Key Features Quick List */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{
                  padding: 12,
                  borderRadius: 12,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-glass)',
                }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>RECOMMENDED PATROLS</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent-primary)', marginTop: 2 }}>14 Mobile Units</div>
                </div>
                <div style={{
                  padding: 12,
                  borderRadius: 12,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-glass)',
                }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>GANG NETWORK NODES</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent-gold)', marginTop: 2 }}>42 Linked Gangs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Live Data Marquee Ticker ────────────────────────────────────────────── */}
      <section style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-glass)',
        borderBottom: '1px solid var(--border-glass)',
        padding: '12px 0',
      }}>
        <div className="marquee-container">
          <div className="marquee-content" style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
            {[
              '🚨 BENGALURU CITY: 14 Active Hotspots Monitored',
              '⚡ MYSURU DISTRICT: Risk Score -4.2% YoY Reduction',
              '⬡ HUBBALLI-DHARWAD: Gang Network Link Analysis Updated',
              '🔍 MANGALURU: Cybercrime Anomaly Detected (Indiranagar Precinct)',
              '🛡️ CCTNS SYNC: 100% Real-Time Incident Ingestion',
              '🚨 BENGALURU CITY: 14 Active Hotspots Monitored',
              '⚡ MYSURU DISTRICT: Risk Score -4.2% YoY Reduction',
              '⬡ HUBBALLI-DHARWAD: Gang Network Link Analysis Updated',
              '🔍 MANGALURU: Cybercrime Anomaly Detected (Indiranagar Precinct)',
              '🛡️ CCTNS SYNC: 100% Real-Time Incident Ingestion',
            ].map((text, idx) => (
              <div key={idx} style={{
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}>
                <span>{text}</span>
                <span style={{ color: 'var(--border-glow)' }}>•</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Capabilities Pillars Section ────────────────────────────────────────── */}
      <section id="capabilities" style={{
        padding: '90px 24px',
        maxWidth: 1280,
        margin: '0 auto',
      }}>
        <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 50px' }}>
          <div style={{
            fontSize: 11,
            fontWeight: 800,
            color: 'var(--accent-gold)',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}>
            TACTICAL POLICE INTELLIGENCE
          </div>
          <h2 style={{ fontSize: 34, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
            Four Core Pillars of DataForge Analytics
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 10 }}>
            Engineered specifically for law enforcement officials to detect patterns, disrupt criminal networks, and allocate personnel efficiently.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
          {[
            {
              icon: '📍',
              color: 'var(--accent-primary)',
              title: 'Geospatial Hotspot Analysis',
              desc: 'DBSCAN & Kernel Density Estimation algorithm mapping high-frequency incident corridors and temporal crime trends across all precincts.',
            },
            {
              icon: '⬡',
              color: 'var(--accent-purple)',
              title: 'Criminal Network Graphing',
              desc: 'Degree centrality and community detection map inter-suspect connections, syndicate hierarchies, and key orchestrator nodes.',
            },
            {
              icon: '⚡',
              color: 'var(--accent-gold)',
              title: 'Predictive Risk Forecasting',
              desc: 'Time-series predictive models compute 30-day district risk projections, guiding shift commanders in deploying targeted preventative patrols.',
            },
            {
              icon: '◎',
              color: 'var(--accent-critical)',
              title: 'Repeat Offender Analytics',
              desc: 'Automated recidivism scoring evaluates past crime severity, modus operandi signatures, and bail statuses to flag high-risk individuals.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-glass)',
                borderRadius: 20,
                padding: 26,
                backdropFilter: 'blur(16px)',
                boxShadow: 'var(--shadow-card)',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = item.color;
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-glass)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: `rgba(255,255,255,0.05)`,
                border: `1px solid ${item.color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                marginBottom: 18,
              }}>
                {item.icon}
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>
                {item.title}
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Interactive Live Module Showcase ────────────────────────────────────── */}
      <section id="modules" style={{
        padding: '80px 24px',
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-glass)',
        borderBottom: '1px solid var(--border-glass)',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <h2 style={{ fontSize: 30, fontWeight: 900, color: 'var(--text-primary)' }}>
              Interactive Live Module Showcase
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 6 }}>
              Select a module tab below to inspect live intelligence outputs
            </p>
          </div>

          {/* Module Switcher Tabs */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 10,
            marginBottom: 36,
            flexWrap: 'wrap',
          }}>
            {[
              { id: 'overview', label: '📊 Dashboard Overview' },
              { id: 'map', label: '📍 Crime Map' },
              { id: 'network', label: '⬡ Network Graph' },
              { id: 'predictions', label: '⚡ Risk Predictions' },
              { id: 'offenders', label: '◎ Offender Profiles' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '10px 20px',
                  borderRadius: 10,
                  border: activeTab === tab.id ? '1px solid var(--accent-primary)' : '1px solid var(--border-glass)',
                  background: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--bg-card)',
                  color: activeTab === tab.id ? '#ffffff' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.2s ease',
                  boxShadow: activeTab === tab.id ? '0 4px 14px rgba(29, 78, 216, 0.3)' : 'none',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Display Box */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-glow)',
            borderRadius: 20,
            padding: 32,
            backdropFilter: 'blur(20px)',
            boxShadow: 'var(--shadow-elevated)',
          }}>
            {activeTab === 'overview' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-primary)', letterSpacing: '1px' }}>MODULE 01</span>
                  <h3 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', marginTop: 4, marginBottom: 10 }}>
                    Command Dashboard & Real-Time KPIs
                  </h3>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
                    Centralized situational awareness dashboard displaying state-wide crime metrics, severe incident alerts, district breakdown charts, and active patrol status.
                  </p>
                  <Link to="/dashboard" style={{ color: 'var(--accent-primary)', fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>
                    Open Dashboard Module ➔
                  </Link>
                </div>
                <div style={{ padding: 24, background: 'var(--bg-primary)', borderRadius: 16, border: '1px solid var(--border-glass)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>TOTAL INCIDENTS (2026)</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-low)' }}>+2.4% vs last mo</span>
                  </div>
                  <div style={{ fontSize: 30, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 14 }}>5,000 Verified</div>
                  <div style={{ height: 8, borderRadius: 4, background: 'var(--border-glass)', overflow: 'hidden' }}>
                    <div style={{ width: '74%', height: '100%', background: 'linear-gradient(90deg, #1d4ed8, #3b82f6)' }} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'map' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-gold)', letterSpacing: '1px' }}>MODULE 02</span>
                  <h3 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', marginTop: 4, marginBottom: 10 }}>
                    Geospatial Heatmaps & Precinct Layering
                  </h3>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
                    Interactive Leaflet map displaying real-time cluster points, district boundaries, and high-density crime hotzones across Karnataka.
                  </p>
                  <Link to="/map" style={{ color: 'var(--accent-gold)', fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>
                    Open Crime Map Module ➔
                  </Link>
                </div>
                <div style={{ padding: 24, background: 'var(--bg-primary)', borderRadius: 16, border: '1px solid var(--border-glass)', textAlign: 'center' }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>🗺️</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>31 Police Districts Mapped</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>DBSCAN Radius: 1.5km | Min Points: 5</div>
                </div>
              </div>
            )}

            {activeTab === 'network' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-purple)', letterSpacing: '1px' }}>MODULE 03</span>
                  <h3 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', marginTop: 4, marginBottom: 10 }}>
                    Criminal Syndicate Link Analysis
                  </h3>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
                    Visual graph analytics connecting suspects, co-conspirators, vehicle numbers, and weapon signatures to expose organized crime cells.
                  </p>
                  <Link to="/network" style={{ color: 'var(--accent-purple)', fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>
                    Open Network Graph Module ➔
                  </Link>
                </div>
                <div style={{ padding: 24, background: 'var(--bg-primary)', borderRadius: 16, border: '1px solid var(--border-glass)', textAlign: 'center' }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>⬡</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>Network Linkage Engine</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>Graph Centrality & Key Suspect Identification</div>
                </div>
              </div>
            )}

            {activeTab === 'predictions' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-low)', letterSpacing: '1px' }}>MODULE 04</span>
                  <h3 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', marginTop: 4, marginBottom: 10 }}>
                    Predictive Patrol Allocation & Risk Forecasting
                  </h3>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
                    AI time-series forecasting predicting incident probabilities for upcoming shifts, providing optimized patrol route recommendations.
                  </p>
                  <Link to="/predictions" style={{ color: 'var(--accent-low)', fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>
                    Open Predictions Module ➔
                  </Link>
                </div>
                <div style={{ padding: 24, background: 'var(--bg-primary)', borderRadius: 16, border: '1px solid var(--border-glass)', textAlign: 'center' }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>⚡</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>30-Day Risk Index Forecast</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>Confidence Score: 94.2%</div>
                </div>
              </div>
            )}

            {activeTab === 'offenders' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-critical)', letterSpacing: '1px' }}>MODULE 05</span>
                  <h3 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', marginTop: 4, marginBottom: 10 }}>
                    Repeat Offender & Recidivism Registry
                  </h3>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
                    Comprehensive profiles of repeat offenders with automated risk scores, active warrants, and precinct tracking records.
                  </p>
                  <Link to="/offenders" style={{ color: 'var(--accent-critical)', fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>
                    Open Offender Profiles Module ➔
                  </Link>
                </div>
                <div style={{ padding: 24, background: 'var(--bg-primary)', borderRadius: 16, border: '1px solid var(--border-glass)', textAlign: 'center' }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>◎</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>Recidivism Risk Matrix</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>Prior Conviction Weighting & MO Matching</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── Governance & Security Section ────────────────────────────────────────── */}
      <section id="governance" style={{
        padding: '90px 24px',
        maxWidth: 1280,
        margin: '0 auto',
      }}>
        <div style={{
          background: 'var(--gradient-card)',
          border: '1px solid var(--border-glow)',
          borderRadius: 24,
          padding: 40,
          boxShadow: 'var(--shadow-card)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 44,
          alignItems: 'center',
        }}>
          <div>
            <span style={{
              fontSize: 11,
              fontWeight: 800,
              color: 'var(--accent-gold)',
              letterSpacing: '1px',
            }}>
              DATA SOVEREIGNTY & COMPLIANCE
            </span>
            <h2 style={{ fontSize: 30, fontWeight: 900, color: 'var(--text-primary)', marginTop: 6, marginBottom: 14 }}>
              Built to Official Police Command & Governance Standards
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 22 }}>
              The DataForge Platform complies fully with official police data governance standards, ensuring zero data leakage, audit log traceability, and strict role-based access for law enforcement personnel.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: 'var(--accent-low)', fontSize: 16 }}>✓</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>CCTNS Ready Architecture</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: 'var(--accent-low)', fontSize: 16 }}>✓</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Role-Based Access (RBAC)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: 'var(--accent-low)', fontSize: 16 }}>✓</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>SHA-256 Audit Trail</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: 'var(--accent-low)', fontSize: 16 }}>✓</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>End-to-End Encryption</span>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', padding: 28, background: 'var(--bg-primary)', borderRadius: 20, border: '1px solid var(--border-glass)' }}>
            <div style={{ fontSize: 48, marginBottom: 10 }}>🛡️</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>
              Karnataka State Police Intelligence Division
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6 }}>
              Secured Command Portal • Operational 24/7/365
            </div>
            <div style={{ marginTop: 20 }}>
              <Link
                to="/dashboard"
                style={{
                  display: 'inline-flex',
                  padding: '12px 24px',
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, var(--accent-primary), #1d4ed8)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: 13,
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(29, 78, 216, 0.3)',
                }}
              >
                Launch Official Command Center ➔
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────────────────────────── */}
      <footer style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-glass)',
        padding: '36px 24px',
        fontSize: 12,
        color: 'var(--text-muted)',
      }}>
        <div style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>
              KARNATAKA STATE POLICE — CRIME ANALYTICS PLATFORM
            </div>
            <div style={{ marginTop: 2 }}>
              Designed for DataForge Datathon 2026 • Official Intelligence System
            </div>
          </div>

          <div style={{ display: 'flex', gap: 20 }}>
            <span>Emergency Police Helpline: <strong>112 / 100</strong></span>
            <span>Cyber Crime Helpline: <strong>1930</strong></span>
          </div>

          <div>
            © 2026 Karnataka State Police. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
