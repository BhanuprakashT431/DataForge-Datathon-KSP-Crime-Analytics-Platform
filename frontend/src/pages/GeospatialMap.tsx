import React, { useState, useMemo, useEffect } from 'react';
import { MapContainer, Popup, GeoJSON, useMap, Marker, CircleMarker, Polyline } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapIcon, Clock, Target, AlertTriangle, Shield, User, Camera, FileText, Brain, Download, ChevronRight, Activity } from 'lucide-react';
import { generateEnterprisePDF } from '../utils/pdfGenerator';

const KARNATAKA_CENTER: [number, number] = [15.3173, 75.7139];

const MapController = ({ 
  selectedDistrict, 
  selectedTaluk, 
  selectedVillage, 
  geojsonData, 
  hierarchyData 
}: { 
  selectedDistrict: string | null, 
  selectedTaluk: string | null, 
  selectedVillage: string | null, 
  geojsonData: any, 
  hierarchyData: any 
}) => {
  const map = useMap();
  useEffect(() => {
    if (selectedVillage && selectedTaluk && selectedDistrict && hierarchyData) {
      const v = hierarchyData[selectedDistrict]?.taluks[selectedTaluk]?.villages[selectedVillage];
      if (v) map.flyTo([v.lat, v.lon], 13, { duration: 1.5 });
    } else if (selectedTaluk && selectedDistrict && hierarchyData) {
      const t = hierarchyData[selectedDistrict]?.taluks[selectedTaluk];
      if (t) map.flyTo([t.lat, t.lon], 11, { duration: 1.5 });
    } else if (selectedDistrict && geojsonData) {
      const feature = geojsonData.features.find((f: any) => f.properties.district === selectedDistrict);
      if (feature) {
        const bounds = L.geoJSON(feature).getBounds();
        map.flyToBounds(bounds, { padding: [50, 50], duration: 1.5 });
      }
    } else {
      map.flyTo(KARNATAKA_CENTER, 7, { duration: 1.5 });
    }
  }, [selectedDistrict, selectedTaluk, selectedVillage, geojsonData, hierarchyData, map]);
  return null;
};

const createIcon = (emoji: string, color: string) => L.divIcon({
  html: `<div style="background: ${color}; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.5);">${emoji}</div>`,
  className: 'custom-div-icon',
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});
const stationIcon = createIcon('🛡️', '#10b981');
const patrolIcon = createIcon('🚓', '#3b82f6');
const cctvIcon = createIcon('🎥', '#64748b');
const evidenceIcon = createIcon('📄', '#f59e0b');

const talukIcon = createIcon('📍', '#8b5cf6');
const villageIcon = createIcon('🏘️', '#ec4899');

export const GeospatialMap: React.FC = () => {
  const [geojsonData, setGeojsonData] = useState<any>(null);
  const [hierarchyData, setHierarchyData] = useState<any>(null);
  const [geoDataError, setGeoDataError] = useState(false);
  
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedTaluk, setSelectedTaluk] = useState<string | null>(null);
  const [selectedVillage, setSelectedVillage] = useState<string | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<any>(null);
  
  const [timeValue, setTimeValue] = useState(24);
  const [showHotspots, setShowHotspots] = useState(true);
  const [showStations, setShowStations] = useState(true);
  const [showAssets, setShowAssets] = useState(true);
  const [isLiveMode, setIsLiveMode] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/data/karnataka_districts.geojson').then(res => res.json()),
      fetch('/data/karnataka_hierarchy.json').then(res => res.json())
    ])
    .then(([geojson, hierarchy]) => {
      setGeojsonData(geojson);
      setHierarchyData(hierarchy);
    })
    .catch(err => {
      console.error(err);
      setGeoDataError(true);
    });
  }, []);

  const handleDistrictSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedDistrict(val === "" ? null : val);
    setSelectedTaluk(null);
    setSelectedVillage(null);
    setSelectedEntity(null);
  };

  const kpis = useMemo(() => {
    if (!hierarchyData) return null;
    let totalFIRs: number | string = 0;
    let totalStations: number | string = 0;
    
    if (selectedVillage && selectedTaluk && selectedDistrict) {
       const v = hierarchyData[selectedDistrict].taluks[selectedTaluk].villages[selectedVillage];
       totalFIRs = v.hotspots.length;
       totalStations = v.stations.length;
       return { level: 'Village', firs: totalFIRs, stations: totalStations, risk: v.threat_level };
    } else if (selectedTaluk && selectedDistrict) {
       const t = hierarchyData[selectedDistrict].taluks[selectedTaluk];
       totalFIRs = t.total_firs;
       totalStations = Number(Object.values(t.villages).reduce((acc: any, v: any) => acc + v.stations.length, 0));
       return { level: 'Taluk', firs: totalFIRs, stations: totalStations, risk: 'High' };
    } else if (selectedDistrict) {
       const d = hierarchyData[selectedDistrict];
       totalFIRs = Number(Object.values(d.taluks).reduce((acc: any, t: any) => acc + t.total_firs, 0));
       return { level: 'District', firs: totalFIRs, stations: 'Multiple', risk: d.threat_level };
    } else {
       return { level: 'State', firs: '1,450+', stations: '940+', risk: 'Elevated' };
    }
  }, [hierarchyData, selectedDistrict, selectedTaluk, selectedVillage]);

  if (geoDataError) return <div style={{ padding: 24, color: '#ef4444' }}>CRITICAL: Offline GeoJSON or Hierarchy data missing.</div>;
  if (!geojsonData || !hierarchyData) return <div className="spinner" style={{ margin: 'auto' }} />;

  const districtsList = Object.keys(hierarchyData).sort();

  return (
    <div style={{ position: 'relative', height: 'calc(100vh - 64px)', width: '100%', overflow: 'hidden' }}>
      
      <style>
        {`
          .animated-route {
            stroke-dasharray: 10, 15;
            animation: dashAnim 3s linear infinite;
          }
          .animated-route-critical {
            stroke-dasharray: 5, 10;
            animation: dashAnim 1.5s linear infinite;
          }
          @keyframes dashAnim {
            to { stroke-dashoffset: -50; }
          }
        `}
      </style>

      {/* 1. Top Control Panel */}
      <div style={{
        position: 'absolute', top: 16, left: 16, right: 16, zIndex: 1000,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        pointerEvents: 'none'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, pointerEvents: 'auto' }}>
           <div style={{ display: 'flex', gap: 12 }}>
             <div className="glass-card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, minWidth: 400 }}>
               <MapIcon size={20} color="var(--accent-primary)" />
             <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600 }}>
                <span style={{ cursor: 'pointer', color: !selectedDistrict ? 'var(--accent-primary)' : 'var(--text-secondary)' }} 
                      onClick={() => { setSelectedDistrict(null); setSelectedTaluk(null); setSelectedVillage(null); setSelectedEntity(null); }}>
                   Karnataka
                </span>
                
                {selectedDistrict && (
                  <>
                    <ChevronRight size={14} color="var(--text-muted)" />
                    <span style={{ cursor: 'pointer', color: !selectedTaluk ? 'var(--accent-primary)' : 'var(--text-secondary)' }}
                          onClick={() => { setSelectedTaluk(null); setSelectedVillage(null); setSelectedEntity(null); }}>
                       {selectedDistrict}
                    </span>
                  </>
                )}

                {selectedTaluk && (
                  <>
                    <ChevronRight size={14} color="var(--text-muted)" />
                    <span style={{ cursor: 'pointer', color: !selectedVillage ? 'var(--accent-primary)' : 'var(--text-secondary)' }}
                          onClick={() => { setSelectedVillage(null); setSelectedEntity(null); }}>
                       {selectedTaluk}
                    </span>
                  </>
                )}

                {selectedVillage && (
                  <>
                    <ChevronRight size={14} color="var(--text-muted)" />
                    <span style={{ color: 'var(--accent-primary)' }}>{selectedVillage}</span>
                  </>
                )}
             </div>
           </div>
           
           <button 
             onClick={() => setIsLiveMode(!isLiveMode)}
             style={{
                background: isLiveMode ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${isLiveMode ? 'rgba(239, 68, 68, 0.4)' : 'rgba(255,255,255,0.1)'}`,
                color: isLiveMode ? '#ef4444' : 'var(--text-secondary)',
                padding: '0 20px',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
             }}
           >
              <Activity size={16} />
              {isLiveMode ? '● LIVE THREAT FEED ACTIVE' : 'ENABLE LIVE FEED'}
           </button>
           </div>

           {/* District Dropdown */}
           {!selectedTaluk && (
             <select 
                className="filter-select" 
                value={selectedDistrict || ""} 
                onChange={handleDistrictSelect}
                style={{ width: 250 }}
             >
                <option value="">Select District...</option>
                {districtsList.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
             </select>
           )}
        </div>

        {/* Global Filters & Time Slider */}
        <div className="glass-card" style={{ padding: 16, pointerEvents: 'auto', width: 280, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
               <Clock size={14} color="var(--accent-info)" /> Temporal Filter
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-primary)' }}>
               {timeValue.toString().padStart(2, '0')}:00 HRS
            </div>
          </div>
          <input 
            type="range" min="0" max="24" value={timeValue} 
            onChange={(e) => setTimeValue(Number(e.target.value))}
            style={{ width: '100%', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
             <label style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
               <input type="checkbox" checked={showHotspots} onChange={e => setShowHotspots(e.target.checked)} /> Hotspots
             </label>
             <label style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
               <input type="checkbox" checked={showStations} onChange={e => setShowStations(e.target.checked)} /> Stations
             </label>
             <label style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
               <input type="checkbox" checked={showAssets} onChange={e => setShowAssets(e.target.checked)} /> Assets
             </label>
          </div>
        </div>
      </div>

      {/* Main Map Container */}
      <MapContainer 
        center={KARNATAKA_CENTER} 
        zoom={7} 
        style={{ height: '100%', width: '100%', background: isLiveMode ? 'rgba(5, 10, 20, 0.3)' : '#050a14', zIndex: 1 }} // transparent in live mode
        zoomControl={false}
      >
        <MapController 
           selectedDistrict={selectedDistrict} 
           selectedTaluk={selectedTaluk} 
           selectedVillage={selectedVillage} 
           geojsonData={geojsonData} 
           hierarchyData={hierarchyData}
        />
        
        {/* Karnataka District Polygons */}
        <GeoJSON
           data={geojsonData}
           style={(feature: any) => {
              const dist = feature.properties.district;
              const dData = hierarchyData[dist];
              const isSelected = selectedDistrict === dist;
              const isDimmed = selectedDistrict && !isSelected;
              
              let fillColor = '#334155';
              if (dData) {
                 fillColor = dData.risk_score > 85 ? '#ef4444' : (dData.risk_score > 70 ? '#f59e0b' : '#10b981');
              }
              
              return {
                 fillColor: fillColor,
                 weight: isSelected ? 3 : 1,
                 opacity: isDimmed ? 0.3 : 1,
                 color: isSelected ? '#fff' : 'rgba(255,255,255,0.4)',
                 fillOpacity: isSelected ? 0.1 : (isDimmed ? 0.05 : 0.4)
              };
           }}
           onEachFeature={(feature, layer) => {
              layer.on({
                 click: () => {
                    setSelectedDistrict(feature.properties.district);
                    setSelectedTaluk(null);
                    setSelectedVillage(null);
                    setSelectedEntity(null);
                 },
                 mouseover: (e) => {
                    if (!selectedDistrict) e.target.setStyle({ weight: 2, color: '#fff', fillOpacity: 0.6 });
                 },
                 mouseout: (e) => {
                    if (!selectedDistrict) e.target.setStyle({ weight: 1, color: 'rgba(255,255,255,0.4)', fillOpacity: 0.4 });
                 }
              });
              layer.bindTooltip(`<strong>${feature.properties.district}</strong>`);
           }}
        />

        {/* Level 2: Taluks (Shown when District is selected and Taluk is NOT selected) */}
        {selectedDistrict && !selectedTaluk && Object.entries(hierarchyData[selectedDistrict].taluks).map(([tName, tData]: any) => (
           <Marker 
              key={tName} 
              position={[tData.lat, tData.lon]} 
              icon={talukIcon}
              eventHandlers={{ click: () => { setSelectedTaluk(tName); setSelectedVillage(null); setSelectedEntity(null); } }}
           >
              <Popup>{tName} Taluk</Popup>
           </Marker>
        ))}

        {/* Level 3: Villages (Shown when Taluk is selected and Village is NOT selected) */}
        {selectedDistrict && selectedTaluk && !selectedVillage && Object.entries(hierarchyData[selectedDistrict].taluks[selectedTaluk].villages).map(([vName, vData]: any) => (
           <Marker 
              key={vName} 
              position={[vData.lat, vData.lon]} 
              icon={villageIcon}
              eventHandlers={{ click: () => { setSelectedVillage(vName); setSelectedEntity(null); } }}
           >
              <Popup>{vName}</Popup>
           </Marker>
        ))}

        {/* Level 4: Assets (Shown when Village is selected) */}
        {selectedDistrict && selectedTaluk && selectedVillage && (
           <MarkerClusterGroup chunkedLoading maxClusterRadius={40}>
              {(() => {
                 const vData = hierarchyData[selectedDistrict].taluks[selectedTaluk].villages[selectedVillage];
                 const markers = [];
                 
                 if (showStations) {
                    vData.stations.forEach((s: any) => {
                       markers.push(
                         <Marker key={s.id} position={[s.lat, s.lon]} icon={stationIcon} eventHandlers={{ click: () => setSelectedEntity(s) }} />
                       );
                    });
                 }
                 if (showHotspots) {
                    vData.hotspots.forEach((h: any) => {
                       markers.push(
                         <CircleMarker
                           key={h.id}
                           center={[h.lat, h.lon]}
                           radius={h.severity === 'Critical' ? 12 : 8}
                           pathOptions={{
                             color: h.severity === 'Critical' ? '#ef4444' : '#f59e0b',
                             fillColor: h.severity === 'Critical' ? '#ef4444' : '#f59e0b',
                             fillOpacity: 0.8,
                             weight: 2
                           }}
                           eventHandlers={{ click: () => setSelectedEntity(h) }}
                         />
                       );
                    });
                 }
                 if (showAssets) {
                    vData.assets.forEach((a: any) => {
                       markers.push(
                         <Marker key={a.id} position={[a.lat, a.lon]} icon={a.type === 'Patrol' ? patrolIcon : (a.type === 'CCTV' ? cctvIcon : evidenceIcon)} />
                       );
                    });
                 }
                 return markers;
              })()}
           </MarkerClusterGroup>
        )}

         {/* Live Network Routes (Shown in Live Mode) */}
         {isLiveMode && (
            <>
              {Object.entries(hierarchyData).map(([dName, dData]: any) => {
                // If a district is selected, only show routes within that district
                if (selectedDistrict && selectedDistrict !== dName) return null;
                
                return Object.entries(dData.taluks).map(([tName, tData]: any) => {
                  // Connect Taluk to District Center
                  const routes = [];
                  if (!selectedTaluk || selectedTaluk === tName) {
                    const isCritical = tData.risk_score > 75;
                    routes.push(
                      <Polyline
                        key={`route-${dName}-${tName}`}
                        positions={[[dData.lat, dData.lon], [tData.lat, tData.lon]]}
                        pathOptions={{
                          color: isCritical ? '#ef4444' : '#3b82f6',
                          weight: isCritical ? 2 : 1,
                          opacity: 0.6,
                          className: isCritical ? 'animated-route-critical' : 'animated-route'
                        }}
                      />
                    );
                  }
                  return routes;
                });
              })}
            </>
         )}
      </MapContainer>

      {/* Intelligence Drill-Down Panels */}
      
      {/* Hierarchical Overview Panel */}
      {!selectedEntity && (
         <div className="glass-card" style={{
           position: 'absolute', right: 16, top: 16, bottom: 16, width: 350, zIndex: 1000,
           animation: 'fadeInRight 0.3s ease', display: 'flex', flexDirection: 'column'
         }}>
            <div style={{ marginBottom: 20 }}>
               <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{kpis?.level} COMMAND VIEW</div>
               <h2 style={{ fontSize: 22, fontWeight: 700, margin: '4px 0 16px' }}>
                 {selectedVillage || selectedTaluk || selectedDistrict || 'Karnataka State'}
               </h2>
               
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: 12, borderRadius: 8 }}>
                     <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Active FIRs</div>
                     <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--accent-warning)' }}>{kpis?.firs}</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: 12, borderRadius: 8 }}>
                     <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Threat Level</div>
                     <div style={{ fontSize: 18, fontWeight: 700, color: kpis?.risk === 'Critical' ? '#ef4444' : (kpis?.risk === 'High' ? '#f59e0b' : '#10b981'), marginTop: 4 }}>
                       {kpis?.risk}
                     </div>
                  </div>
               </div>

               <div style={{ padding: 16, background: 'rgba(59,130,246,0.1)', borderRadius: 8, borderLeft: '3px solid var(--accent-primary)', marginBottom: 20 }}>
                  <h3 style={{ fontSize: 13, color: 'var(--accent-info)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                     <Brain size={14} /> AI Strategic Intelligence
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5, margin: 0 }}>
                    Crime density indicates emerging patterns at the current tactical level. Historical comparison shows anomaly in spatial clustering. Recommend redeployment.
                  </p>
               </div>
               
               <button
                  onClick={() => {
                    generateEnterprisePDF({
                      title: `${kpis?.level} Intelligence Report`,
                      district: selectedDistrict || 'All',
                      riskLevel: kpis?.risk,
                      summary: `Crime density indicates emerging patterns at the current tactical level. Historical comparison shows anomaly in spatial clustering.`,
                      recommendations: [
                        'Redeploy reserve units to identified hotspots.',
                        'Increase perimeter surveillance at key junctions.',
                      ]
                    }, `${kpis?.level}_Intelligence_Report.pdf`);
                  }}
                  style={{
                    background: 'var(--accent-info)', border: 'none', padding: '10px 16px', marginBottom: 20, width: '100%',
                    borderRadius: 6, color: 'white', fontSize: 13, cursor: 'pointer', fontWeight: 600,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                  }}
               >
                  <Download size={16} /> Export {kpis?.level} Report
               </button>
            </div>
            
            <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginTop: 'auto', background: 'rgba(0,0,0,0.2)', padding: 12, borderRadius: 8 }}>
               <strong>Hierarchy:</strong> Karnataka State → District → Taluk → Village/Ward → Entity. <br/>Click markers to drill down.
            </div>
         </div>
      )}

      {/* Police Station / Incident Panel */}
      {selectedEntity && (
         <div className="glass-card" style={{
           position: 'absolute', right: 16, top: 16, bottom: 16, width: 350, zIndex: 1000,
           animation: 'fadeInRight 0.3s ease', display: 'flex', flexDirection: 'column'
         }}>
            <div style={{ padding: 20, borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(180deg, rgba(30,58,138,0.2) 0%, transparent 100%)', margin: '-24px -24px 20px -24px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                 <div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                       {selectedEntity.type === 'Hotspot' ? 'CRIME INCIDENT INTELLIGENCE' : 'POLICE STATION COMMAND'}
                    </div>
                    <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>
                       {selectedEntity.type === 'Hotspot' ? selectedEntity.id : selectedEntity.name}
                    </h2>
                 </div>
                 <button onClick={() => setSelectedEntity(null)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 20 }}>✕</button>
               </div>
            </div>
            
            {/* Incident View */}
            {selectedEntity.type === 'Hotspot' && (
               <div style={{ flex: 1, overflowY: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                     <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Crime Type</span>
                     <span style={{ fontSize: 13, fontWeight: 600 }}>{selectedEntity.crime_type}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                     <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Severity</span>
                     <span style={{ fontSize: 13, fontWeight: 600, color: selectedEntity.severity === 'Critical' ? '#ef4444' : '#f59e0b' }}>{selectedEntity.severity}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                     <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Time Logged</span>
                     <span style={{ fontSize: 13, fontWeight: 600 }}>{selectedEntity.time_logged}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                     <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Suspect Linked</span>
                     <span style={{ fontSize: 13, fontWeight: 600, color: selectedEntity.suspect_linked ? '#ef4444' : '#10b981' }}>{selectedEntity.suspect_linked ? 'YES' : 'NO'}</span>
                  </div>
                  
                  <div style={{ marginTop: 24, padding: 16, background: 'rgba(239, 68, 68, 0.1)', borderRadius: 8, borderLeft: '3px solid #ef4444' }}>
                     <h3 style={{ fontSize: 13, color: '#ef4444', marginBottom: 8, fontWeight: 600 }}>AI Network Detection</h3>
                     <p style={{ fontSize: 12, color: 'var(--text-primary)', margin: 0 }}>
                       Incident modus operandi matches known signatures of Organized Syndicate active in {selectedTaluk}. Suspect linked to prior FIRs.
                     </p>
                  </div>
               </div>
            )}

            {/* Police Station View */}
            {selectedEntity.type === 'Police Station' && (
               <div style={{ flex: 1, overflowY: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                     <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Officer In Charge</span>
                     <span style={{ fontSize: 13, fontWeight: 600 }}>{selectedEntity.officer}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                     <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Active FIRs</span>
                     <span style={{ fontSize: 13, fontWeight: 600 }}>{selectedEntity.active_firs}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                     <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Patrol Strength</span>
                     <span style={{ fontSize: 13, fontWeight: 600 }}>{selectedEntity.patrol_strength} Units Active</span>
                  </div>

                  <div style={{ marginTop: 24, padding: 16, background: 'rgba(59, 130, 246, 0.1)', borderRadius: 8, borderLeft: '3px solid var(--accent-primary)' }}>
                     <h3 style={{ fontSize: 13, color: 'var(--accent-info)', marginBottom: 8, fontWeight: 600 }}>AI Deployment Advisory</h3>
                     <p style={{ fontSize: 12, color: 'var(--text-primary)', margin: 0 }}>
                       Current patrol strength is inadequate for forecasted night-time crime clusters. Recommend dispatching additional Rapid Action units.
                     </p>
                  </div>
                  
                  <button
                     onClick={() => {
                       generateEnterprisePDF({
                         title: 'Police Station Intelligence Report',
                         district: selectedDistrict || '',
                         station: selectedEntity.name,
                         summary: `Operational overview of ${selectedEntity.name} commanded by ${selectedEntity.officer}.`,
                         aiFindings: [
                           `Current patrol strength is inadequate for forecasted night-time crime clusters.`,
                           `Station is actively managing ${selectedEntity.active_firs} FIRs concurrently.`
                         ],
                         recommendations: [
                           'Dispatch additional Rapid Action units.',
                           'Monitor hotspot clusters in immediate 5km radius.'
                         ]
                       }, 'Station_Intelligence_Report.pdf');
                     }}
                     style={{
                       width: '100%', background: 'var(--accent-info)', border: 'none', padding: '10px 16px', marginTop: 20,
                       borderRadius: 6, color: 'white', fontSize: 13, cursor: 'pointer', fontWeight: 600,
                       display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                     }}
                  >
                     <Download size={16} /> Export Station Report
                  </button>
               </div>
            )}
         </div>
      )}
    </div>
  );
};
