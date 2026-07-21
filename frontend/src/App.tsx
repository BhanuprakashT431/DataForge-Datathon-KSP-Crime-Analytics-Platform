import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { GeospatialMap } from './pages/GeospatialMap';
import { NetworkAnalysis } from './pages/NetworkAnalysis';
import { Predictions } from './pages/Predictions';
import { OffenderProfiles } from './pages/OffenderProfiles';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  if (isLandingPage) {
    return <LandingPage />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)', transition: 'background-color 0.3s ease' }}>
      <Navbar />
      <main style={{ marginLeft: 240, flex: 1, minWidth: 0, paddingBottom: 40 }}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/map" element={<GeospatialMap />} />
          <Route path="/network" element={<NetworkAnalysis />} />
          <Route path="/predictions" element={<Predictions />} />
          <Route path="/offenders" element={<OffenderProfiles />} />
        </Routes>
      </main>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
};

export default App;
