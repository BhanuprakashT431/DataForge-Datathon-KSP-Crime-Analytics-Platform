import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Download } from 'lucide-react';
import { generateEnterprisePDF } from '../utils/pdfGenerator';

export const Workspace = () => {
  const [cases, setCases] = useState<any[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);
  const [caseDetail, setCaseDetail] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const response = await api.get('/cases');
      setCases(response.data.cases || []);
    } catch (err) {
      console.error(err);
      // Fallback synthetic data
      setCases([
        { CaseMasterID: 1001, FIRNumber: 'FIR-0091/2026', GravityOffenceID: 1, BriefFacts: 'Armed robbery reported at MG Road jewelry store. 3 suspects fled on motorcycles. CCTV footage secured.' },
        { CaseMasterID: 1002, FIRNumber: 'FIR-0092/2026', GravityOffenceID: 2, BriefFacts: 'Organized vehicle theft syndicate active in Indiranagar. Multiple high-end SUVs reported missing.' },
        { CaseMasterID: 1003, FIRNumber: 'FIR-0093/2026', GravityOffenceID: 1, BriefFacts: 'Cyber fraud syndicate detected operating from Koramangala. Over ₹1.5 Cr scammed via fake investment apps.' },
        { CaseMasterID: 1004, FIRNumber: 'FIR-0094/2026', GravityOffenceID: 2, BriefFacts: 'Drug peddling suspected near college campus in Mysuru. Undercover patrol monitoring suspects.' },
        { CaseMasterID: 1005, FIRNumber: 'FIR-0095/2026', GravityOffenceID: 1, BriefFacts: 'Inter-state smuggling ring intercepted at Belagavi border. Contraband seized in transport truck.' },
        { CaseMasterID: 1006, FIRNumber: 'FIR-0096/2026', GravityOffenceID: 2, BriefFacts: 'Serial chain-snatching incidents reported in Hubballi-Dharwad during early morning hours.' },
        { CaseMasterID: 1007, FIRNumber: 'FIR-0097/2026', GravityOffenceID: 1, BriefFacts: 'Major financial embezzlement case filed against local cooperative bank directors in Tumakuru.' },
        { CaseMasterID: 1008, FIRNumber: 'FIR-0098/2026', GravityOffenceID: 2, BriefFacts: 'Illegal sand mining operations detected along riverbanks in Raichur district.' },
        { CaseMasterID: 1009, FIRNumber: 'FIR-0099/2026', GravityOffenceID: 1, BriefFacts: 'Human trafficking module busted in Kalaburagi. 5 victims rescued from illicit sweatshop.' },
        { CaseMasterID: 1010, FIRNumber: 'FIR-0100/2026', GravityOffenceID: 2, BriefFacts: 'Repeated public nuisance and gang clashes reported in Ballari market area.' },
        { CaseMasterID: 1011, FIRNumber: 'FIR-0101/2026', GravityOffenceID: 1, BriefFacts: 'Counterfeit currency printing operation discovered in Shivamogga. Fake notes worth ₹50 Lakhs recovered.' },
        { CaseMasterID: 1012, FIRNumber: 'FIR-0102/2026', GravityOffenceID: 2, BriefFacts: 'Riot and arson reported following local dispute in Davanagere. Situation under control with heavy police deployment.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadCaseDetail = async (id: number) => {
    setSelectedCaseId(id);
    setCaseDetail(null);
    try {
      const response = await api.get(`/cases/${id}`);
      setCaseDetail(response.data);
    } catch (err) {
      console.error(err);
      // Fallback synthetic detail
      setCaseDetail({
        case: { CaseMasterID: id, FIRNumber: `FIR-${id}`, DateOfReport: '2023-10-15', BriefFacts: 'Synthetic detailed facts for fallback viewing.' },
        assistant: {
          priority_level: 'High',
          recommended_actions: ['Dispatch Scene of Crime Officers (SOCO).', 'Collect CCTV footage.'],
          evidence_url: '#'
        }
      });
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
            Investigation Workspace
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Active FIRs and AI-Assisted Case Recommendations
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, height: '80vh' }}>
        
        {/* Case List */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ padding: 16, borderBottom: '1px solid var(--border-glass)', background: 'rgba(9, 14, 26, 0.4)' }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Recent FIRs</h2>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {cases.length === 0 ? (
              <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)' }}>No active cases found.</div>
            ) : (
              cases.map((c: any) => {
                const isSelected = selectedCaseId === c.CaseMasterID;
                const isHeinous = c.GravityOffenceID === 1;
                return (
                  <div 
                    key={c.CaseMasterID}
                    onClick={() => loadCaseDetail(c.CaseMasterID)}
                    style={{
                      padding: 16,
                      borderRadius: 8,
                      cursor: 'pointer',
                      background: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-card)',
                      border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-glass)'}`,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontFamily: 'monospace', color: 'var(--accent-info)', fontSize: 13, fontWeight: 600 }}>
                        {c.FIRNumber || `FIR-${c.CaseMasterID}`}
                      </span>
                      <span className={`badge ${isHeinous ? 'badge-critical' : 'badge-secondary'}`} style={{ fontSize: 11 }}>
                        {isHeinous ? 'Heinous' : 'Non-Heinous'}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {c.BriefFacts || 'No brief facts available.'}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Case Detail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, overflowY: 'auto' }}>
          {caseDetail ? (
            <>
              <div className="glass-card" style={{ padding: 24 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'monospace', margin: '0 0 8px 0' }}>
                  {caseDetail.case.FIRNumber || `FIR-${caseDetail.case.CaseMasterID}`}
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0 }}>Date of Report: {caseDetail.case.DateOfReport}</p>
                <div style={{ marginTop: 24 }}>
                  <h3 style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                    Brief Facts
                  </h3>
                  <div style={{ background: 'rgba(9, 14, 26, 0.4)', padding: 16, borderRadius: 8, border: '1px solid var(--border-glass)', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {caseDetail.case.BriefFacts}
                  </div>
                </div>
              </div>

              <div className="glass-card" style={{ padding: 24, border: '1px solid rgba(59, 130, 246, 0.3)', background: 'linear-gradient(135deg, rgba(15,23,42,0.8), rgba(30,58,138,0.15))' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--accent-info)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>⚡</span> AI Investigation Assistant
                  </h3>
                  <button
                    onClick={() => {
                      generateEnterprisePDF({
                        title: 'Investigation Case Report',
                        summary: `FIR Number: ${caseDetail.case.FIRNumber || `FIR-${caseDetail.case.CaseMasterID}`}. Date of Report: ${caseDetail.case.DateOfReport}.`,
                        aiFindings: [
                          `Priority Level: ${caseDetail.assistant.priority_level}`,
                          `Brief Facts: ${caseDetail.case.BriefFacts}`
                        ],
                        recommendations: caseDetail.assistant.recommended_actions
                      }, `Case_Report_${caseDetail.case.CaseMasterID}.pdf`);
                    }}
                    style={{
                      background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)',
                      borderRadius: 6, padding: '6px 12px', color: 'var(--text-primary)', fontSize: 12, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 6
                    }}
                  >
                    <Download size={14} /> Export Report
                  </button>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Priority Level</span>
                    <div style={{ marginTop: 4, fontWeight: 700, fontSize: 14, color: caseDetail.assistant.priority_level === 'High' ? 'var(--accent-critical)' : 'var(--accent-high)' }}>
                      {caseDetail.assistant.priority_level}
                    </div>
                  </div>
                  
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Recommended Actions</span>
                    <ul style={{ marginTop: 8, padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {caseDetail.assistant.recommended_actions.map((action: string, idx: number) => (
                        <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', color: 'var(--text-secondary)', fontSize: 13 }}>
                          <span style={{ color: 'var(--accent-primary)', marginRight: 8 }}>→</span> {action}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {caseDetail.assistant.evidence_url && (
                    <div style={{ paddingTop: 16, marginTop: 8, borderTop: '1px solid var(--border-glass)' }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 12 }}>
                        Evidence / Stratus Links
                      </span>
                      <a 
                        href={caseDetail.assistant.evidence_url} 
                        target="_blank" 
                        rel="noreferrer"
                        style={{
                          display: 'inline-flex', alignItems: 'center', padding: '8px 16px',
                          background: 'var(--bg-card)', border: '1px solid var(--border-glass)',
                          borderRadius: 6, color: 'var(--text-primary)', fontSize: 13,
                          textDecoration: 'none', fontWeight: 500
                        }}
                      >
                        📄 View Evidence File (Catalyst Stratus)
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="glass-card" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(9, 14, 26, 0.2)' }}>
              <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>📂</div>
                <p style={{ margin: 0 }}>Select a case from the list to view details and AI recommendations.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
