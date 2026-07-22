import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase';

export interface User {
  uid: string;
  email: string;
  name: string;
  method: 'normal' | 'firebase';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  loginWithFirebase: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  registerWithFirebase: (email: string, password: string, name: string) => Promise<void>;
  loginWithNormal: (email: string, password: string) => Promise<void>;
  registerWithNormal: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = 'http://localhost:8000/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Clear errors helper
  const clearError = () => setError(null);

  // Initialize Auth
  useEffect(() => {
    // 1. Listen to Firebase auth changes
    const unsubscribeFirebase = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || 'KSP Officer (FB)',
          method: 'firebase',
        });
        setLoading(false);
      } else {
        // If no active Firebase user, check if we have a saved normal login
        const savedNormalUser = localStorage.getItem('ksp-normal-user');
        if (savedNormalUser) {
          try {
            setUser(JSON.parse(savedNormalUser));
          } catch (e) {
            localStorage.removeItem('ksp-normal-user');
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    });

    return () => unsubscribeFirebase();
  }, []);

  // Login with Firebase
  const loginWithFirebase = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      localStorage.removeItem('ksp-normal-user');
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message || 'Firebase login failed.');
      setLoading(false);
      throw err;
    }
  };

  // Login with Google (Firebase)
  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      localStorage.removeItem('ksp-normal-user');
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed.');
      setLoading(false);
      throw err;
    }
  };

  // Register with Firebase
  const registerWithFirebase = async (email: string, password: string, name: string) => {
    setLoading(true);
    setError(null);
    try {
      localStorage.removeItem('ksp-normal-user');
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (cred.user) {
        await updateProfile(cred.user, { displayName: name });
        setUser({
          uid: cred.user.uid,
          email: cred.user.email || '',
          name: name,
          method: 'firebase',
        });
      }
    } catch (err: any) {
      setError(err.message || 'Firebase registration failed.');
      setLoading(false);
      throw err;
    }
  };

  // Login with Normal backend
  const loginWithNormal = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await firebaseSignOut(auth);
      
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const detail = await response.json().then(d => d.detail).catch(() => 'Login failed');
        throw new Error(detail);
      }
      
      const data = await response.json();
      const normalUser: User = {
        uid: data.user.uid,
        email: data.user.email,
        name: data.user.name,
        method: 'normal',
      };
      
      localStorage.setItem('ksp-normal-user', JSON.stringify(normalUser));
      setUser(normalUser);
    } catch (err: any) {
      setError(err.message || 'Credentials login failed.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register with Normal backend
  const registerWithNormal = async (email: string, password: string, name: string) => {
    setLoading(true);
    setError(null);
    try {
      await firebaseSignOut(auth);
      
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      
      if (!response.ok) {
        const detail = await response.json().then(d => d.detail).catch(() => 'Registration failed');
        throw new Error(detail);
      }
      
      const data = await response.json();
      const normalUser: User = {
        uid: data.user.uid,
        email: data.user.email,
        name: data.user.name,
        method: 'normal',
      };
      
      localStorage.setItem('ksp-normal-user', JSON.stringify(normalUser));
      setUser(normalUser);
    } catch (err: any) {
      setError(err.message || 'Credentials registration failed.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    try {
      localStorage.removeItem('ksp-normal-user');
      await firebaseSignOut(auth);
      setUser(null);
    } catch (err: any) {
      setError(err.message || 'Logout failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        loginWithFirebase,
        loginWithGoogle,
        registerWithFirebase,
        loginWithNormal,
        registerWithNormal,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
