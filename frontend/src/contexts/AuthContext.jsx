import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

// Demo users — works fully without a backend
const DEMO_USERS = [
  { id: '1', name: 'Alpha', email: 'alpha@goalforge.com', password: 'password123', role: 'employee', dept: 'Engineering', managerId: '2' },
  { id: '2', name: 'Beta', email: 'beta@goalforge.com', password: 'password123', role: 'manager', dept: 'Engineering', managerId: null },
  { id: '3', name: 'Charlie', email: 'charlie@goalforge.com', password: 'password123', role: 'admin', dept: 'HR', managerId: null },
  { id: '4', name: 'Delta', email: 'delta@goalforge.com', password: 'password123', role: 'employee', dept: 'Design', managerId: '2' },
  { id: '5', name: 'Echo', email: 'echo@goalforge.com', password: 'password123', role: 'employee', dept: 'Engineering', managerId: '2' },
  { id: '6', name: 'Foxtrot', email: 'foxtrot@goalforge.com', password: 'password123', role: 'manager', dept: 'Product', managerId: null },
];

function mockLogin(credentials) {
  const { email, password } = credentials;
  const user = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password !== password) {
    throw new Error('Invalid email or password');
  }
  const { password: _, ...safeUser } = user;
  const token = `mock_token_${user.id}_${Date.now()}`;
  return { token, user: safeUser };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  const loadUser = useCallback(() => {
    try {
      const storedUser = localStorage.getItem('gf_user');
      const storedToken = localStorage.getItem('gf_token');
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
      }
    } catch {
      localStorage.removeItem('gf_token');
      localStorage.removeItem('gf_user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const login = async (credentials) => {
    // Try real backend first; fall back to mock
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('gf_token', data.token);
        localStorage.setItem('gf_user', JSON.stringify(data.user));
        setUser(data.user);
        return data.user;
      }
      const err = await res.json();
      throw new Error(err.message || 'Login failed');
    } catch (networkErr) {
      // Backend not reachable — use mock
      const { token, user: mockUser } = mockLogin(credentials);
      localStorage.setItem('gf_token', token);
      localStorage.setItem('gf_user', JSON.stringify(mockUser));
      setUser(mockUser);
      return mockUser;
    }
  };

  const logout = () => {
    localStorage.removeItem('gf_token');
    localStorage.removeItem('gf_user');
    setUser(null);
  };

  const hasRole = (roles) => {
    if (!user) return false;
    return typeof roles === 'string' ? user.role === roles : roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasRole, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
