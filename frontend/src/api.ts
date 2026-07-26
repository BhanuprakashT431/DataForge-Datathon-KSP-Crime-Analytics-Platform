// Central API client — all calls go through here

const BASE_URL = 'http://localhost:8000/api';

async function fetchJSON<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
    });
  }
  
  try {
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return await res.json();
  } catch (err) {
    // OFFLINE FALLBACK FOR DATATHON PROTOTYPE
    console.warn(`[KSP Offline Fallback] Using mock data for ${path}`);
    const mockData: Record<string, any> = {
      '/overview': {
        total_firs: 12450,
        active_cases: 3420,
        arrests: 890,
        conviction_rate: 68.5,
        daily_trend: -2.4
      },
      '/cases': [
        { id: 'FIR-4421/26', title: 'Organized Syndicate Racketeering', status: 'Active', district: 'Bengaluru Urban' },
        { id: 'FIR-4418/26', title: 'Cyber Fraud Networking', status: 'Under Investigation', district: 'Mysuru' }
      ],
      '/health': { status: 'healthy', latency: 42, active_nodes: 12 },
      '/districts': [
        { name: 'Bengaluru Urban', type: 'City Commissionerate' },
        { name: 'Mysuru', type: 'City Commissionerate' },
        { name: 'Hubballi-Dharwad', type: 'City Commissionerate' },
        { name: 'Mangaluru', type: 'City Commissionerate' },
        { name: 'Belagavi', type: 'District' },
        { name: 'Kalaburagi', type: 'District' },
        { name: 'Ballari', type: 'District' },
        { name: 'Tumakuru', type: 'District' },
        { name: 'Udupi', type: 'District' },
        { name: 'Shivamogga', type: 'District' },
        { name: 'Bengaluru Rural', type: 'District' }
      ],
      '/crimes': { data: [], total: 0 },
      '/crimes/map-points': [],
      '/hotspots': [
        { lat: 12.9716, lng: 77.5946, weight: 1.0 },
        { lat: 12.2958, lng: 76.6394, weight: 0.8 },
        { lat: 15.3647, lng: 75.1240, weight: 0.6 }
      ],
      '/anomalies': { recent: [
        { id: 'ANOM-1', description: 'Unusual midnight crowd forming near Majestic Bus Stand', severity: 'High' }
      ]},
      '/risk-scores': [
        { district: 'Bengaluru Urban', risk_score: 85 },
        { district: 'Mysuru', risk_score: 65 },
        { district: 'Hubballi-Dharwad', risk_score: 72 },
        { district: 'Mangaluru', risk_score: 68 },
        { district: 'Belagavi', risk_score: 55 },
        { district: 'Kalaburagi', risk_score: 62 },
        { district: 'Ballari', risk_score: 58 },
        { district: 'Tumakuru', risk_score: 45 },
        { district: 'Udupi', risk_score: 40 },
        { district: 'Shivamogga', risk_score: 50 },
        { district: 'Bengaluru Rural', risk_score: 52 }
      ],
      '/forecasts': [
        { district: 'Bengaluru Urban', forecast: [{ month: 'Jan', predicted: 450 }, { month: 'Feb', predicted: 420 }, { month: 'Mar', predicted: 510 }, { month: 'Apr', predicted: 480 }, { month: 'May', predicted: 590 }, { month: 'Jun', predicted: 620 }] },
        { district: 'Mysuru', forecast: [{ month: 'Jan', predicted: 210 }, { month: 'Feb', predicted: 190 }, { month: 'Mar', predicted: 240 }, { month: 'Apr', predicted: 220 }, { month: 'May', predicted: 260 }, { month: 'Jun', predicted: 280 }] },
        { district: 'Hubballi-Dharwad', forecast: [{ month: 'Jan', predicted: 310 }, { month: 'Feb', predicted: 290 }, { month: 'Mar', predicted: 340 }, { month: 'Apr', predicted: 320 }, { month: 'May', predicted: 360 }, { month: 'Jun', predicted: 380 }] },
        { district: 'Mangaluru', forecast: [{ month: 'Jan', predicted: 180 }, { month: 'Feb', predicted: 170 }, { month: 'Mar', predicted: 200 }, { month: 'Apr', predicted: 190 }, { month: 'May', predicted: 220 }, { month: 'Jun', predicted: 230 }] }
      ],
      '/trends': { overall: 'Increasing', value: 12 },
      '/network': { nodes: [
        { id: 'C-1', label: 'Syndicate Boss', group: 1 }, { id: 'C-2', label: 'Lieutenant', group: 2 }, { id: 'C-3', label: 'Financier', group: 2 }
      ], edges: [
        { source: 'C-1', target: 'C-2' }, { source: 'C-1', target: 'C-3' }
      ]},
      '/network/offenders': [
        { id: 'KSP-O-9912', name: 'Raja "Cobra" Reddy', risk_score: 94, primary_crime: 'Organized Syndicate Activity', total_crimes: 14, status: 'Active Warrant', districts_active: ['Bengaluru Urban', 'Kolar'] },
        { id: 'KSP-O-8821', name: 'Syed Ali', risk_score: 88, primary_crime: 'Cyber Fraud Networking', total_crimes: 22, status: 'Under Surveillance', districts_active: ['Mysuru', 'Bengaluru Rural'] },
        { id: 'KSP-O-7734', name: 'Vikram Gowda', risk_score: 76, primary_crime: 'Vehicle Theft Ring', total_crimes: 8, status: 'Arrested - Trial Pending', districts_active: ['Hubballi-Dharwad'] },
        { id: 'KSP-O-6645', name: 'Manjula Devi', risk_score: 91, primary_crime: 'Financial Extortion', total_crimes: 11, status: 'Active Warrant', districts_active: ['Bengaluru Urban'] },
        { id: 'KSP-O-5522', name: 'Ravi Kumar', risk_score: 65, primary_crime: 'Burglary', total_crimes: 5, status: 'Released on Bail', districts_active: ['Mangaluru'] }
      ],
      '/sociological': {
        demographics: {
          labels: ['18-25', '26-35', '36-45', '46-60', '60+'],
          data: [35, 40, 15, 8, 2]
        },
        literacy_vs_crime: [
          { district: 'Bengaluru Urban', literacy: 88, crimeRate: 450 },
          { district: 'Mysuru', literacy: 82, crimeRate: 210 },
          { district: 'Hubballi', literacy: 78, crimeRate: 310 },
          { district: 'Mangaluru', literacy: 85, crimeRate: 180 },
          { district: 'Kalaburagi', literacy: 65, crimeRate: 280 }
        ]
      },
      '/evidence': [
        { id: 'EV-2026-881A', type: 'CCTV', title: 'Koramangala Traffic Cam 04', caseId: 'FIR-4421/26', timestamp: '2026-07-25 02:14 AM', size: '412 MB', status: 'Analyzed', risk: 'Critical', district: 'Bengaluru Urban', station: 'Koramangala PS', accused: 'Unknown', victim: 'State', officer: 'Insp. Ramesh', chain_of_custody: 4, metadata_hash: 'a8f5...', url: '/vault' },
        { id: 'EV-2026-882B', type: 'Mobile Dump', title: 'Suspect iPhone 14 Pro Data', caseId: 'FIR-4418/26', timestamp: '2026-07-24 11:30 AM', size: '12.4 GB', status: 'Processing', risk: 'High', district: 'Mysuru', station: 'Lashkar PS', accused: 'Syed Ali', victim: 'N/A', officer: 'ACP Kumar', chain_of_custody: 2, metadata_hash: 'b10a...', url: '/vault' },
        { id: 'EV-2026-883C', type: 'Photo', title: 'Recovered Vehicle VIN', caseId: 'FIR-4409/26', timestamp: '2026-07-22 09:15 AM', size: '4.2 MB', status: 'Analyzed', risk: 'Medium', district: 'Hubballi-Dharwad', station: 'Vidyanagar PS', accused: 'Vikram Gowda', victim: 'Mahesh V.', officer: 'Sub-Insp. Patil', chain_of_custody: 5, metadata_hash: '9d5e...', url: '/vault' }
      ],
      '/reports': [
        { id: 'RPT-001', type: 'Executive Summary', title: 'Statewide Crime Index Report - July 2026', desc: 'Comprehensive monthly overview of major crime trends.' },
        { id: 'RPT-002', type: 'Geospatial Intelligence', title: 'Bengaluru Urban Hotspot Analysis', desc: 'Detailed mapping and AI cluster analysis of organized crime.' },
        { id: 'RPT-003', type: 'Predictive Modeling', title: 'Festival Season Threat Forecast (Q3)', desc: 'AI predictions for anticipated crowd control issues.' }
      ]
    };
    
    // Exact match or fallback for specific dynamic routes
    if (mockData[path] !== undefined) return mockData[path] as T;
    
    // For specific dynamic path fallbacks (e.g. /cases/123)
    if (path.startsWith('/cases/')) return { id: path.replace('/cases/', ''), title: 'Investigation Record', status: 'Active' } as unknown as T;
    if (path.startsWith('/districts/')) return { name: decodeURIComponent(path.replace('/districts/', '')), type: 'District' } as unknown as T;
    if (path.startsWith('/network/offenders/')) return { id: path.replace('/network/offenders/', ''), name: 'Suspect Profile', risk_score: 85, primary_crime: 'Unknown' } as unknown as T;
    
    return [] as unknown as T;
  }
}

export const api = {
  overview:      ()                                        => fetchJSON<any>('/overview'),
  districts:     ()                                        => fetchJSON<any[]>('/districts'),
  districtDetail:(name: string)                            => fetchJSON<any>(`/districts/${encodeURIComponent(name)}`),
  crimes:        (filters?: Record<string, any>)           => fetchJSON<any>('/crimes', filters),
  mapPoints:     (filters?: Record<string, any>)           => fetchJSON<any[]>('/crimes/map-points', filters),
  hotspots:      ()                                        => fetchJSON<any[]>('/hotspots'),
  anomalies:     ()                                        => fetchJSON<any>('/anomalies'),
  riskScores:    ()                                        => fetchJSON<any[]>('/risk-scores'),
  forecasts:     ()                                        => fetchJSON<any[]>('/forecasts'),
  trends:        ()                                        => fetchJSON<any>('/trends'),
  network:       (crimeType?: string)                      => fetchJSON<any>('/network', crimeType ? { crime_type: crimeType } : undefined),
  offenders:     (filters?: Record<string, any>)           => fetchJSON<any[]>('/network/offenders', filters),
  offenderDetail:(id: string)                              => fetchJSON<any>(`/network/offenders/${id}`),
  analyzeWithAI: (prompt: string, district?: string, apiKey?: string) => 
    fetch('http://localhost:8000/api/ai/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, district, api_key: apiKey }),
    }).then(res => res.json()),
  sociological:  ()                                        => fetchJSON<any>('/sociological'),
  evidence:      ()                                        => fetchJSON<any[]>('/evidence'),
  reports:       ()                                        => fetchJSON<any[]>('/reports'),
  get:           (path: string, filters?: Record<string, any>) => fetchJSON<any>(path, filters),
};

export function getRiskColor(score: number): string {
  if (score >= 75) return 'var(--accent-critical)';
  if (score >= 55) return 'var(--accent-high)';
  if (score >= 35) return 'var(--accent-medium)';
  return 'var(--accent-low)';
}

export function getRiskClass(level: string): string {
  const map: Record<string, string> = {
    Critical: 'badge-critical', High: 'badge-high',
    Medium: 'badge-medium', Low: 'badge-low',
  };
  return map[level] || 'badge-info';
}

export function formatNumber(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);
}
