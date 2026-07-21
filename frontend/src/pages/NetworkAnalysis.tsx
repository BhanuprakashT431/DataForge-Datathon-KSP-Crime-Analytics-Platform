import React from 'react';
import { useAPI } from '../hooks/useAPI';
import { api } from '../api';

export const NetworkAnalysis: React.FC = () => {
  const { data: networkData, loading, error } = useAPI(() => api.network());

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

  if (error) {
    return <div style={{ color: 'var(--accent-critical)', padding: 24 }}>Error loading network data: {error}</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>
        Criminal Network Analysis
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
        Graph visualization of criminal associations and gang connections across Karnataka.
      </p>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 24
      }}>
        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Total Tracked Entities</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent-primary)', marginTop: 4 }}>
            {networkData?.nodes?.length || 0}
          </div>
        </div>
        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Active Connections</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent-info)', marginTop: 4 }}>
            {networkData?.edges?.length || 0}
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Key Network Entities</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px 12px' }}>ID</th>
                <th style={{ padding: '10px 12px' }}>Name</th>
                <th style={{ padding: '10px 12px' }}>Type</th>
                <th style={{ padding: '10px 12px' }}>Primary Crime</th>
                <th style={{ padding: '10px 12px' }}>Risk Score</th>
              </tr>
            </thead>
            <tbody>
              {networkData?.nodes?.slice(0, 15).map((node: any) => (
                <tr key={node.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '10px 12px', fontFamily: 'monospace' }}>{node.id}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 600 }}>{node.name}</td>
                  <td style={{ padding: '10px 12px' }}>{node.type}</td>
                  <td style={{ padding: '10px 12px' }}>{node.primary_crime}</td>
                  <td style={{ padding: '10px 12px', color: node.risk_score > 70 ? 'var(--accent-critical)' : 'var(--accent-medium)' }}>
                    {node.risk_score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
