import React from 'react';
import { useAPI } from '../hooks/useAPI';
import { api } from '../api';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const Predictions: React.FC = () => {
  const { data: forecastData, loading } = useAPI(() => api.forecasts());
  const { data: riskScores } = useAPI(() => api.riskScores());

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          border: '3px solid rgba(79,126,255,0.2)', borderTopColor: 'var(--accent-primary)',
          animation: 'spin 0.8s linear infinite',
        }} />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>
        AI Crime Predictions & Forecasts
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
        Predictive analytics and risk projections for upcoming periods across districts.
      </p>

      <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Monthly Crime Projections</h2>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData || []}>
              <XAxis dataKey="month" stroke="#8899bb" />
              <YAxis stroke="#8899bb" />
              <Tooltip contentStyle={{ background: '#080f1f', borderColor: 'rgba(99,140,255,0.2)' }} />
              <Area type="monotone" dataKey="predicted_crimes" stroke="#4f7eff" fill="rgba(79,126,255,0.2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card" style={{ padding: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>District Predictive Risk Index</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {riskScores?.slice(0, 8).map((item: any) => (
            <div key={item.district} style={{
              background: 'rgba(15,28,60,0.5)', padding: 16, borderRadius: 12, border: '1px solid var(--border-glass)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontWeight: 600 }}>{item.district}</span>
                <span style={{
                  color: item.composite_risk_score > 60 ? 'var(--accent-critical)' : 'var(--accent-high)',
                  fontWeight: 700
                }}>
                  {item.composite_risk_score} Score
                </span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Risk Level: {item.risk_level}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
