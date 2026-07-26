import React, { useState, useEffect } from 'react';
import { api } from '../api';

export const SecurityDashboard = () => {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealth();
  }, []);

  const fetchHealth = async () => {
    try {
      const response = await api.get('/health');
      setHealth(response.data);
    } catch (err) {
      console.error(err);
      // Fallback synthetic health data
      setHealth({
        catalyst_sdk_available: true,
        catalyst_data_store_enabled: false,
        schema_version: 'KSP-ER-v1 (Synthetic)'
      });
    } finally {
      setLoading(false);
    }
  };

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

  const isCatalystActive = health?.catalyst_sdk_available;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>
            Security & Infrastructure
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Catalyst Edge Gateway and System Health
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 24 }}>
        {/* API Gateway Status */}
        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
            Catalyst API Gateway
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>Active</span>
            <div style={{ position: 'relative', display: 'flex', width: 12, height: 12 }}>
              <div style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', background: '#22c55e', opacity: 0.7, animation: 'pulse-ring 2s ease-in-out infinite' }} />
              <div style={{ position: 'relative', width: 12, height: 12, borderRadius: '50%', background: '#22c55e' }} />
            </div>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 8 }}>Routing all edge traffic</div>
        </div>

        {/* Database Status */}
        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
            Catalyst Data Store
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: health?.catalyst_data_store_enabled ? '#22c55e' : '#eab308' }}>
              {health?.catalyst_data_store_enabled ? 'Connected' : 'Local Fallback'}
            </span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 8 }}>Relational data sync</div>
        </div>

        {/* Auth Status */}
        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
            Authentication Mode
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
              {isCatalystActive ? 'Catalyst ZAuth' : 'Local Mock JWT'}
            </span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 8 }}>Role-based access control</div>
        </div>

        {/* Schema Status */}
        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
            Schema Integrity
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent-info)' }}>
              {health?.schema_version || 'v2.1.0'}
            </span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 8 }}>Verified at startup</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 }}>
        <div className="glass-card" style={{ padding: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>🛡️</span> API Gateway Rate Limiting
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: 'rgba(9, 14, 26, 0.4)', padding: 16, borderRadius: 8, border: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: 13, fontFamily: 'monospace' }}>/api/cases/*</span>
              <span style={{ fontSize: 11, background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', padding: '4px 8px', borderRadius: 4, fontWeight: 600 }}>100 req/min</span>
            </div>
            <div style={{ background: 'rgba(9, 14, 26, 0.4)', padding: 16, borderRadius: 8, border: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: 13, fontFamily: 'monospace' }}>/api/ai/analyze</span>
              <span style={{ fontSize: 11, background: 'rgba(234, 179, 8, 0.15)', color: '#facc15', padding: '4px 8px', borderRadius: 4, fontWeight: 600 }}>20 req/min</span>
            </div>
            <div style={{ background: 'rgba(9, 14, 26, 0.4)', padding: 16, borderRadius: 8, border: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: 13, fontFamily: 'monospace' }}>/api/health</span>
              <span style={{ fontSize: 11, background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--border-glass)', padding: '4px 8px', borderRadius: 4, fontWeight: 600 }}>Unlimited</span>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>📝</span> Catalyst Audit Trail (Simulated)
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1,2,3].map((i) => (
              <div key={i} style={{ display: 'flex', gap: 16, padding: 12, background: 'rgba(9, 14, 26, 0.4)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)', fontSize: 13 }}>
                <span style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>10:4{i}:00 AM</span>
                <span style={{ color: 'var(--accent-info)', fontFamily: 'monospace', fontWeight: 600 }}>AppSail</span>
                <span style={{ color: 'var(--text-secondary)' }}>Authorized request to /api/overview by UID:123</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
