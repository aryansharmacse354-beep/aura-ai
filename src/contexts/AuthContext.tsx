import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: UserProfile;
  token: string | null;
  isAuthenticated: boolean;
  usersList: UserProfile[];
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  switchRole: (newRole: UserRole) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role?: UserRole) => Promise<boolean>;
  loginWithBiometrics: (email: string) => Promise<boolean>;
  loginWithFacialRecognition: (imageBase64: string, email: string) => Promise<boolean>;
  enrollBiometrics: () => Promise<boolean>;
  enrollFaceId: (imageBase64: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
