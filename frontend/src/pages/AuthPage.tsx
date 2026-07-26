import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, Role } from '../context/AuthContext';
import { PoliceBadge } from '../components/PoliceBadge';

type AuthMode = 'login' | 'register';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, register, error, clearError } = useAuth();

  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('Police Officer');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const displayError = localError || error;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    if (!email || !password) {
      setLocalError('Email and password are required.');
      return;
    }
    if (mode === 'register' && !name.trim()) {
      setLocalError('Full name is required.');
      return;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password, name, role);
      }
      navigate('/dashboard');
    } catch (err: any) {
      // error is handled by context
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(m => m === 'login' ? 'register' : 'login');
    setLocalError(null);
    clearError();
    setEmail('');
    setPassword('');
    setName('');
    setRole('Police Officer');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient background glows */}
      <div style={{
        position: 'absolute', top: '-10%', left: '-5%',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%)',
        filter: 'blur(80px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-10%', right: '-5%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
        filter: 'blur(80px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '40%', right: '20%',
        width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(244, 63, 94, 0.06) 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />

      {/* Grid pattern overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)`,
        backgroundSize: '48px 48px',
      }} />

      <div style={{ width: '100%', maxWidth: 460, padding: '0 20px', position: 'relative', zIndex: 1 }}>

        {/* Logo / Brand */}
        <div className="glass-reveal" style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 60, height: 60, borderRadius: 16,
            background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)',
            boxShadow: '0 8px 32px rgba(59,130,246,0.4)',
            marginBottom: 16,
          }}>
            <PoliceBadge size={36} />
          </div>
          <h1 style={{
            margin: 0, fontSize: 26, fontWeight: 800,
            background: 'linear-gradient(135deg, #f8fafc, #60a5fa)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px',
          }}>
            DataForge KSP
          </h1>
          <p style={{ margin: '6px 0 0', color: 'var(--text-muted)', fontSize: 13 }}>
            Karnataka State Police — Crime Analytics Platform
          </p>
        </div>

        {/* Card */}
        <div className="glass-reveal" style={{
          animationDelay: '0.15s',
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(56, 189, 248, 0.15)',
          borderRadius: 20,
          padding: '32px 36px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.06) inset',
        }}>

          {/* Login / Register tab switcher */}
          <div style={{
            display: 'flex', background: 'rgba(9, 14, 26, 0.6)',
            borderRadius: 10, padding: 4, marginBottom: 28,
            border: '1px solid rgba(56,189,248,0.1)',
          }}>
            {(['login', 'register'] as AuthMode[]).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setLocalError(null); clearError(); }}
                style={{
                  flex: 1, padding: '9px 0', border: 'none', cursor: 'pointer',
                  borderRadius: 8, fontSize: 14, fontWeight: 600,
                  transition: 'all 0.2s ease',
                  background: mode === m
                    ? 'linear-gradient(135deg, #1d4ed8, #7c3aed)'
                    : 'transparent',
                  color: mode === m ? '#fff' : 'var(--text-muted)',
                  boxShadow: mode === m ? '0 4px 12px rgba(59,130,246,0.3)' : 'none',
                }}
              >
                {m === 'login' ? '🔐 Sign In' : '✨ Register'}
              </button>
            ))}
          </div>

          {/* Error banner */}
          {displayError && (
            <div style={{
              background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)',
              borderRadius: 10, padding: '12px 16px', marginBottom: 20,
              color: '#fda4af', fontSize: 13, display: 'flex', alignItems: 'flex-start', gap: 8,
            }}>
              <span style={{ fontSize: 15, flexShrink: 0 }}>⚠️</span>
              <span>{displayError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Name (register only) */}
            {mode === 'register' && (
              <div>
                <label style={labelStyle}>Full Name</label>
                <input
                  id="auth-name"
                  type="text"
                  placeholder="e.g. Inspector Ravi Kumar"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={inputStyle}
                  onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={e => Object.assign(e.target.style, inputStyle)}
                />
              </div>
            )}

            {/* Role (register only) */}
            {mode === 'register' && (
              <div>
                <label style={labelStyle}>Role</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as Role)}
                  style={{ ...inputStyle, cursor: 'pointer', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23475569%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px top 50%', backgroundSize: '10px auto' }}
                  onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={e => Object.assign(e.target.style, inputStyle)}
                >
                  <option value="Admin">Admin</option>
                  <option value="Police Officer">Police Officer</option>
                  <option value="Crime Analyst">Crime Analyst</option>
                </select>
              </div>
            )}

            {/* Email */}
            <div>
              <label style={labelStyle}>Email Address</label>
              <input
                id="auth-email"
                type="email"
                placeholder="officer@ksp.gov.in"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={inputStyle}
                onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={e => Object.assign(e.target.style, inputStyle)}
              />
            </div>

            {/* Password */}
            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ ...inputStyle, paddingRight: 48 }}
                  onFocus={e => Object.assign(e.target.style, { ...inputFocusStyle, paddingRight: '48px' })}
                  onBlur={e => Object.assign(e.target.style, { ...inputStyle, paddingRight: '48px' })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', fontSize: 16,
                    color: 'var(--text-muted)', padding: 0, lineHeight: 1,
                  }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="auth-submit"
              type="submit"
              disabled={loading}
              style={{
                marginTop: 6, padding: '14px', border: 'none', borderRadius: 12,
                background: loading
                  ? 'rgba(59,130,246,0.3)'
                  : 'linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%)',
                color: '#fff', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 8px 24px rgba(59,130,246,0.4)',
                transition: 'all 0.2s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {loading ? (
                <>
                  <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  {mode === 'login' ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                mode === 'login' ? '🔐 Sign In to Dashboard' : '✨ Create Account'
              )}
            </button>
          </form>

          {/* Switch mode link */}
          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={switchMode}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--accent-info)', fontWeight: 600, fontSize: 13,
                padding: 0, textDecoration: 'underline', textUnderlineOffset: 3,
              }}
            >
              {mode === 'login' ? 'Register here' : 'Sign in instead'}
            </button>
          </div>
        </div>

        {/* Footer note */}
        <p className="glass-reveal" style={{ animationDelay: '0.3s', textAlign: 'center', marginTop: 20, fontSize: 12, color: 'var(--text-muted)' }}>
          🔒 Secured offline connection · Karnataka State Police
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: #475569; }
        input:focus { outline: none; }
      `}</style>
    </div>
  );
};

// ── Shared styles ──────────────────────────────────────────────
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 12, color: 'var(--text-muted)',
  marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px', boxSizing: 'border-box',
  background: 'rgba(9,14,26,0.7)', border: '1px solid rgba(56,189,248,0.15)',
  borderRadius: 10, color: 'var(--text-primary)', fontSize: 14,
  fontFamily: "'Inter', sans-serif", transition: 'all 0.2s ease',
};

const inputFocusStyle: React.CSSProperties = {
  ...inputStyle,
  border: '1px solid rgba(59,130,246,0.5)',
  boxShadow: '0 0 0 3px rgba(59,130,246,0.1)',
  background: 'rgba(15,23,42,0.9)',
};

export default AuthPage;
