import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_ENDPOINTS } from '../config/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async (authToken) => {
    if (!authToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(API_ENDPOINTS.AUTH.PROFILE, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      if (!res.ok) {
        throw new Error('Unauthorized or session expired');
      }

      const data = await res.json();
      if (data && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
        localStorage.removeItem('token');
        setToken(null);
      }
    } catch (err) {
      console.warn('Auth check failed:', err.message);
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialToken = localStorage.getItem('token');
    if (initialToken) {
      fetchProfile(initialToken);
    } else {
      setIsLoading(false);
    }
  }, [fetchProfile]);

  const login = useCallback(async (newToken, userData = null) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    if (userData) {
      setUser(userData);
      setIsLoading(false);
    } else {
      await fetchProfile(newToken);
    }
  }, [fetchProfile]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const currentToken = localStorage.getItem('token');
    if (currentToken) {
      await fetchProfile(currentToken);
    }
  }, [fetchProfile]);

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    login,
    logout,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
