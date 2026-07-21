import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import 'leaflet/dist/leaflet.css';
import { useAPI } from '../hooks/useAPI';
import { api } from '../api';

const CRIME_COLORS: Record<string, string> = {
  'Theft': '#4f7eff', 'Robbery': '#f97316', 'Assault': '#ef4444',
  'Murder': '#dc2626', 'Fraud': '#a855f7', 'Cybercrime': '#38bdf8',
  'Drug Trafficking': '#14b8a6', 'Kidnapping': '#f43f5e',
  'Burglary': '#eab308', 'Vehicle Theft': '#6366f1',
};

const SEVERITY_COLORS: Record<string, string> = {
  Critical: '#ef4444', High: '#f97316', Medium: '#eab308', Low: '#22c55e',
};

const CRIME_TYPES = [
  'All', 'Theft', 'Robbery', 'Assault', 'Murder', 'Fraud',
  'Cybercrime', 'Drug Trafficking', 'Kidnapping', 'Burglary', 'Vehicle Theft',
];

const KARNATAKA_CENTER: [number, number] = [14.5, 75.7];

function HotspotLayer({ hotspots }: { hotspots: any[] }) {
  return (
    <>
      {hotspots.map((hs) => (
        <CircleMarker
          key={hs.cluster_id}
          center={[hs.center_lat, hs.center_lon]}
          radius={Math.max(10, Math.min(40, hs.incident_count / 5))}
          pathOptions={{
            color: hs.alert_level === 'Critical' ? '#ef4444' : hs.alert_level === 'High' ? '#f97316' : '#eab308',
            fillColor: hs.alert_level === 'Critical' ? '#ef4444' : hs.alert_level === 'High' ? '#f97316' : '#eab308',
            fillOpacity: 0.25,
            weight: 2,
            opacity: 0.8,
          }}
        >
          <Popup>
            <div style={{ minWidth: 200, fontFamily: 'Inter, sans-serif' }}>
              <div style={{ fontWeight: 700, color: '#f0f4ff', marginBottom: 8, fontSize: 14 }}>
                🔴 Crime Hotspot #{hs.cluster_id + 1}
              </div>
              <div style={{ color: '#8899bb', fontSize: 12, marginBottom: 8 }}>
                Alert Level: <span style={{ color: SEVERITY_COLORS[hs.alert_level], fontWeight: 600 }}>{hs.alert_level}</span>
              </div>
              <div style={{ fontSize: 12, marginBottom: 4 }}>
                📍 Districts: {hs.districts?.join(', ')}
              </div>
              <div style={{ fontSize: 12, marginBottom: 4 }}>
                ⚡ Incidents: <strong style={{ color: '#f0f4ff' }}>{hs.incident_count}</strong>
              </div>
              <div style={{ fontSize: 12, marginBottom: 4 }}>
                🎯 Dominant: <strong style={{ color: CRIME_COLORS[hs.dominant_crime] || '#4f7eff' }}>{hs.dominant_crime}</strong>
              </div>
              <div style={{ fontSize: 12 }}>
                📊 Intensity: <strong style={{ color: '#f0f4ff' }}>{hs.intensity}/100</strong>
              </div>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </>
  );
}

function CrimePointsLayer({ points, maxPoints = 800 }: { points: any[], maxPoints?: number }) {
  const sampled = points.slice(0, maxPoints);
  return (
    <>
      {sampled.map((p, i) => (
        <CircleMarker
          key={i}
          center={[p.lat, p.lon]}
          radius={3}
          pathOptions={{
            color: CRIME_COLORS[p.type] || '#4f7eff',
            fillColor: CRIME_COLORS[p.type] || '#4f7eff',
            fillOpacity: 0.6,
            weight: 0,
          }}
        />
      ))}
    </>
  );
}

function DistrictMarkersLayer({ districts, onSelect }: { districts: any[], onSelect: (d: any) => void }) {
  return (
    <>
      {districts.map((d) => (
        <CircleMarker
          key={d.district}
          center={[d.lat, d.lon]}
          radius={8}
          pathOptions={{
            color: 'rgba(79,126,255,0.8)',
            fillColor: '#1a3a8f',
            fillOpacity: 0.7,
            weight: 1.5,
          }}
          eventHandlers={{ click: () => onSelect(d) }}
        >
          <Popup>
            <div style={{ fontFamily: 'Inter, sans-serif', minWidth: 180 }}>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6, color: '#f0f4ff' }}>
                📍 {d.district}
              </div>
              <div style={{ fontSize: 12, color: '#8899bb', marginBottom: 4 }}>
                Total Crimes: <strong style={{ color: '#f0f4ff' }}>{d.total_crimes}</strong>
              </div>
              <div style={{ fontSize: 12, color: '#8899bb', marginBottom: 4 }}>
                Per Lakh Pop: <strong style={{ color: '#4f7eff' }}>{d.crimes_per_lakh}</strong>
              </div>
              <div style={{ fontSize: 12, color: '#8899bb', marginBottom: 4 }}>
                Solve Rate: <strong style={{ color: '#22c55e' }}>{d.solve_rate}%</strong>
              </div>
              <div style={{ fontSize: 12, color: '#8899bb' }}>
                Critical: <strong style={{ color: '#ef4444' }}>{d.critical_incidents}</strong>
              </div>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </>
  );
}

export const GeospatialMap: React.FC = () => {
  const { data: districts } = useAPI(() => api.districts());
  const { data: hotspots }  = useAPI(() => api.hotspots());
  const [crimeType, setCrimeType] = useState('All');
  const [mapMode, setMapMode] = useState<'districts' | 'hotspots' | 'points'>('hotspots');
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
  const { data: mapPoints } = useAPI(
    () => api.mapPoints(crimeType !== 'All' ? { crime_type: crimeType } : undefined),
    [crimeType]
  );
  const { data: districtDetail } = useAPI(
    () => selectedDistrict ? api.districtDetail(selectedDistrict.district) : Promise.resolve(null),
    [selectedDistrict?.district]
  );

  const topCrimeTypes = selectedDistrict
    ? Object.entries(selectedDistrict.by_type || {})
        .map(([name, value]) => ({ name, value }))
        .sort((a: any, b: any) => b.value - a.value)
        .slice(0, 6)
    : [];

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 48px)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <h1 className="page-title">Geospatial Crime Map</h1>
          <p className="page-subtitle">Interactive Karnataka crime hotspot visualization · Click districts for drill-down</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div style={{ display: 'flex', gap: 4 }}>
          {(['districts', 'hotspots', 'points'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setMapMode(mode)}
              className={`btn ${mapMode === mode ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: 12, textTransform: 'capitalize' }}
            >
              {mode === 'districts' ? '🗺 Districts' : mode === 'hotspots' ? '🔥 Hotspots' : '📍 Incidents'}
            </button>
          ))}
        </div>
        <select
          className="filter-select"
          value={crimeType}
          onChange={(e) => setCrimeType(e.target.value)}
          style={{ minWidth: 160 }}
        >
          {CRIME_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
        {hotspots && (
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginLeft: 'auto' }}>
            <span style={{ color: 'var(--accent-critical)', fontWeight: 700 }}>{hotspots.length}</span> active clusters detected
          </div>
        )}
      </div>

      {/* Main Layout */}
      <div style={{ display: 'flex', gap: 16, flex: 1, minHeight: 0 }}>
        {/* Map */}
        <div style={{ flex: 1, position: 'relative' }}>
          <div className="map-container" style={{ height: '100%' }}>
            <MapContainer
              center={KARNATAKA_CENTER}
              zoom={7}
              style={{ height: '100%', width: '100%' }}
              zoomControl={true}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap"
              />
              {mapMode === 'hotspots' && hotspots && (
                <HotspotLayer hotspots={hotspots} />
              )}
              {mapMode === 'districts' && districts && (
                <DistrictMarkersLayer districts={districts} onSelect={setSelectedDistrict} />
              )}
              {mapMode === 'points' && mapPoints && (
                <CrimePointsLayer points={mapPoints} />
              )}
            </MapContainer>
          </div>

          {/* Map Legend */}
          <div style={{
            position: 'absolute', bottom: 16, left: 16, zIndex: 1000,
            background: 'rgba(5,11,24,0.9)', border: '1px solid var(--border-glass)',
            borderRadius: 10, padding: '12px 16px', backdropFilter: 'blur(20px)',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Alert Levels
            </div>
            {[
              { color: '#ef4444', label: 'Critical' },
              { color: '#f97316', label: 'High' },
              { color: '#eab308', label: 'Medium' },
            ].map((l) => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: l.color }} />
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ width: 300, display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
          {/* Hotspot Summary */}
          <div className="glass-card" style={{ padding: 16 }}>
            <div className="card-title" style={{ marginBottom: 12 }}>🔥 Hotspot Summary</div>
            {hotspots?.slice(0, 6).map((hs: any, i: number) => (
              <div key={hs.cluster_id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 0', borderBottom: i < 5 ? '1px solid rgba(99,140,255,0.06)' : 'none',
              }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                    Cluster #{hs.cluster_id + 1}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{hs.dominant_crime}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: hs.alert_level === 'Critical' ? '#ef4444' : hs.alert_level === 'High' ? '#f97316' : '#eab308' }}>
                    {hs.intensity}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{hs.incident_count} inc.</div>
                </div>
              </div>
            ))}
          </div>

          {/* Selected District Detail */}
          {selectedDistrict && (
            <div className="glass-card" style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div className="card-title" style={{ margin: 0 }}>📍 {selectedDistrict.district}</div>
                <button
                  onClick={() => setSelectedDistrict(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16 }}
                >✕</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                {[
                  { label: 'Total Crimes', value: selectedDistrict.total_crimes, color: '#4f7eff' },
                  { label: 'Per Lakh', value: selectedDistrict.crimes_per_lakh, color: '#a855f7' },
                  { label: 'Solve Rate', value: `${selectedDistrict.solve_rate}%`, color: '#22c55e' },
                  { label: 'Critical', value: selectedDistrict.critical_incidents, color: '#ef4444' },
                ].map((stat) => (
                  <div key={stat.label} style={{
                    background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '8px 10px',
                    border: '1px solid var(--border-glass)',
                  }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: stat.color }}>{stat.value}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{stat.label}</div>
                  </div>
                ))}
              </div>
              {topCrimeTypes.length > 0 && (
                <>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Crime Breakdown</div>
                  <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={topCrimeTypes} layout="vertical">
                      <XAxis type="number" tick={{ fill: '#4a5a7a', fontSize: 9 }} />
                      <YAxis type="category" dataKey="name" tick={{ fill: '#8899bb', fontSize: 9 }} width={90} />
                      <Bar dataKey="value" radius={[0, 3, 3, 0]}>
                        {topCrimeTypes.map((e: any) => (
                          <Cell key={e.name} fill={CRIME_COLORS[e.name] || '#4f7eff'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </>
              )}
            </div>
          )}

          {/* Crime type legend */}
          <div className="glass-card" style={{ padding: 16 }}>
            <div className="card-title" style={{ marginBottom: 10 }}>🎨 Crime Types</div>
            {Object.entries(CRIME_COLORS).map(([type, color]) => (
              <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: color, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
