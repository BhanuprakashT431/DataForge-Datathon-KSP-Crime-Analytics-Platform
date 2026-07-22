import React, { useState, useMemo } from 'react';
import { useAPI } from '../hooks/useAPI';
import { api } from '../api';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const Predictions: React.FC = () => {
  const { data: forecastData, loading } = useAPI(() => api.forecasts());
  const { data: riskScores } = useAPI(() => api.riskScores());
  
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Bengaluru Urban');
  const [aiPrompt, setAiPrompt] = useState<string>('Generate full predictive crime analysis and patrol recommendations');
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiModelUsed, setAiModelUsed] = useState<string | null>(null);

  // Transform raw district forecast arrays into combined monthly trend timeline
  const chartData = useMemo(() => {
    if (!forecastData || !Array.isArray(forecastData)) return [];
    const monthMap: Record<string, number> = {};
    forecastData.forEach((d: any) => {
      (d.forecast || []).forEach((f: any) => {
        if (f.month && f.predicted !== undefined) {
          monthMap[f.month] = (monthMap[f.month] || 0) + f.predicted;
        }
      });
    });
    return Object.keys(monthMap)
      .sort()
      .map((month) => ({
        month,
        predicted_crimes: monthMap[month],
      }));
  }, [forecastData]);

  const handleRunAiAnalysis = async () => {
    setAiLoading(true);
    setAiAnalysis(null);
    try {
      const apiKey = localStorage.getItem('ksp_gemini_api_key') || undefined;
      const fullQuery = `Provide detailed crime prediction and tactical intelligence report for ${selectedDistrict}. ${aiPrompt}`;
      const res = await api.analyzeWithAI(fullQuery, selectedDistrict, apiKey);
      setAiAnalysis(res.analysis);
      setAiModelUsed(res.model || 'gemini-1.5-flash');
    } catch (e: any) {
      setAiAnalysis(`⚠️ Error generating Gemini report: ${e?.message || 'Connection error'}`);
    } finally {
      setAiLoading(false);
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

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>
            AI Crime Predictions & Forecasts
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Predictive analytics, risk projections, and Google Gemini AI law enforcement reasoning.
          </p>
        </div>
        <div style={{
          padding: '8px 14px', borderRadius: 20, background: 'rgba(59, 130, 246, 0.15)',
          border: '1px solid rgba(59, 130, 246, 0.3)', color: '#60a5fa', fontWeight: 600, fontSize: 13,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span>✨ Powered by Gemini AI</span>
        </div>
      </div>

      {/* Gemini AI Interactive Crime Analyst Box */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 24, border: '1px solid rgba(59, 130, 246, 0.35)', background: 'linear-gradient(135deg, rgba(15,23,42,0.8), rgba(30,58,138,0.25))' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, color: '#ffffff', boxShadow: '0 0 16px rgba(37,99,235,0.4)'
          }}>
            ✨
          </div>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Gemini AI Crime Intelligence Console
            </h2>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
              Generate instant tactical police advisories, patrol routing, and crime forecast reports.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 140px', gap: 12, marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4, fontWeight: 600 }}>
              Select District
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              style={{
                width: '100%', padding: '10px 12px', borderRadius: 8,
                background: 'var(--bg-card)', border: '1px solid var(--border-glass)',
                color: 'var(--text-primary)', fontSize: 13, outline: 'none'
              }}
            >
              {riskScores?.map((r: any) => (
                <option key={r.district} value={r.district}>
                  {r.district} (Risk Score: {r.risk_score})
                </option>
              )) || <option value="Bengaluru Urban">Bengaluru Urban</option>}
            </select>
          </div>

          <div>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4, fontWeight: 600 }}>
              Intelligence Directive / Focus
            </label>
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. Night patrol deployment for commercial hubs..."
              style={{
                width: '100%', padding: '10px 12px', borderRadius: 8,
                background: 'var(--bg-card)', border: '1px solid var(--border-glass)',
                color: 'var(--text-primary)', fontSize: 13, outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              onClick={handleRunAiAnalysis}
              disabled={aiLoading}
              style={{
                width: '100%', padding: '10px 16px', borderRadius: 8,
                background: aiLoading ? 'rgba(30, 58, 138, 0.5)' : 'linear-gradient(135deg, #1d4ed8, #2563eb)',
                border: 'none', color: '#ffffff', fontWeight: 700, fontSize: 13,
                cursor: aiLoading ? 'not-allowed' : 'pointer', height: 40,
                boxShadow: '0 4px 14px rgba(37,99,235,0.3)'
              }}
            >
              {aiLoading ? 'Analyzing...' : 'Generate Report'}
            </button>
          </div>
        </div>

        {/* AI Output Display */}
        {aiAnalysis && (
          <div style={{
            marginTop: 16, padding: 18, borderRadius: 12,
            background: 'rgba(9, 14, 26, 0.75)', border: '1px solid rgba(59, 130, 246, 0.3)',
            whiteSpace: 'pre-line', fontSize: 13, lineHeight: 1.6, color: '#f1f5f9'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 8 }}>
              <span style={{ fontWeight: 700, color: '#60a5fa', fontSize: 14 }}>
                📋 Generated Intelligence Briefing — {selectedDistrict}
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                Model: {aiModelUsed}
              </span>
            </div>
            {aiAnalysis}
          </div>
        )}
      </div>

      {/* Monthly Chart */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Monthly Crime Projections</h2>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <XAxis dataKey="month" stroke="#8899bb" />
              <YAxis stroke="#8899bb" />
              <Tooltip contentStyle={{ background: '#080f1f', borderColor: 'rgba(99,140,255,0.2)', borderRadius: 8, color: '#fff' }} />
              <Area type="monotone" dataKey="predicted_crimes" stroke="#4f7eff" fill="rgba(79,126,255,0.25)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk Index */}
      <div className="glass-card" style={{ padding: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>District Predictive Risk Index</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {riskScores?.slice(0, 8).map((item: any) => (
            <div key={item.district} style={{
              background: 'rgba(15,28,60,0.5)', padding: 16, borderRadius: 12, border: '1px solid var(--border-glass)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.district}</span>
                <span style={{
                  color: item.risk_score > 60 ? 'var(--accent-critical)' : 'var(--accent-high)',
                  fontWeight: 700
                }}>
                  {item.risk_score} Score
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
