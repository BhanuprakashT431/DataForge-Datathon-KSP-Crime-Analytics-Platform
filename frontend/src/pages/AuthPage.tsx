import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type AuthMode = 'login' | 'register';
type AuthMethod = 'firebase' | 'normal';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithFirebase, loginWithGoogle, registerWithFirebase, loginWithNormal, registerWithNormal, error, clearError } = useAuth();

  const [mode, setMode] = useState<AuthMode>('login');
  const [method, setMethod] = useState<AuthMethod>('firebase');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const displayError = localError || error;

  const handleGoogleLogin = async () => {
    clearError();
    setLocalError(null);
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err: any) {
      // error set in context
    } finally {
      setGoogleLoading(false);
    }
  };

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
      if (method === 'firebase') {
        if (mode === 'login') {
          await loginWithFirebase(email, password);
        } else {
          await registerWithFirebase(email, password, name);
        }
      } else {
        if (mode === 'login') {
          await loginWithNormal(email, password);
        } else {
          await registerWithNormal(email, password, name);
        }
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
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 60, height: 60, borderRadius: 16,
            background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)',
            boxShadow: '0 8px 32px rgba(59,130,246,0.4)',
            marginBottom: 16,
          }}>
            <span style={{ fontSize: 28 }}>🛡️</span>
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
        <div style={{
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

          {/* Google Sign-In (Firebase) Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            style={{
              width: '100%',
              padding: '12px 16px',
              marginBottom: 20,
              borderRadius: 12,
              border: '1px solid rgba(255, 255, 255, 0.15)',
              background: 'rgba(255, 255, 255, 0.07)',
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 600,
              cursor: googleLoading || loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
            }}
            onMouseEnter={e => { if (!googleLoading && !loading) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'; }}
            onMouseLeave={e => { if (!googleLoading && !loading) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.07)'; }}
          >
            {googleLoading ? (
              <>
                <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <span>Signing in with Google...</span>
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(56, 189, 248, 0.15)' }} />
            <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              or email sign in
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(56, 189, 248, 0.15)' }} />
          </div>

          {/* Auth method selector */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Authentication Method
            </label>
            <div style={{ display: 'flex', gap: 10 }}>
              {([
                { value: 'firebase', label: '🔥 Firebase', desc: 'Google Auth' },
                { value: 'normal', label: '🔑 Standard', desc: 'Local Auth' },
              ] as { value: AuthMethod; label: string; desc: string }[]).map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { setMethod(opt.value); setLocalError(null); clearError(); }}
                  style={{
                    flex: 1, padding: '10px 12px', cursor: 'pointer',
                    borderRadius: 10, fontSize: 13, fontWeight: 600,
                    transition: 'all 0.2s ease',
                    background: method === opt.value
                      ? 'rgba(59,130,246,0.15)'
                      : 'rgba(9,14,26,0.6)',
                    color: method === opt.value ? 'var(--accent-info)' : 'var(--text-muted)',
                    border: method === opt.value
                      ? '1px solid rgba(59,130,246,0.4)'
                      : '1px solid rgba(56,189,248,0.1)',
                    boxShadow: method === opt.value ? '0 0 16px rgba(59,130,246,0.15)' : 'none',
                    textAlign: 'center',
                  }}
                >
                  <div>{opt.label}</div>
                  <div style={{ fontSize: 11, fontWeight: 400, opacity: 0.7, marginTop: 2 }}>{opt.desc}</div>
                </button>
              ))}
            </div>
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
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'var(--text-muted)' }}>
          🔒 Secured connection · Karnataka State Police © 2025
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
