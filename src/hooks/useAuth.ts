import { useState, useEffect, useCallback } from 'react';
import { UserProfile, UserRole } from '../types';
import { INITIAL_USER_PROFILES } from '../data/mockData';

export function useAuth() {
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('aurapredict_active_user');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse cached user profile', e);
    }
    return INITIAL_USER_PROFILES[0];
  });

  const [token, setToken] = useState<string | null>(() => {
    try {
      if (typeof window !== 'undefined') {
        return localStorage.getItem('aurapredict_auth_token') || 'seed_session_token_sarah_lin';
      }
    } catch (e) {
      console.warn('Failed to read auth token from localStorage', e);
    }
    return 'seed_session_token_sarah_lin';
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  // Sync to localStorage
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem('aurapredict_active_user', JSON.stringify(user));
      } catch (e) {
        console.error('Failed to persist user profile to localStorage', e);
      }
    }
  }, [user]);

  const switchRole = useCallback((newRole: UserRole) => {
    setUser((prev) => {
      const matched = INITIAL_USER_PROFILES.find((p) => p.role === newRole);
      if (matched) {
        return {
          ...matched,
          healthConditions: prev.healthConditions,
          alertThresholdAQI: prev.alertThresholdAQI,
          mfaEnabled: prev.mfaEnabled
        };
      }
      return {
        ...prev,
        role: newRole
      };
    });
  }, []);

  const updateUserProfile = useCallback((updates: Partial<UserProfile>) => {
    setUser((prev) => ({
      ...prev,
      ...updates
    }));
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const data = await res.json();
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('aurapredict_auth_token', data.token);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      // Fallback for offline mode or demo
      const found = INITIAL_USER_PROFILES.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (found) {
        setUser(found);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('aurapredict_auth_token');
    setToken(null);
    setIsAuthenticated(false);
  }, []);

  return {
    user,
    token,
    isAuthenticated,
    switchRole,
    updateUserProfile,
    login,
    logout
  };
}
