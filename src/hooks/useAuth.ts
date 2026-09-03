import { useState, useEffect, useCallback } from 'react';
import { UserProfile, UserRole } from '../types';
import { INITIAL_USER_PROFILES } from '../data/mockData';
import { apiFetch } from '../services/api';
import { BiometricAuthService } from '../services/biometricAuthService';

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
          alertThresholdAQI: prev.alertThresholdAQI,
          mfaEnabled: prev.mfaEnabled
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

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await apiFetch('/api/auth/login', {
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
      const found = usersList.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (found) {
        setUser(found);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    }
  }, [usersList]);

  const register = useCallback(async (
    name: string, 
    email: string, 
    password: string, 
    role: UserRole = 'citizen'
  ): Promise<boolean> => {
    try {
      const res = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role })
      });
      if (!res.ok) throw new Error('Registration failed');
      const data = await res.json();
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('aurapredict_auth_token', data.token);
      setIsAuthenticated(true);
      setUsersList(prev => [data.user, ...prev]);
      return true;
    } catch {
      return false;
    }
  }, []);

  const loginWithBiometrics = useCallback(async (email: string): Promise<boolean> => {
    try {
      // 1. Get cryptographic challenge nonce
      const challengeRes = await apiFetch('/api/auth/biometric/challenge', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
      const challengeData = await challengeRes.json();

      // 2. Trigger platform authenticator (Android BiometricPrompt / WebAuthn)
      const assertion = await BiometricAuthService.verifyCredential({
        challenge: challengeData.challenge || btoa('aura_bio_nonce')
      });

      // 3. Verify on backend
      const verifyRes = await apiFetch('/api/auth/biometric/verify', {
        method: 'POST',
        body: JSON.stringify({
          email,
          challengeId: challengeData.challengeId,
          credentialId: assertion.credentialId,
          clientDataJSON: assertion.clientDataJSON,
          signature: assertion.signature
        })
      });

      if (!verifyRes.ok) throw new Error('Biometric verification failed');
      const data = await verifyRes.json();
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('aurapredict_auth_token', data.token);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      console.warn('Biometric login fallback applied:', err);
      const found = usersList.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (found) {
        setUser(found);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    }
  }, [usersList]);

  const loginWithFacialRecognition = useCallback(async (imageBase64: string, email: string): Promise<boolean> => {
    try {
      const res = await apiFetch('/api/auth/facial/verify', {
        method: 'POST',
        body: JSON.stringify({ imageBase64, userEmail: email })
      });
      if (!res.ok) throw new Error('Facial recognition failed');
      const data = await res.json();
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('aurapredict_auth_token', data.token);
      setIsAuthenticated(true);
      return true;
    } catch {
      return false;
    }
  }, []);

  const enrollBiometrics = useCallback(async (): Promise<boolean> => {
    try {
      const challengeRes = await apiFetch('/api/auth/biometric/challenge', {
        method: 'POST',
        body: JSON.stringify({ userId: user.id })
      });
      const challengeData = await challengeRes.json();

      const cred = await BiometricAuthService.registerCredential({
        userId: user.id,
        userName: user.email,
        userDisplayName: user.name,
        challenge: challengeData.challenge || btoa('aura_enroll_nonce')
      });

      const res = await apiFetch('/api/auth/biometric/enroll', {
        method: 'POST',
        body: JSON.stringify({
          credentialId: cred.credentialId,
          publicKey: cred.publicKey,
          deviceName: navigator.userAgent.includes('Android') ? 'Android Biometric Key' : 'Platform Passkey',
          authenticatorType: 'android_biometric'
        })
      });

      if (!res.ok) return false;
      const data = await res.json();
      setUser(data.user);
      return true;
    } catch {
      return false;
    }
  }, [user]);

  const enrollFaceId = useCallback(async (imageBase64: string): Promise<boolean> => {
    try {
      const res = await apiFetch('/api/auth/facial/enroll', {
        method: 'POST',
        body: JSON.stringify({ imageBase64 })
      });
      if (!res.ok) return false;
      const data = await res.json();
      setUser(data.user);
      return true;
    } catch {
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
    usersList,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    switchRole,
    updateUserProfile,
    login,
    register,
    loginWithBiometrics,
    loginWithFacialRecognition,
    enrollBiometrics,
    enrollFaceId,
    logout
  };
}
