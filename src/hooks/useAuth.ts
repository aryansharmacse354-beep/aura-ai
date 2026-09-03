import { useState, useEffect, useCallback } from 'react';
import { UserProfile, UserRole } from '../types';
import { INITIAL_USER_PROFILES } from '../data/mockData';
import { apiFetch } from '../services/api';

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
  const [usersList, setUsersList] = useState<UserProfile[]>(INITIAL_USER_PROFILES);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

  // Fetch users list from backend
  useEffect(() => {
    apiFetch('/api/auth/users')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.users)) {
          setUsersList(data.users);
        }
      })
      .catch(() => {
        // keep INITIAL_USER_PROFILES
      });
  }, []);

  // Sync active user to localStorage
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
      const matched = usersList.find((p) => p.role === newRole) || INITIAL_USER_PROFILES.find((p) => p.role === newRole);
      if (matched) {
        return {
          ...matched,
          healthConditions: prev.healthConditions,
          alertThresholdAQI: prev.alertThresholdAQI
        };
      }
      return {
        ...prev,
        role: newRole
      };
    });
  }, [usersList]);

  const updateUserProfile = useCallback((updates: Partial<UserProfile>) => {
    setUser((prev) => ({
      ...prev,
      ...updates
    }));
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; user?: UserProfile; error?: string }> => {
    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Invalid credentials');
      }
      const data = await res.json();
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('aurapredict_auth_token', data.token);
      setIsAuthenticated(true);
      return { success: true, user: data.user };
    } catch (err: any) {
      // Fallback for offline mode or demo
      const found = usersList.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (found) {
        setUser(found);
        setIsAuthenticated(true);
        return { success: true, user: found };
      }
      return { success: false, error: err.message || 'Authentication failed.' };
    }
  }, [usersList]);

  const register = useCallback(async (account: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
  }): Promise<{ success: boolean; user?: UserProfile; error?: string }> => {
    try {
      const res = await apiFetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(account)
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Registration failed');
      }
      const data = await res.json();
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('aurapredict_auth_token', data.token);
      setIsAuthenticated(true);
      setUsersList(prev => [data.user, ...prev]);
      return { success: true, user: data.user };
    } catch (err: any) {
      return { success: false, error: err.message || 'Registration failed.' };
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
    usersList,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    switchRole,
    updateUserProfile,
    login,
    register,
    logout
  };
}
