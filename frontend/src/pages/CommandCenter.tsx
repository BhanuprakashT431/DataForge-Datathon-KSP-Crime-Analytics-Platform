import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Shield, Map, Activity, Users, FileText, Crosshair, MapPin, Database, Download, Brain, Network } from 'lucide-react';
import { PoliceBadge } from '../components/PoliceBadge';
import { generateEnterprisePDF } from '../utils/pdfGenerator';
import { useAuth } from '../context/AuthContext';

// Animated Counter Hook
const useCounter = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    
    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = time - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing function (easeOutExpo)
      const easePercentage = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);
      
      setCount(Math.floor(end * easePercentage));
      
      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);
  
  return count;
};

const KPICard = ({ label, value, icon, color, delay }: any) => {
  const count = useCounter(value, 2000 + delay);
  return (
    <div className="glass-card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 16, borderLeft: `4px solid ${color}`, animation: `fadeInUp 0.5s ease ${delay}ms both` }}>
       <div style={{ width: 48, height: 48, borderRadius: 8, background: `rgba(${parseInt(color.slice(1,3),16)}, ${parseInt(color.slice(3,5),16)}, ${parseInt(color.slice(5,7),16)}, 0.1)`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
       </div>
       <div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: 0.5 }}>{label}</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>{count.toLocaleString()}</div>
       </div>
    </div>
  );
};

export const CommandCenter: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleExportExecutive = () => {
    generateEnterprisePDF({
      title: 'Executive Intelligence Report',
      summary: 'Statewide intelligence overview. Threat levels elevated in Bengaluru Urban and Mysuru. Predictive modeling indicates 85% probability of increased organized activity during the festival season.',
      aiFindings: [
        'Cyber fraud activity has increased across Bengaluru Urban and Mysuru.',
        'Multiple financial links indicate organized criminal coordination.',
        'Emerging hotspot identified in Belagavi for counterfeit currency.'
      ],
      recommendations: [
        'Additional cyber patrol deployment is recommended.',
        'Initiate joint task force operations in Mysuru.',
        'Increase border checkpoint vigilance in Belagavi.'
      ]
    }, 'Executive_Command_Report.pdf');
  };

  return (
    <div style={{ padding: '24px', height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
       {/* Section 1: Header */}
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ padding: 12, background: 'rgba(29, 78, 216, 0.15)', borderRadius: 12, border: '1px solid rgba(59, 130, 246, 0.3)' }}>
              <PoliceBadge size={48} />
            </div>
             <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>Government of Karnataka • Karnataka State Police</div>
                <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', margin: '4px 0' }}>State Crime Records Bureau</h1>
                <div style={{ fontSize: 14, color: 'var(--accent-info)', fontWeight: 500 }}>AI-Driven Crime Analytics & Visualization Platform</div>
             </div>
             </div>
          </div>
          <div style={{ textAlign: 'right' }}>
             <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
                {currentTime.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
             </div>
             <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--accent-primary)', fontFamily: 'monospace', marginTop: 4 }}>
                {currentTime.toLocaleTimeString('en-IN')}
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
                <span style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>SYSTEM ONLINE • SECURE TERMINAL</span>
             </div>
             <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                Logged in as: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{user?.name || 'Authorized Officer'}</span>
             </div>
          </div>
       </div>

       {/* Section 2: State KPI Dashboard */}
       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
          <KPICard label="Total Districts" value={31} icon={<MapPin size={24} />} color="#3b82f6" delay={0} />
          <KPICard label="Police Stations" value={940} icon={<Shield size={24} />} color="#10b981" delay={100} />
          <KPICard label="Active FIRs" value={1450} icon={<FileText size={24} />} color="#f59e0b" delay={200} />
          <KPICard label="Crime Hotspots" value={128} icon={<Crosshair size={24} />} color="#ef4444" delay={300} />
          <KPICard label="Repeat Offenders" value={430} icon={<Users size={24} />} color="#8b5cf6" delay={400} />
          <KPICard label="Active Networks" value={42} icon={<Network size={24} />} color="#ec4899" delay={500} />
          <KPICard label="Patrol Vehicles" value={850} icon={<Activity size={24} />} color="#0ea5e9" delay={600} />
          <KPICard label="Prediction Accuracy" value={94} icon={<Brain size={24} />} color="#14b8a6" delay={700} />
       </div>

       <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24, marginBottom: 24 }}>
          {/* Section 4: AI Executive Brief */}
          <div className="glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column' }}>
             <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Brain size={20} color="var(--accent-info)" /> Strategic AI Executive Brief
             </h2>
             <div style={{ flex: 1, background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: 8, padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                   <span style={{ fontSize: 12, color: 'var(--accent-info)', fontWeight: 600, textTransform: 'uppercase' }}>Statewide Threat Assessment</span>
                   <span style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '4px 12px', borderRadius: 4, fontSize: 12, fontWeight: 700 }}>THREAT LEVEL: HIGH</span>
                </div>
                <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
                   Cyber fraud activity has increased across <strong>Bengaluru Urban</strong> and <strong>Mysuru</strong> districts by 14% over the last 48 hours. Multiple financial transaction links indicate organized criminal coordination spanning across 3 different syndicates.
                </p>
                <div style={{ padding: 12, background: 'rgba(0,0,0,0.3)', borderRadius: 6, borderLeft: '3px solid var(--accent-warning)' }}>
                   <strong style={{ fontSize: 13, color: 'var(--accent-warning)', display: 'block', marginBottom: 4 }}>Command Recommendation:</strong>
                   <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Additional cyber patrol deployment is recommended for identified IP clusters. Initiate financial hold requests on flagged suspect accounts.</span>
                </div>
             </div>
          </div>

          {/* Section 3: Live Situation Room */}
          <div className="glass-card" style={{ padding: 24 }}>
             <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={20} color="var(--accent-warning)" /> Live Situation Room
             </h2>
             <div className="situation-feed" style={{ height: 200, overflowY: 'auto', paddingRight: 8 }}>
                {[
                  { time: '08:42', alert: 'Cyber Fraud Network detected', location: 'Bengaluru Urban', level: 'HIGH', color: '#ef4444' },
                  { time: '08:35', alert: 'Vehicle Theft Cluster', location: 'Mysuru', level: 'MEDIUM', color: '#f59e0b' },
                  { time: '08:12', alert: 'Counterfeit Currency Alert', location: 'Belagavi', level: 'CRITICAL', color: '#b91c1c' },
                  { time: '07:58', alert: 'Drug Distribution Network', location: 'Kalaburagi', level: 'HIGH', color: '#ef4444' },
                  { time: '07:30', alert: 'Missing Person Alert', location: 'Hubballi-Dharwad', level: 'MEDIUM', color: '#f59e0b' }
                ].map((item, idx) => (
                  <div key={idx} style={{ padding: 12, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 12 }}>
                     <div style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 600, width: 40 }}>{item.time}</div>
                     <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600, marginBottom: 2 }}>{item.alert}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.location}</div>
                     </div>
                     <div style={{ color: item.color, fontSize: 11, fontWeight: 700 }}>{item.level}</div>
                  </div>
                ))}
             </div>
             <style>{`
                .situation-feed::-webkit-scrollbar { width: 4px; }
                .situation-feed::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); borderRadius: 4px; }
             `}</style>
          </div>
       </div>

       {/* Section 5: Quick Actions */}
       <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Command Center Actions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
             
             <button onClick={() => navigate('/map')} className="btn-primary" style={{ height: 100, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 12, background: 'rgba(59, 130, 246, 0.1)' }}>
                <Map size={28} />
                <span style={{ fontSize: 13 }}>Karnataka GIS</span>
             </button>
             
             <button onClick={() => navigate('/network')} className="btn-primary" style={{ height: 100, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 12, background: 'rgba(139, 92, 246, 0.1)' }}>
                <Network size={28} />
                <span style={{ fontSize: 13 }}>Network Analysis</span>
             </button>
             
             <button onClick={() => navigate('/predictions')} className="btn-primary" style={{ height: 100, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 12, background: 'rgba(16, 185, 129, 0.1)' }}>
                <Brain size={28} />
                <span style={{ fontSize: 13 }}>AI Predictions</span>
             </button>
             
             <button onClick={() => navigate('/evidence')} className="btn-primary" style={{ height: 100, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 12, background: 'rgba(245, 158, 11, 0.1)' }}>
                <Database size={28} />
                <span style={{ fontSize: 13 }}>Evidence Repository</span>
             </button>
             
             <button onClick={() => navigate('/offenders')} className="btn-primary" style={{ height: 100, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 12, background: 'rgba(236, 72, 153, 0.1)' }}>
                <Users size={28} />
                <span style={{ fontSize: 13 }}>Offender Profiles</span>
             </button>
             
             <button onClick={() => navigate('/reports')} className="btn-primary" style={{ height: 100, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 12, background: 'rgba(14, 165, 233, 0.1)' }}>
                <FileText size={28} />
                <span style={{ fontSize: 13 }}>Decision Support</span>
             </button>

             <button onClick={handleExportExecutive} className="btn-primary" style={{ height: 100, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 12, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                <Download size={28} />
                <span style={{ fontSize: 13 }}>Executive Report</span>
             </button>

          </div>
       </div>

    </div>
  );
};
