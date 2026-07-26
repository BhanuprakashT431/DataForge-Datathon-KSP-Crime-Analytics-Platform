import React, { useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid
} from 'recharts';
import { useAPI } from '../hooks/useAPI';
import { api } from '../api';

const mockCyberTrend = [
  { month: 'Jan', incidents: 420 },
  { month: 'Feb', incidents: 480 },
  { month: 'Mar', incidents: 510 },
  { month: 'Apr', incidents: 460 },
  { month: 'May', incidents: 590 },
  { month: 'Jun', incidents: 630 },
];

const mockOrgCrime = [
  { type: 'Extortion', value: 120 },
  { type: 'Smuggling', value: 85 },
  { type: 'Trafficking', value: 60 },
  { type: 'Gambling', value: 190 },
];

const mockWorstDistricts = [
  { name: 'Bengaluru City', index: 8.9 },
  { name: 'Mysuru', index: 7.2 },
  { name: 'Hubballi-Dharwad', index: 6.8 },
  { name: 'Mangaluru', index: 6.4 },
  { name: 'Belagavi', index: 5.9 },
];

const mockBestDistricts = [
  { name: 'Udupi', index: 2.1 },
  { name: 'Kodagu', index: 2.3 },
  { name: 'Chamarajanagar', index: 2.7 },
  { name: 'Koppal', index: 3.1 },
  { name: 'Yadgir', index: 3.4 },
];

const EXECUTIVE_KPIS = [
  { key: 'state_crime_index', label: 'State Crime Index', value: '7.4', sub: '+0.2 from last month', icon: '📊', color: '#ea580c' },
  { key: 'threat_level', label: 'Emerging Threat Level', value: 'ELEVATED', sub: 'Cyber & Organized', icon: '⚠️', color: '#b91c1c' },
  { key: 'officer_availability', label: 'Officer Availability', value: '82%', sub: 'Target: 85%', icon: '👮', color: '#16a34a' },
  { key: 'response_time', label: 'Avg Response Time', value: '8.4m', sub: 'Urban zones', icon: '⏱️', color: '#3b82f6' },
  { key: 'women_safety', label: 'Women Safety Index', value: '8.1', sub: 'Scale 1-10 (Higher=Better)', icon: '🛡️', color: '#8b5cf6' },
  { key: 'vehicle_theft', label: 'Vehicle Theft Index', value: 'High', sub: 'Bengaluru Metro area', icon: '🚗', color: '#f59e0b' },
];

function GovLoadingSpinner() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 200 }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        border: '3px solid rgba(30, 64, 175, 0.2)',
        borderTopColor: '#1e40af',
        animation: 'spin 1s linear infinite',
        marginBottom: 16
      }} />
      <div style={{ color: '#64748b', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
        Initializing Command Center...
      </div>
    </div>
  );
}

const GovTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#0f172a', border: '1px solid #334155',
      borderRadius: 4, padding: '12px 16px', fontSize: 12, color: '#f8fafc',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)'
    }}>
      <div style={{ color: '#94a3b8', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase' }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 4 }}>
          <span style={{ color: p.color || '#94a3b8' }}>{p.name || 'Value'}</span>
          <span style={{ fontWeight: 700 }}>{p.value?.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

import { generateEnterprisePDF } from '../utils/pdfGenerator';
import { Download } from 'lucide-react';

const handleExportSummary = () => {
  generateEnterprisePDF({
    title: 'State Crime Summary',
    summary: 'Executive overview of Karnataka state crime metrics, indicating elevated threats in Cyber and Organized crime sectors.',
    tables: [
      {
        head: [['KPI', 'Value', 'Status']],
        body: EXECUTIVE_KPIS.map(k => [k.label, k.value, k.sub])
      },
      {
        head: [['Worst Districts', 'Index'], ['Safest Districts', 'Index']],
        body: mockWorstDistricts.map((d, i) => [`${d.name} (${d.index})`, `${mockBestDistricts[i]?.name} (${mockBestDistricts[i]?.index})`])
      }
    ]
  }, 'State_Crime_Summary.pdf');
};

const handleExportExecutive = () => {
  generateEnterprisePDF({
    title: 'Executive Intelligence Report',
    summary: 'Detailed intelligence brief for the State Crime Records Bureau outlining active anomalies, resource allocation needs, and cyber trends.',
    aiFindings: [
      'Cyber crime incidents have increased by 50% over the last 6 months.',
      'Organized gambling and extortion form the highest volume of syndicate activity.',
      'Bengaluru City remains the highest risk jurisdiction with an index of 8.9.'
    ],
    recommendations: [
      'Deploy additional cyber-response units to urban centers.',
      'Initiate targeted crackdowns on organized gambling rings.',
      'Maintain elevated patrol status in Bengaluru City and Mysuru.'
    ]
  }, 'Executive_Intelligence_Report.pdf');
};

export const Dashboard: React.FC = () => {
  const { data: overview, loading } = useAPI(() => api.overview());

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `@keyframes spin { to { transform: rotate(360deg); } }`;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <GovLoadingSpinner />
    </div>
  );

  const alerts = overview?.top_anomaly_alerts || [];

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease', padding: '24px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #1e293b', paddingBottom: 16, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#f8fafc', margin: 0 }}>Executive Command Center</h1>
          <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: 13 }}>Karnataka State Police · State Crime Records Bureau · Secure Terminal</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={handleExportSummary} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', fontSize: 12 }}>
             <Download size={14} /> State Crime Summary
          </button>
          <button onClick={handleExportExecutive} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', fontSize: 12, background: 'var(--accent-info)' }}>
             <Download size={14} /> Executive Intelligence Report
          </button>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '6px 12px', borderRadius: 4,
            background: 'rgba(29, 78, 216, 0.1)', border: '1px solid rgba(29, 78, 216, 0.3)',
            color: '#60a5fa', fontSize: 12, fontWeight: 600
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 8px #3b82f6' }} />
            SYSTEM ONLINE
          </div>
        </div>
      </div>

      {/* Threat Intel Ticker */}
      {alerts.length > 0 && (
        <div style={{
          background: '#0f172a', border: '1px solid #1e293b', borderRadius: 4, padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24
        }}>
          <span style={{ background: '#b91c1c', color: 'white', padding: '2px 8px', borderRadius: 2, fontSize: 11, fontWeight: 700 }}>CRITICAL ALERTS</span>
          <div style={{ flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: 13, color: '#cbd5e1' }}>
            {alerts.map((a: any, i: number) => (
              <span key={i} style={{ marginRight: 24 }}>
                ⚠️ <b>District {a.district}:</b> {a.xai?.reason || `Volume anomaly detected (Z-Score: ${a.z_score})`}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Executive KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        {EXECUTIVE_KPIS.map(cfg => (
          <div key={cfg.key} style={{
            background: '#0f172a', border: '1px solid #1e293b', borderRadius: 4, padding: 16,
            display: 'flex', alignItems: 'center', gap: 16
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, background: `rgba(${parseInt(cfg.color.slice(1,3),16)}, ${parseInt(cfg.color.slice(3,5),16)}, ${parseInt(cfg.color.slice(5,7),16)}, 0.1)`,
              color: cfg.color
            }}>
              {cfg.icon}
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>{cfg.label}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#f8fafc', marginBottom: 2 }}>
                {cfg.value}
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>
                {cfg.sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Cyber Crime Trend */}
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 4, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 16, marginTop: 0 }}>Cyber Crime Trend</h3>
          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockCyberTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<GovTooltip />} cursor={{ stroke: '#334155' }} />
                <Line type="monotone" dataKey="incidents" stroke="#0ea5e9" strokeWidth={3} dot={{ fill: '#0ea5e9', r: 4 }} activeDot={{ r: 6 }} name="Incidents" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Organized Crime Activity */}
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 4, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 16, marginTop: 0 }}>Organized Crime Activity</h3>
          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockOrgCrime} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="type" type="category" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<GovTooltip />} cursor={{ fill: '#1e293b' }} />
                <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="Cases" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* District Rankings - Worst */}
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 4, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 16, marginTop: 0 }}>High-Risk Districts (Worst 5)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {mockWorstDistricts.map((d, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#1e293b', borderRadius: 4, borderLeft: '4px solid #b91c1c' }}>
                <span style={{ color: '#f8fafc', fontWeight: 600, fontSize: 14 }}>{i + 1}. {d.name}</span>
                <span style={{ color: '#ef4444', fontWeight: 700 }}>{d.index.toFixed(1)} Index</span>
              </div>
            ))}
          </div>
        </div>

        {/* District Rankings - Best */}
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 4, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 16, marginTop: 0 }}>Safest Districts (Best 5)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {mockBestDistricts.map((d, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#1e293b', borderRadius: 4, borderLeft: '4px solid #16a34a' }}>
                <span style={{ color: '#f8fafc', fontWeight: 600, fontSize: 14 }}>{i + 1}. {d.name}</span>
                <span style={{ color: '#22c55e', fontWeight: 700 }}>{d.index.toFixed(1)} Index</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
