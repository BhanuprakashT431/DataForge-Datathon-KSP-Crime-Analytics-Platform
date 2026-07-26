import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { GeospatialMap } from './pages/GeospatialMap';
import { NetworkAnalysis } from './pages/NetworkAnalysis';
import { Predictions } from './pages/Predictions';
import { OffenderProfiles } from './pages/OffenderProfiles';
import { Workspace } from './pages/Workspace';
import { SecurityDashboard } from './pages/SecurityDashboard';
import { AIGovernance } from './pages/AIGovernance';
import { ModelMonitoring } from './pages/ModelMonitoring';
import { SociologicalIntelligence } from './pages/SociologicalIntelligence';
import { EvidenceRepository } from './pages/EvidenceRepository';
import { DecisionSupportReports } from './pages/DecisionSupportReports';
import { CommandCenter } from './pages/CommandCenter';
import { GeminiChatbot } from './components/GeminiChatbot';

// ─── Presentation Mode Context ────────────────────────────────
export const PresentationContext = React.createContext({ 
  isPresentation: false, 
  setPresentation: (val: boolean) => {} 
});
export const usePresentation = () => React.useContext(PresentationContext);

// ─── Protected Route wrapper ──────────────────────────────────
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-primary)', fontFamily: "'Inter', sans-serif",
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 40, height: 40, border: '3px solid rgba(59,130,246,0.2)',
            borderTopColor: '#3b82f6', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 16px',
          }} />
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Authenticating...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

// ─── Main App Content ─────────────────────────────────────────
const AppContent: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { isPresentation } = usePresentation();
  const isLanding = location.pathname === '/';
  const isAuth = location.pathname === '/auth';

  // If on landing page
  if (isLanding) return <LandingPage />;

  // If on auth page — redirect to command-center if already logged in
  if (isAuth) {
    return user ? <Navigate to="/command-center" replace /> : <AuthPage />;
  }

  // All other routes are protected
  return (
    <ProtectedRoute>
      <div style={{ 
         display: 'flex', minHeight: '100vh', 
         background: 'var(--bg-primary)', 
         transition: 'background-color 0.3s ease',
         fontSize: isPresentation ? '1.1rem' : '1rem' 
      }}>
        {!isPresentation && <Navbar />}
        <main style={{ 
           marginLeft: isPresentation ? 0 : 240, 
           flex: 1, minWidth: 0, paddingBottom: 40,
           padding: isPresentation ? '24px' : '0' 
        }}>
          <Routes>
            <Route path="/command-center" element={<CommandCenter />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/workspace" element={<Workspace />} />
            <Route path="/map" element={<GeospatialMap />} />
            <Route path="/network" element={<NetworkAnalysis />} />
            <Route path="/predictions" element={<Predictions />} />
            <Route path="/offenders" element={<OffenderProfiles />} />
            <Route path="/evidence" element={<EvidenceRepository />} />
            <Route path="/security" element={<SecurityDashboard />} />
            <Route path="/ai-governance" element={<AIGovernance />} />
            <Route path="/model-monitoring" element={<ModelMonitoring />} />
            <Route path="/sociological" element={<SociologicalIntelligence />} />
            <Route path="/reports" element={<DecisionSupportReports />} />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/command-center" replace />} />
          </Routes>
        </main>
        {!isPresentation && <GeminiChatbot />}
      </div>
    </ProtectedRoute>
  );
};

// ─── Root App ─────────────────────────────────────────────────
export const App: React.FC = () => {
  const [isPresentation, setPresentation] = React.useState(false);
  return (
    <ThemeProvider>
      <AuthProvider>
        <PresentationContext.Provider value={{ isPresentation, setPresentation }}>
          <Router>
            <AppContent />
          </Router>
        </PresentationContext.Provider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
