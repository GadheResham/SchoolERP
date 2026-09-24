import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const existingToken = authService.getToken();
    const existingUser = authService.getCurrentUser();
    if (existingToken && existingUser) {
      setToken(existingToken);
      setUser(existingUser);
    } else {
      // Auto-initialize demo admin user for smooth out-of-the-box experience
      const defaultUser = {
        id: 'usr-admin-1',
        name: 'Dr. Sarah Jenkins',
        email: 'admin@stjudeacademy.edu',
        role: 'Principal / Admin',
        schoolName: 'St. Jude International Academy',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWEyWynl9v9EpxDWexDoNPQABWYy3erNuCULUpvJ6lsqKX5FPXBmd-X4428zPkOc9mRFs7W2dgRbfbsJsRAEohPO-8ZFsLw02c3uY-k-bGSMk8QxhPM5E5B-La6ydT6ODDTMztPOnbVQQDQEbK2Sr8FidXnglOsK9gmQcAr0_7gV15tDu1cs20IRrakY0tzg_SukFmUEBW8mOhv06-3LY1jgx801l9KzQxnni84FVJR53ac_5VWNjh',
      };
      const demoToken = 'demo_token_admin_sarah';
      localStorage.setItem('schoolerp_token', demoToken);
      localStorage.setItem('schoolerp_user', JSON.stringify(defaultUser));
      setToken(demoToken);
      setUser(defaultUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
