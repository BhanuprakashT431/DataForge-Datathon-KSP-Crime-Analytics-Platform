import React from 'react';
import { useAPI } from '../hooks/useAPI';
import { api } from '../api';

export const OffenderProfiles: React.FC = () => {
  const { data: offenders, loading } = useAPI(() => api.offenders());

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
        Offender Intelligence Profiles
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
        Repeat offender tracking, activity history, and threat severity assessments.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {offenders?.map((offender: any) => (
          <div key={offender.id} className="glass-card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{offender.name}</h3>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>ID: {offender.id}</span>
              </div>
              <span className="badge badge-critical" style={{ fontSize: 12 }}>
                Risk: {offender.risk_score}
              </span>
            </div>

            <div style={{ fontSize: 13, display: 'flex', flexDirection: 'column', gap: 6, color: 'var(--text-secondary)' }}>
              <div><strong>Primary Crime:</strong> {offender.primary_crime}</div>
              <div><strong>Total Offenses:</strong> {offender.total_crimes}</div>
              <div><strong>Active Districts:</strong> {offender.districts_active?.join(', ') || 'N/A'}</div>
              <div><strong>Status:</strong> <span style={{ color: 'var(--accent-primary)' }}>{offender.status}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
