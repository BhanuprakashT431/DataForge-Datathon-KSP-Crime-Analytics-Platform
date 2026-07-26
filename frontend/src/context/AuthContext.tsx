import React, { createContext, useContext, useEffect, useState } from 'react';

export type Role = 'Admin' | 'Police Officer' | 'Crime Analyst';

export interface User {
  uid: string;
  email: string;
  name: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: Role) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Clear errors helper
  const clearError = () => setError(null);

  // Default Mock User
  const DEFAULT_USER = {
    uid: 'admin-001',
    email: 'admin@ksp.gov.in',
    password: 'password123',
    name: 'Admin Director',
    role: 'Admin' as Role
  };

  // Initialize Auth from LocalStorage on mount
  useEffect(() => {
    // Seed 1 default mock login if none exists
    if (!localStorage.getItem('ksp-mock-users')) {
      localStorage.setItem('ksp-mock-users', JSON.stringify([DEFAULT_USER]));
    }

    const savedUser = localStorage.getItem('ksp-active-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('ksp-active-user');
      }
    }
    setLoading(false);
  }, []);

  // Login with Local Storage
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const storedUsersRaw = localStorage.getItem('ksp-mock-users');
      const users: any[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

      const foundUser = users.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        throw new Error('Wrong email or password. Please register first if you do not have an account.');
      }

      const activeUser: User = {
        uid: foundUser.uid,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
      };

      localStorage.setItem('ksp-active-user', JSON.stringify(activeUser));
      setUser(activeUser);
    } catch (err: any) {
      setError(err.message || 'Login failed.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register with Local Storage
  const register = async (email: string, password: string, name: string, role: Role) => {
    setLoading(true);
    setError(null);
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const storedUsersRaw = localStorage.getItem('ksp-mock-users');
      const users: any[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

      if (users.find(u => u.email === email)) {
        throw new Error('An account with this email already exists.');
      }

      const newUser = {
        uid: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
        email,
        password,
        name,
        role,
      };

      users.push(newUser);
      localStorage.setItem('ksp-mock-users', JSON.stringify(users));

      const activeUser: User = {
        uid: newUser.uid,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      };

      localStorage.setItem('ksp-active-user', JSON.stringify(activeUser));
      setUser(activeUser);
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      localStorage.removeItem('ksp-active-user');
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
        login,
        register,
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

