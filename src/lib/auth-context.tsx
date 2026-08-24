'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole } from '@/types';
import { storage } from './storage';
import { DEMO_USERS } from './demo-data';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (emailOrMobile: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, mobile: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  canManageSettings: boolean;
  canAddChanda: boolean;
  canManageExpenses: boolean;
  canManageMembers: boolean;
  canExportReports: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    storage.initializeStorage();
    const currentUser = storage.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (emailOrMobile: string, _password?: string): Promise<{ success: boolean; message?: string }> => {
    const clean = emailOrMobile.trim().toLowerCase();
    const users = storage.getUsers();
    const matched = users.find(
      (u) => u.email.toLowerCase() === clean || u.mobile.replace(/\D/g, '') === clean.replace(/\D/g, '')
    );

    if (matched) {
      storage.setCurrentUser(matched);
      setUser(matched);
      return { success: true };
    }

    // If new mobile/email during quick login, create basic user
    const newUser = storage.registerUser({
      name: emailOrMobile.includes('@') ? emailOrMobile.split('@')[0] : `Volunteer (${emailOrMobile})`,
      email: emailOrMobile.includes('@') ? emailOrMobile : `${emailOrMobile}@ganeshseva.org`,
      mobile: emailOrMobile.replace(/\D/g, '') || '9848012345',
      role: 'collector',
    });
    setUser(newUser);
    return { success: true };
  };

  const register = async (name: string, email: string, mobile: string, _password?: string) => {
    const newUser = storage.registerUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      mobile: mobile.trim(),
      role: 'owner', // Registered committee founder defaults to owner
    });
    setUser(newUser);
    return { success: true };
  };

  const logout = () => {
    storage.setCurrentUser(null);
    setUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    const demoUserForRole = DEMO_USERS.find((u) => u.role === newRole);
    if (demoUserForRole) {
      storage.setCurrentUser(demoUserForRole);
      setUser(demoUserForRole);
    } else if (user) {
      const updated = { ...user, role: newRole };
      storage.setCurrentUser(updated);
      setUser(updated);
    }
  };

  const currentRole: UserRole = user?.role || 'viewer';

  const canManageSettings = currentRole === 'owner' || currentRole === 'admin';
  const canAddChanda = currentRole === 'owner' || currentRole === 'admin' || currentRole === 'collector';
  const canManageExpenses = currentRole === 'owner' || currentRole === 'admin';
  const canManageMembers = currentRole === 'owner' || currentRole === 'admin';
  const canExportReports = currentRole !== 'viewer';

  return (
    <AuthContext.Provider
      value={{
        user,
        role: currentRole,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        switchRole,
        canManageSettings,
        canAddChanda,
        canManageExpenses,
        canManageMembers,
        canExportReports,
      }}
    >
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
