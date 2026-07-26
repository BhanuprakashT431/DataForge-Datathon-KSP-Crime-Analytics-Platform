import React, { useState } from 'react';
import { useAPI } from '../hooks/useAPI';
import { api } from '../api';
import { FileText, Download, Printer, Filter, ShieldAlert, BookOpen, Brain, Map } from 'lucide-react';
import { generateEnterprisePDF } from '../utils/pdfGenerator';

export const DecisionSupportReports: React.FC = () => {
  const { data: reportsList, loading } = useAPI(() => api.reports());
  const [generating, setGenerating] = useState<string | null>(null);

  const handleGenerate = (rpt: any) => {
    setGenerating(rpt.id);
    setTimeout(() => {
      generateEnterprisePDF({
        title: rpt.title,
        summary: rpt.desc,
        aiFindings: [
          'Detailed intelligence data attached in supplementary sections.',
          'Review necessary per state security protocol.'
        ]
      }, `${rpt.id}_Report.pdf`);
      setGenerating(null);
    }, 500);
  };

  return (
    <div style={{ padding: 24, animation: 'fadeIn 0.4s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <FileText color="var(--accent-primary)" /> SCRB Decision Support Reports
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
            Export actionable intelligence, district rankings, predictive models, and resource allocation directives for Executive Command.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: 12 }}>
          <button style={{ 
            background: 'var(--accent-primary)', border: 'none', borderRadius: 8,
            padding: '8px 16px', color: '#fff', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 600
          }}>
            <Printer size={16} /> Print All
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
         {(reportsList || []).map((rpt: any) => {
           let IconComponent = <BookOpen color="#4f7eff" />;
           if (rpt.id === 'RPT-002') IconComponent = <Map color="#f97316" />;
           if (rpt.id === 'RPT-003') IconComponent = <Brain color="#a855f7" />;
           if (rpt.id === 'RPT-004') IconComponent = <ShieldAlert color="#ef4444" />;
           
           return (
           <div key={rpt.id} className="glass-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                 <div style={{ padding: 10, background: 'rgba(255,255,255,0.05)', borderRadius: 10 }}>
                    {IconComponent}
                 </div>
                 <div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{rpt.type}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{rpt.title}</div>
                 </div>
              </div>
              
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', flex: 1, lineHeight: 1.5 }}>
                 {rpt.desc}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid var(--border-glass)' }}>
                 <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{rpt.id}</span>
                 <button 
                   onClick={() => handleGenerate(rpt)}
                   disabled={generating === rpt.id}
                   style={{ 
                     background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', borderRadius: 6,
                     padding: '6px 12px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13
                   }}
                 >
                   {generating === rpt.id ? <div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : <Download size={14} />} 
                   {generating === rpt.id ? 'Exporting...' : 'Export PDF'}
                 </button>
              </div>
           </div>
           );
         })}
      </div>
    </div>
  );
};
