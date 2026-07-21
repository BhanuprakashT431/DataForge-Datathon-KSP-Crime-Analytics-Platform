import React, { useEffect, useRef, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area,
} from 'recharts';
import { useAPI } from '../hooks/useAPI';
import { api, formatNumber, getRiskColor } from '../api';

const CRIME_COLORS: Record<string, string> = {
  'Theft':            '#4f7eff',
  'Robbery':          '#f97316',
  'Assault':          '#ef4444',
  'Murder':           '#dc2626',
  'Fraud':            '#a855f7',
  'Cybercrime':       '#38bdf8',
  'Drug Trafficking': '#14b8a6',
  'Kidnapping':       '#f43f5e',
  'Burglary':         '#eab308',
  'Vehicle Theft':    '#6366f1',
  'Domestic Violence':'#ec4899',
};

const KPI_CONFIG = [
  { key: 'total_crimes',       label: 'Total Crimes',       icon: '📊', gradient: 'linear-gradient(135deg,#1a2a6b,#0d1540)', color: '#4f7eff' },
  { key: 'active_hotspots',    label: 'Active Hotspots',    icon: '🔴', gradient: 'linear-gradient(135deg,#6b1a1a,#400d0d)', color: '#ef4444' },
  { key: 'high_risk_districts',label: 'High-Risk Districts',icon: '⚠️', gradient: 'linear-gradient(135deg,#5c3a00,#3a2000)', color: '#f97316' },
  { key: 'solve_rate',         label: 'Solve Rate',         icon: '✅', gradient: 'linear-gradient(135deg,#0a3a1a,#052210)', color: '#22c55e', suffix: '%' },
  { key: 'total_anomalies',    label: 'Anomalies Detected', icon: '🤖', gradient: 'linear-gradient(135deg,#3a1a6b,#1f0d40)', color: '#a855f7' },
  { key: 'repeat_offenders',   label: 'Repeat Offenders',   icon: '👤', gradient: 'linear-gradient(135deg,#1a4060,#0d2540)', color: '#38bdf8' },
];

function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        border: '3px solid rgba(79,126,255,0.2)',
        borderTopColor: 'var(--accent-primary)',
        animation: 'spin 0.8s linear infinite',
      }} />
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(8,15,35,0.97)', border: '1px solid var(--border-glass)',
      borderRadius: 10, padding: '10px 14px', fontSize: 12,
    }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 6 }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ color: p.color, fontWeight: 600 }}>
          {p.name}: {p.value?.toLocaleString()}
        </div>
      ))}
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const { data: overview, loading } = useAPI(() => api.overview());
  const [tickerIdx, setTickerIdx] = useState(0);

  const alerts = overview?.top_anomaly_alerts || [];
  const ticker = alerts.map((a: any) => a.message).join('  ●  ');

  useEffect(() => {
    if (!overview) return;
    const style = document.createElement('style');
    style.innerHTML = `@keyframes spin { to { transform: rotate(360deg); } }`;
    document.head.appendChild(style);
    return () => style.remove();
  }, [overview]);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <LoadingSpinner />
    </div>
  );

  const kpi = overview?.kpi || {};
  const crimeTypes: any[] = overview?.crime_type_distribution || [];
  const yoy: any[] = overview?.year_over_year || [];
  const topRisk: any[] = overview?.top_risk_districts || [];
  const hourly: any[] = overview?.hourly_distribution || [];
  const dow: any[] = overview?.day_of_week || [];

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      {/* Page Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Crime Intelligence Dashboard</h1>
          <p className="page-subtitle">Karnataka State — Real-time analytics across 31 districts · 2022–2024</p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 14px', borderRadius: 10,
          background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)',
          fontSize: 12, color: '#22c55e', fontWeight: 600,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
          Live Data Feed
        </div>
      </div>

      {/* Alert Ticker */}
      {ticker && (
        <div className="alert-ticker">
          <span className="ticker-label">⚠ ALERT</span>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div className="ticker-text">{ticker}</div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="kpi-grid">
        {KPI_CONFIG.map((cfg) => (
          <div
            key={cfg.key}
            className="kpi-card"
            style={{ '--kpi-gradient': cfg.gradient, '--kpi-color': cfg.color } as any}
          >
            <div className="kpi-icon" style={{ background: `${cfg.color}22` }}>
              {cfg.icon}
            </div>
            <div className="kpi-value" style={{ color: cfg.color }}>
              {formatNumber(kpi[cfg.key] || 0)}{cfg.suffix || ''}
            </div>
            <div className="kpi-label">{cfg.label}</div>
          </div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="charts-grid cols-2" style={{ marginBottom: 20 }}>
        {/* Crime Type Distribution */}
        <div className="glass-card">
          <div className="card-title">🔷 Crime Category Breakdown</div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={crimeTypes.slice(0, 8)} layout="vertical" margin={{ left: 10, right: 20 }}>
              <XAxis type="number" tick={{ fill: '#4a5a7a', fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#8899bb', fontSize: 11 }} width={110} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {crimeTypes.slice(0, 8).map((entry: any) => (
                  <Cell key={entry.name} fill={CRIME_COLORS[entry.name] || '#4f7eff'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Year-over-Year Trend */}
        <div className="glass-card">
          <div className="card-title">📈 Year-over-Year Crime Trend</div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={yoy} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f7eff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4f7eff" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis dataKey="year" tick={{ fill: '#4a5a7a', fontSize: 11 }} />
              <YAxis tick={{ fill: '#4a5a7a', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="count" stroke="#4f7eff" fill="url(#areaGrad)" strokeWidth={2} name="Crimes" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Second Row */}
      <div className="charts-grid cols-2" style={{ marginBottom: 20 }}>
        {/* Day of Week */}
        <div className="glass-card">
          <div className="card-title">📅 Crime by Day of Week</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dow} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <XAxis dataKey="day" tick={{ fill: '#4a5a7a', fontSize: 10 }} tickFormatter={(v) => v.slice(0, 3)} />
              <YAxis tick={{ fill: '#4a5a7a', fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#4f7eff" radius={[4, 4, 0, 0]} name="Crimes" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Hourly Pattern */}
        <div className="glass-card">
          <div className="card-title">🕐 Crime by Hour of Day</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={hourly} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="hourGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis dataKey="hour" tick={{ fill: '#4a5a7a', fontSize: 10 }} tickFormatter={(v) => `${v}:00`} />
              <YAxis tick={{ fill: '#4a5a7a', fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="count" stroke="#a855f7" fill="url(#hourGrad)" strokeWidth={2} name="Crimes" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="charts-grid cols-2">
        {/* Top Risk Districts */}
        <div className="glass-card">
          <div className="card-title">🏴 Top Risk Districts</div>
          <table className="data-table">
            <thead>
              <tr>
                <th>District</th>
                <th>Risk Score</th>
                <th>Level</th>
                <th>Crimes/Lakh</th>
              </tr>
            </thead>
            <tbody>
              {topRisk.map((r: any, i: number) => (
                <tr key={r.district}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: 11, width: 16 }}>#{i + 1}</span>
                      <span style={{ fontWeight: 500 }}>{r.district}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="risk-bar-container">
                        <div
                          className="risk-bar-fill"
                          style={{ width: `${r.risk_score}%`, background: getRiskColor(r.risk_score) }}
                        />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: getRiskColor(r.risk_score) }}>
                        {r.risk_score}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-${r.risk_level?.toLowerCase()}`}>{r.risk_level}</span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{r.crimes_per_lakh}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Anomaly Alerts */}
        <div className="glass-card">
          <div className="card-title">🚨 Active Anomaly Alerts</div>
          {overview?.top_anomaly_alerts?.slice(0, 5).map((alert: any, i: number) => (
            <div key={i} className={`alert-card ${alert.severity?.toLowerCase()}`}>
              <div className="alert-icon">
                {alert.severity === 'Critical' ? '🔴' : alert.severity === 'High' ? '🟠' : '🟡'}
              </div>
              <div>
                <div className="alert-text">{alert.message}</div>
                <div className="alert-meta">
                  {alert.type} · Z-score: {alert.z_score?.toFixed(1) ?? '—'}σ
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
