import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { GeospatialMap } from './pages/GeospatialMap';
import { NetworkAnalysis } from './pages/NetworkAnalysis';
import { Predictions } from './pages/Predictions';
import { OffenderProfiles } from './pages/OffenderProfiles';

export const App: React.FC = () => {
  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <Navbar />
        <main style={{ marginLeft: 240, flex: 1, minWidth: 0, paddingBottom: 40 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/map" element={<GeospatialMap />} />
            <Route path="/network" element={<NetworkAnalysis />} />
            <Route path="/predictions" element={<Predictions />} />
            <Route path="/offenders" element={<OffenderProfiles />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
