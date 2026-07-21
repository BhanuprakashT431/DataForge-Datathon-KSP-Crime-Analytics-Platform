// Central API client — all calls go through here

const BASE_URL = 'http://localhost:8000/api';

async function fetchJSON<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
    });
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
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
