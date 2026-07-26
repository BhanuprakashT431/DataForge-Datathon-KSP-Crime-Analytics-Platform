import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { 
  Network, AlertTriangle, Search, Play, Pause, Brain, Filter, Shield, 
  MapPin, Activity, Phone, Car, CreditCard, FileText, Crosshair, Users, Download
} from 'lucide-react';
import { generateEnterprisePDF } from '../utils/pdfGenerator';

// --- ENTERPRISE SYNTHETIC DATA GENERATOR ---
const generateEnterpriseNetworkData = () => {
  const nodes: any[] = [];
  const links: any[] = [];
  
  const syndicates = [
    { id: 'S1', name: 'Cyber Fraud Syndicate', districts: ['Bengaluru Urban', 'Mysuru'], risk: 92 },
    { id: 'S2', name: 'Vehicle Theft Ring', districts: ['Hubballi-Dharwad', 'Belagavi'], risk: 85 },
    { id: 'S3', name: 'Drug Distribution Network', districts: ['Mangaluru', 'Udupi'], risk: 95 },
    { id: 'S4', name: 'Organized Crime Group', districts: ['Kalaburagi', 'Ballari'], risk: 88 },
  ];

  let nodeIdCounter = 1;
  const generateId = (prefix: string) => `${prefix}_${nodeIdCounter++}`;

  syndicates.forEach((syndicate, sIdx) => {
    // 1. Create Leader
    const leaderId = generateId('LDR');
    nodes.push({
      id: leaderId,
      label: `Unknown (Alpha-${sIdx + 1})`,
      type: 'Gang Leader',
      syndicate: syndicate.name,
      district: syndicate.districts[0],
      risk: syndicate.risk,
      firCount: Math.floor(Math.random() * 10) + 5,
      timelineOffset: 0
    });

    // 2. Create Members (5 to 10)
    const numMembers = Math.floor(Math.random() * 6) + 5;
    const memberIds: string[] = [];
    for (let i = 0; i < numMembers; i++) {
      const memberId = generateId('MEM');
      memberIds.push(memberId);
      nodes.push({
        id: memberId,
        label: `Suspect_${memberId}`,
        type: 'Gang Member',
        syndicate: syndicate.name,
        district: syndicate.districts[Math.floor(Math.random() * syndicate.districts.length)],
        risk: syndicate.risk - Math.floor(Math.random() * 20),
        firCount: Math.floor(Math.random() * 5) + 1,
        timelineOffset: i * 2
      });
      // Link Member to Leader
      links.push({ source: memberId, target: leaderId, label: 'Co-Accused', value: 3, timelineOffset: i * 2 });
    }

    // 3. Intra-member connections
    for (let i = 0; i < numMembers; i++) {
       if (Math.random() > 0.5 && i > 0) {
          links.push({ source: memberIds[i], target: memberIds[i-1], label: 'Associate', value: 1, timelineOffset: i*2 });
       }
    }

    // 4. Create Assets (Vehicles, Phones, Banks) attached to members
    memberIds.forEach((mId, idx) => {
      // Vehicle
      if (Math.random() > 0.6) {
        const vId = generateId('VEH');
        nodes.push({ id: vId, label: `KA-${Math.floor(Math.random()*90 + 10)}-${Math.floor(Math.random()*9000 + 1000)}`, type: 'Vehicle', syndicate: syndicate.name, timelineOffset: idx * 2 + 1 });
        links.push({ source: mId, target: vId, label: 'Shared Vehicle', value: 2, timelineOffset: idx * 2 + 1 });
        // Maybe another member shares it
        if (idx > 0 && Math.random() > 0.5) links.push({ source: memberIds[idx-1], target: vId, label: 'Shared Vehicle', value: 2, timelineOffset: idx * 2 + 1 });
      }
      // Phone
      if (Math.random() > 0.3) {
        const pId = generateId('PHN');
        nodes.push({ id: pId, label: `+91 9${Math.floor(Math.random()*900000000 + 100000000)}`, type: 'Phone', syndicate: syndicate.name, timelineOffset: idx * 2 + 1 });
        links.push({ source: mId, target: pId, label: 'Call Record', value: 1, timelineOffset: idx * 2 + 1 });
        if (idx < numMembers - 1 && Math.random() > 0.5) links.push({ source: memberIds[idx+1], target: pId, label: 'Call Record', value: 1, timelineOffset: idx * 2 + 1 });
      }
      // Bank
      if (Math.random() > 0.7) {
        const bId = generateId('BNK');
        nodes.push({ id: bId, label: `AC-${Math.floor(Math.random()*900000 + 100000)}`, type: 'Bank Account', syndicate: syndicate.name, timelineOffset: idx * 2 + 2 });
        links.push({ source: mId, target: bId, label: 'Financial Transfer', value: 3, timelineOffset: idx * 2 + 2 });
        links.push({ source: leaderId, target: bId, label: 'Financial Transfer', value: 3, timelineOffset: idx * 2 + 2 });
      }
      // Victim
      if (Math.random() > 0.8) {
        const vId = generateId('VIC');
        nodes.push({ id: vId, label: `Victim_${vId}`, type: 'Victim', district: 'Unknown', timelineOffset: idx * 2 + 3 });
        links.push({ source: mId, target: vId, label: 'Targeted', value: 2, timelineOffset: idx * 2 + 3 });
      }
      // Evidence / Weapon
      if (Math.random() > 0.8) {
        const eId = generateId('EVD');
        const type = Math.random() > 0.5 ? 'Weapon' : 'Evidence';
        nodes.push({ id: eId, label: `${type}_${eId}`, type: type, timelineOffset: idx * 2 + 4 });
        links.push({ source: mId, target: eId, label: 'Evidence Match', value: 4, timelineOffset: idx * 2 + 4 });
      }
    });

    // 5. Add an Officer investigating the Leader
    const oId = generateId('OFF');
    nodes.push({ id: oId, label: `Inspector_${oId}`, type: 'Officer', district: syndicate.districts[0], timelineOffset: 50 });
    links.push({ source: oId, target: leaderId, label: 'Investigating', value: 1, timelineOffset: 50 });
  });

  return { nodes, links, syndicates };
};

const MOCK_DB = generateEnterpriseNetworkData();

export const NetworkAnalysis: React.FC = () => {
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSyndicateFilter, setActiveSyndicateFilter] = useState('All');
  
  const [timelineReplay, setTimelineReplay] = useState(false);
  const [timelineIndex, setTimelineIndex] = useState(100);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({ width: containerRef.current.clientWidth, height: containerRef.current.clientHeight });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedNode]);

  // Timeline Animation
  useEffect(() => {
    let interval: any;
    if (timelineReplay) {
      interval = setInterval(() => {
        setTimelineIndex(prev => (prev >= 100 ? 0 : prev + 2));
      }, 300);
    }
    return () => clearInterval(interval);
  }, [timelineReplay]);

  // Filter Data
  const filteredData = useMemo(() => {
    let nodes = [...MOCK_DB.nodes];
    let links = [...MOCK_DB.links];

    if (activeSyndicateFilter !== 'All') {
       nodes = nodes.filter(n => n.syndicate === activeSyndicateFilter || n.type === 'Officer' || n.type === 'Victim');
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      nodes = nodes.filter(n => n.label.toLowerCase().includes(term) || (n.syndicate && n.syndicate.toLowerCase().includes(term)));
    }

    if (timelineIndex < 100) {
      const maxOffset = (timelineIndex / 100) * 50;
      nodes = nodes.filter(n => (n.timelineOffset || 0) <= maxOffset);
      const validNodeIds = new Set(nodes.map(n => n.id));
      links = links.filter(l => validNodeIds.has(l.source.id || l.source) && validNodeIds.has(l.target.id || l.target) && (l.timelineOffset || 0) <= maxOffset);
    } else {
       const validNodeIds = new Set(nodes.map(n => n.id));
       links = links.filter(l => validNodeIds.has(l.source.id || l.source) && validNodeIds.has(l.target.id || l.target));
    }

    return { nodes, links };
  }, [searchTerm, activeSyndicateFilter, timelineIndex]);

  // Dynamic KPIs
  const kpis = useMemo(() => {
     return {
        total: filteredData.nodes.length,
        gangMembers: filteredData.nodes.filter(n => n.type === 'Gang Member' || n.type === 'Gang Leader').length,
        financialLinks: filteredData.links.filter(l => l.label === 'Financial Transfer').length,
        sharedVehicles: filteredData.links.filter(l => l.label === 'Shared Vehicle').length,
        threatLevel: filteredData.nodes.some(n => n.risk > 90) ? 'CRITICAL' : 'HIGH'
     }
  }, [filteredData]);

  // Node Canvas Rendering
  const paintNode = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const size = node.type === 'Gang Leader' ? 8 : (node.type === 'Gang Member' ? 5 : 4);
    
    // Background Circle
    ctx.beginPath();
    ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
    
    let bgColor = '#94a3b8'; // default grey
    let char = '';
    let textColor = '#fff';

    switch(node.type) {
       case 'Gang Leader': bgColor = '#ef4444'; char = '★'; break;
       case 'Gang Member': bgColor = '#dc2626'; char = 'M'; break;
       case 'Victim': bgColor = '#3b82f6'; char = 'V'; break;
       case 'Officer': bgColor = '#10b981'; char = '🛡'; break;
       case 'Vehicle': bgColor = '#a855f7'; char = '🚘'; break;
       case 'Phone': bgColor = '#eab308'; char = '📱'; break;
       case 'Bank Account': bgColor = '#f59e0b'; char = '💳'; break;
       case 'Evidence': bgColor = '#f8fafc'; char = '📄'; textColor = '#000'; break;
       case 'Weapon': bgColor = '#64748b'; char = '🔫'; break;
    }

    ctx.fillStyle = bgColor;
    ctx.fill();

    // Risk Border
    if (node.risk > 80) {
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
      ctx.stroke();
    }

    // Text inside
    const fontSize = size * 1.2;
    ctx.font = `${fontSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = textColor;
    ctx.fillText(char, node.x, node.y);

    // Label outside (if zoomed in)
    if (globalScale > 2 || node.type === 'Gang Leader') {
      ctx.font = `${4/globalScale}px Sans-Serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillText(node.label, node.x, node.y + size + 2);
    }
  }, []);

  // Link Canvas Rendering
  const paintLink = useCallback((link: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const start = link.source;
    const end = link.target;
    if (!start || !end || !start.x || !end.x) return;

    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    
    let color = 'rgba(255, 255, 255, 0.15)';
    if (link.label === 'Financial Transfer') color = 'rgba(245, 158, 11, 0.4)';
    else if (link.label === 'Call Record') color = 'rgba(59, 130, 246, 0.4)';
    else if (link.label === 'Shared Vehicle') color = 'rgba(168, 85, 247, 0.4)';
    else if (link.label === 'Co-Accused') color = 'rgba(239, 68, 68, 0.4)';
    
    ctx.strokeStyle = color;
    ctx.lineWidth = link.value ? link.value * 0.3 : 0.5;
    ctx.stroke();

    // Draw label on link if zoomed in
    if (globalScale > 3) {
      const midX = start.x + (end.x - start.x) / 2;
      const midY = start.y + (end.y - start.y) / 2;
      ctx.font = `${3/globalScale}px Sans-Serif`;
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(link.label, midX, midY);
    }
  }, []);

  return (
    <div style={{ padding: '16px 24px', height: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
      
      {/* 1. Header & AI Summary */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24 }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Network color="var(--accent-primary)" /> Enterprise Criminal Intelligence Center
          </h1>
          <div className="glass-card" style={{ padding: '12px 16px', borderLeft: '4px solid var(--accent-primary)', background: 'rgba(59, 130, 246, 0.1)' }}>
             <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-info)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
               <Brain size={14} /> AI Strategic Summary
             </h3>
             <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
               The <strong>Cyber Fraud Syndicate</strong> has expanded across Bengaluru Urban and Mysuru. Analysis indicates 3 central coordinators controlling {kpis.gangMembers} associates. <strong>{kpis.financialLinks} financial links</strong> and <strong>{kpis.sharedVehicles} shared vehicle records</strong> suggest highly organized activity. Immediate monitoring and coordinated district operations are recommended.
             </p>
          </div>
        </div>
        
        {/* KPI Panel */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, minWidth: 500 }}>
          <div className="glass-card" style={{ padding: 12, textAlign: 'center' }}>
             <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Entities</div>
             <div style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>{kpis.total}</div>
          </div>
          <div className="glass-card" style={{ padding: 12, textAlign: 'center' }}>
             <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Gang Members</div>
             <div style={{ fontSize: 24, fontWeight: 700, color: '#ef4444' }}>{kpis.gangMembers}</div>
          </div>
          <div className="glass-card" style={{ padding: 12, textAlign: 'center' }}>
             <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Financial Links</div>
             <div style={{ fontSize: 24, fontWeight: 700, color: '#f59e0b' }}>{kpis.financialLinks}</div>
          </div>
          <div className="glass-card" style={{ padding: 12, textAlign: 'center', background: kpis.threatLevel === 'CRITICAL' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)' }}>
             <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Network Threat</div>
             <div style={{ fontSize: 20, fontWeight: 700, color: kpis.threatLevel === 'CRITICAL' ? '#ef4444' : '#f59e0b', marginTop: 4 }}>{kpis.threatLevel}</div>
          </div>
        </div>
      </div>

      {/* 2. Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: 10, top: 9 }} />
              <input 
                type="text" placeholder="Search Entity or ID..." 
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-glass)', padding: '6px 12px 6px 30px', borderRadius: 6, color: 'white', fontSize: 13 }}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <Filter size={14} color="var(--text-muted)" style={{ position: 'absolute', left: 10, top: 9 }} />
              <select 
                value={activeSyndicateFilter} onChange={e => setActiveSyndicateFilter(e.target.value)}
                style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-glass)', padding: '6px 12px 6px 30px', borderRadius: 6, color: 'white', fontSize: 13, appearance: 'none', paddingRight: 30 }}
              >
                <option value="All">All Syndicates</option>
                {MOCK_DB.syndicates.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>
         </div>
         
         <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
               <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Timeline Evolution</div>
               <div style={{ width: 150, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, position: 'relative' }}>
                 <div style={{ width: `${timelineIndex}%`, height: '100%', background: 'var(--accent-primary)', position: 'absolute', left: 0, top: 0, borderRadius: 2 }} />
               </div>
            </div>
            <button 
              onClick={() => {
                if (timelineIndex >= 100) setTimelineIndex(0);
                setTimelineReplay(!timelineReplay);
              }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: timelineReplay ? 'var(--accent-critical)' : 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
            >
              {timelineReplay ? <Pause size={14} /> : <Play size={14} />} 
              {timelineReplay ? 'Pause' : 'Replay Network'}
            </button>
         </div>
      </div>

      <div style={{ display: 'flex', gap: 16, flex: 1, minHeight: 0 }}>
        {/* Main Graph Area */}
        <div className="glass-card" ref={containerRef} style={{ flex: selectedNode ? '0 0 70%' : '1', position: 'relative', overflow: 'hidden', borderRadius: 12, transition: 'all 0.3s ease' }}>
            <ForceGraph2D
              width={dimensions.width}
              height={dimensions.height}
              graphData={filteredData}
              nodeLabel={node => `<div style="background: rgba(15,23,42,0.95); padding: 8px 12px; border-radius: 6px; border: 1px solid rgba(59,130,246,0.3); font-family: sans-serif;">
                  <strong style="color: #fff; font-size: 14px; display: block; margin-bottom: 4px;">${node.label}</strong>
                  <div style="color: #94a3b8; font-size: 12px;">Type: <span style="color: #60a5fa">${node.type}</span></div>
                  ${node.syndicate ? `<div style="color: #94a3b8; font-size: 12px;">Syndicate: ${node.syndicate}</div>` : ''}
              </div>`}
              nodeCanvasObject={paintNode}
              linkCanvasObject={paintLink}
              linkDirectionalParticles={1}
              linkDirectionalParticleSpeed={d => (d as any).value * 0.002}
              onNodeClick={(node) => setSelectedNode(node)}
              backgroundColor="transparent"
            />
          
          {/* Legend Overlay */}
          <div style={{ position: 'absolute', bottom: 16, right: 16, background: 'rgba(9,15,30,0.85)', padding: '12px 16px', borderRadius: 8, fontSize: 12, border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
             <div style={{ gridColumn: '1 / -1', fontWeight: 600, color: 'var(--text-primary)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 6, marginBottom: 4 }}>Entity Legend</div>
             <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 14, height: 14, borderRadius: '50%', background: '#ef4444', display:'flex', alignItems:'center', justifyContent:'center', fontSize: 9 }}>★</div> Gang Leader</div>
             <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 14, height: 14, borderRadius: '50%', background: '#dc2626', display:'flex', alignItems:'center', justifyContent:'center', fontSize: 9 }}>M</div> Gang Member</div>
             <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 14, height: 14, borderRadius: '50%', background: '#a855f7', display:'flex', alignItems:'center', justifyContent:'center', fontSize: 9 }}>🚘</div> Vehicle</div>
             <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 14, height: 14, borderRadius: '50%', background: '#eab308', display:'flex', alignItems:'center', justifyContent:'center', fontSize: 9 }}>📱</div> Phone</div>
             <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 14, height: 14, borderRadius: '50%', background: '#f59e0b', display:'flex', alignItems:'center', justifyContent:'center', fontSize: 9 }}>💳</div> Bank A/C</div>
             <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 14, height: 14, borderRadius: '50%', background: '#f8fafc', color:'#000', display:'flex', alignItems:'center', justifyContent:'center', fontSize: 9 }}>📄</div> Evidence</div>
          </div>
        </div>

        {/* 4. Investigation Drill-down Panel */}
        {selectedNode && (
          <div className="glass-card" style={{ flex: '1', padding: 0, animation: 'fadeInRight 0.3s ease', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            
            {/* Header Profile */}
            <div style={{ padding: 24, borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(180deg, rgba(30,58,138,0.2) 0%, transparent 100%)' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                 <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div style={{ width: 64, height: 64, borderRadius: 12, background: 'var(--bg-card)', border: '2px solid var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                       {selectedNode.type === 'Gang Leader' ? '🎯' : selectedNode.type === 'Vehicle' ? '🚘' : '👤'}
                    </div>
                    <div>
                      <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 4px 0' }}>{selectedNode.label}</h2>
                      <span style={{ 
                         display: 'inline-block', padding: '4px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600,
                         background: selectedNode.type.includes('Gang') ? 'rgba(255,59,48,0.1)' : 'rgba(79,126,255,0.1)',
                         color: selectedNode.type.includes('Gang') ? 'var(--accent-critical)' : 'var(--accent-primary)',
                         border: `1px solid ${selectedNode.type.includes('Gang') ? 'rgba(255,59,48,0.3)' : 'rgba(79,126,255,0.3)'}`
                      }}>
                        {selectedNode.type}
                      </span>
                    </div>
                 </div>
                 <button onClick={() => setSelectedNode(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 20 }}>✕</button>
               </div>
            </div>

            {/* AI Tactical Recommendation */}
            <div style={{ padding: '0 24px', marginTop: 24 }}>
               <div style={{ padding: 16, background: 'rgba(59,130,246,0.05)', borderRadius: 8, borderLeft: '3px solid var(--accent-primary)' }}>
                  <h3 style={{ fontSize: 13, color: 'var(--accent-info)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                     <Shield size={14} /> AI Tactical Recommendation
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5, margin: 0 }}>
                    {selectedNode.type === 'Gang Leader' ? 'High Profile Target. Connected to multiple distinct syndicates. Recommend immediate multi-district coordinated intercept operation.' : 
                     selectedNode.type === 'Vehicle' ? 'Flagged in 3 FIRs as getaway vehicle. Alert RTO and activate ANPR highway interceptors.' : 
                     selectedNode.type === 'Bank Account' ? 'Anomalous financial velocity detected. Suspected money laundering node. Request immediate freeze order.' : 
                     'Monitor node for emerging connections. Financial and call record analysis recommended.'}
                  </p>
               </div>
            </div>

            {/* Quick Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: 24 }}>
               <div style={{ background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}><AlertTriangle size={14} /> AI Risk Score</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: selectedNode.risk > 80 ? 'var(--accent-critical)' : 'var(--accent-warning)' }}>{selectedNode.risk || 'N/A'}</div>
               </div>
               <div style={{ background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}><Activity size={14} /> Active FIRs</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>{selectedNode.firCount || 0}</div>
               </div>
               {selectedNode.district && (
                 <div style={{ gridColumn: '1 / -1', background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={14} /> Known Location</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>{selectedNode.district} District</div>
                 </div>
               )}
            </div>

            {/* Entity Links List */}
            <div style={{ padding: '0 24px 24px 24px', flex: 1 }}>
               <h3 style={{ fontSize: 14, color: 'var(--text-primary)', marginBottom: 16, fontWeight: 600 }}>Direct Network Associations</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                 {filteredData.links.filter(l => l.source.id === selectedNode.id || l.target.id === selectedNode.id).slice(0, 10).map((l, idx) => {
                    const isSource = l.source.id === selectedNode.id;
                    const linkedNode = isSource ? l.target : l.source;
                    return (
                      <div key={idx} style={{ padding: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <div>
                           <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{linkedNode.label}</div>
                           <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{linkedNode.type}</div>
                         </div>
                         <div style={{ fontSize: 11, padding: '4px 8px', background: 'rgba(255,255,255,0.1)', borderRadius: 4, color: '#e2e8f0', fontWeight: 500 }}>
                            {l.label}
                         </div>
                      </div>
                    );
                 })}
                 {filteredData.links.filter(l => l.source.id === selectedNode.id || l.target.id === selectedNode.id).length === 0 && (
                   <div style={{ padding: 16, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, background: 'rgba(0,0,0,0.2)', borderRadius: 8 }}>
                     No associations visible in current timeline.
                   </div>
                 )}
               </div>
            </div>
            {/* Export Report Button */}
            <div style={{ padding: '0 24px 24px 24px' }}>
               <button
                 onClick={() => {
                   generateEnterprisePDF({
                     title: 'Criminal Network Report',
                     district: selectedNode.district || 'Multiple',
                     riskLevel: selectedNode.risk?.toString(),
                     summary: `Intelligence profile for ${selectedNode.label} (${selectedNode.type}). Node is associated with ${filteredData.links.filter((l: any) => l.source.id === selectedNode.id || l.target.id === selectedNode.id).length} direct connections.`,
                     aiFindings: [
                       selectedNode.type === 'Gang Leader' ? 'High Profile Target. Connected to multiple distinct syndicates.' : 'Monitor node for emerging connections.'
                     ],
                     recommendations: [
                       'Initiate deep-dive background check.',
                       'Monitor financial and call records.'
                     ]
                   }, `Criminal_Network_Report_${selectedNode.id}.pdf`);
                 }}
                 style={{
                   width: '100%', background: 'var(--accent-info)', border: 'none', padding: '10px 16px',
                   borderRadius: 6, color: 'white', fontSize: 13, cursor: 'pointer', fontWeight: 600,
                   display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                 }}
               >
                 <Download size={16} /> Export Intelligence Profile
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
