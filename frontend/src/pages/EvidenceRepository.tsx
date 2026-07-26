import React, { useState } from 'react';
import { useAPI } from '../hooks/useAPI';
import { api } from '../api';
import { FileText, Camera, Video, Search, Filter, HardDrive, Share2, Download, AlertCircle, ChevronDown, ChevronUp, MapPin, Link as LinkIcon, Users, User, Shield } from 'lucide-react';
import { generateEnterprisePDF } from '../utils/pdfGenerator';

export const EvidenceRepository: React.FC = () => {
  const { data: evidenceList, loading } = useAPI(() => api.evidence());
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getIcon = (type: string) => {
    switch (type) {
      case 'CCTV':
      case 'Video':
        return <Video size={18} color="var(--accent-info)" />;
      case 'Photo':
        return <Camera size={18} color="var(--accent-primary)" />;
      case 'Audio':
      case 'Mobile Dump':
        return <HardDrive size={18} color="var(--accent-warning)" />;
      default:
        return <FileText size={18} color="var(--text-muted)" />;
    }
  };

  return (
    <div style={{ padding: 24, animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <HardDrive color="var(--accent-primary)" /> Evidence Intelligence Repository
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
            Centralized digital evidence management with AI-assisted metadata extraction and chain-of-custody tracking.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: 10 }} />
            <input 
              type="text" 
              placeholder="Search evidence..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', borderRadius: 8,
                padding: '8px 12px 8px 36px', color: 'var(--text-primary)', outline: 'none'
              }}
            />
          </div>
          <button style={{ 
            background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', borderRadius: 8,
            padding: '8px 16px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer'
          }}>
            <Filter size={16} /> Filters
          </button>
        </div>
      </div>

      <div className="glass-card" style={{ padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-glass)', textAlign: 'left', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.2)' }}>
              <th style={{ padding: '16px 20px' }}>Evidence ID</th>
              <th style={{ padding: '16px 20px' }}>Type</th>
              <th style={{ padding: '16px 20px' }}>Title</th>
              <th style={{ padding: '16px 20px' }}>Related Case</th>
              <th style={{ padding: '16px 20px' }}>Timestamp</th>
              <th style={{ padding: '16px 20px' }}>Size</th>
              <th style={{ padding: '16px 20px' }}>Status</th>
              <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(evidenceList || []).filter((item:any) => !searchTerm || item.id.toLowerCase().includes(searchTerm.toLowerCase()) || item.title.toLowerCase().includes(searchTerm.toLowerCase())).map((item: any, idx: number) => (
              <React.Fragment key={idx}>
              <tr style={{ borderBottom: expandedId === item.id ? 'none' : '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', background: expandedId === item.id ? 'rgba(255,255,255,0.02)' : 'transparent' }} onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}>
                <td style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  {expandedId === item.id ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
                  <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{item.id}</span>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{getIcon(item.type)} {item.type}</div>
                </td>
                <td style={{ padding: '16px 20px' }}>
                   {item.title}
                   {item.risk === 'Critical' && <AlertCircle size={14} color="var(--accent-critical)" style={{ marginLeft: 8, verticalAlign: 'middle' }} />}
                </td>
                <td style={{ padding: '16px 20px', color: 'var(--accent-info)' }}>{item.caseId}</td>
                <td style={{ padding: '16px 20px', color: 'var(--text-muted)' }}>{item.timestamp}</td>
                <td style={{ padding: '16px 20px', color: 'var(--text-muted)' }}>{item.size}</td>
                <td style={{ padding: '16px 20px' }}>
                  <span style={{ 
                    padding: '4px 10px', borderRadius: 12, fontSize: 12,
                    background: item.status === 'Analyzed' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 193, 7, 0.1)',
                    color: item.status === 'Analyzed' ? '#4caf50' : '#ffc107'
                  }}>
                    {item.status}
                  </span>
                </td>
                <td style={{ padding: '16px 20px', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                   <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                     <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} title="Preview"><FileText size={16} /></button>
                     <button
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} title="Download PDF Report"
                        onClick={(e) => {
                          e.stopPropagation();
                          generateEnterprisePDF({
                            title: 'Evidence Record: ' + item.id,
                            district: item.district,
                            station: item.station,
                            summary: `Evidence Title: ${item.title}. Type: ${item.type}. Status: ${item.status}. Size: ${item.size}.`,
                            aiFindings: [
                              `Hash (SHA-256): ${item.metadata_hash}`,
                              `Case ID: ${item.caseId}`,
                              `Accused: ${item.accused}`,
                              `Victim: ${item.victim}`
                            ],
                            officerNotes: `Investigating Officer: ${item.officer}. Chain of custody steps recorded: ${item.chain_of_custody}.`
                          }, `Evidence_${item.id}.pdf`);
                        }}
                     >
                        <Download size={16} />
                     </button>
                     <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} title="Share Chain of Custody"><Share2 size={16} /></button>
                   </div>
                </td>
              </tr>
              
              {expandedId === item.id && (
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td colSpan={8} style={{ padding: '0 20px 20px 45px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, padding: 16, background: 'rgba(0,0,0,0.3)', borderRadius: 8, borderLeft: '3px solid var(--accent-primary)' }}>
                       <div>
                          <h4 style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Entities</h4>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginBottom: 6 }}><User size={14} color="var(--accent-critical)"/> <strong>Accused:</strong> {item.accused}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginBottom: 6 }}><Users size={14} color="var(--accent-info)"/> <strong>Victim:</strong> {item.victim}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}><Shield size={14} color="var(--text-muted)"/> <strong>IO:</strong> {item.officer}</div>
                       </div>
                       <div>
                          <h4 style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Location</h4>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginBottom: 6 }}><MapPin size={14} color="var(--accent-primary)"/> <strong>Station:</strong> {item.station}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginBottom: 6 }}><MapPin size={14} color="var(--text-secondary)"/> <strong>District:</strong> {item.district}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}><MapPin size={14} color="var(--text-muted)"/> <strong>GPS:</strong> {item.gps}</div>
                       </div>
                       <div>
                          <h4 style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Metadata</h4>
                          <div style={{ fontSize: 13, marginBottom: 6 }}><strong>Chain of Custody:</strong> {item.chain_of_custody} steps recorded</div>
                          <div style={{ fontSize: 13, marginBottom: 6 }}><strong>Hash (SHA-256):</strong> {item.metadata_hash}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--accent-info)', cursor: 'pointer' }}><LinkIcon size={14} /> <u>{item.url}</u></div>
                       </div>
                    </div>
                  </td>
                </tr>
              )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
