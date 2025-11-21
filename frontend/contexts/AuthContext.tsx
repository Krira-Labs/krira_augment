"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, ProfileResponse } from '@/lib/api/auth.service';
import { useRouter } from 'next/navigation';

// User type
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  plan: string;
  isVerified: boolean;
  authProvider?: string;
  planPrice?: number;
  billingCycle?: string;
  subscriptionStart?: string;
  subscriptionEnd?: string;
  isActive?: boolean;
  apiKey?: string;
  apiUsage?: number;
  questionLimit?: number;
  questionsUsed?: number;
  chatbotLimit?: number;
  chatbotsCreated?: number;
  teamMembers?: number;
  supportType?: string;
  watermarkType?: string;
  analyticsEnabled?: boolean;
  earlyAccess?: boolean;
  vectorStoreType?: string;
  systemPrompt?: string;
  chatbots?: any[];
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Auth context type
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check authentication on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('Initializing auth, checking for session...');
        
        // Try to fetch user profile (will use httpOnly cookies automatically)
        try {
          const response = await authService.getProfile();
          
          if (response.success && response.user) {
            console.log('✓ User authenticated:', response.user.email);
            const userData: User = {
              id: response.user.id,
              name: response.user.name,
              email: response.user.email,
              role: response.user.role,
              plan: response.user.plan,
              isVerified: response.user.isVerified,
              authProvider: response.user.authProvider,
              planPrice: response.user.planPrice,
              billingCycle: response.user.billingCycle,
              subscriptionStart: response.user.subscriptionStart,
              subscriptionEnd: response.user.subscriptionEnd,
              isActive: response.user.isActive,
              apiKey: response.user.apiKey,
              apiUsage: response.user.apiUsage,
              questionLimit: response.user.questionLimit,
              questionsUsed: response.user.questionsUsed,
              chatbotLimit: response.user.chatbotLimit,
              chatbotsCreated: response.user.chatbotsCreated,
              teamMembers: response.user.teamMembers,
              supportType: response.user.supportType,
              watermarkType: response.user.watermarkType,
              analyticsEnabled: response.user.analyticsEnabled,
              earlyAccess: response.user.earlyAccess,
              vectorStoreType: response.user.vectorStoreType,
              systemPrompt: response.user.systemPrompt,
              chatbots: response.user.chatbots,
              lastLogin: response.user.lastLogin,
              createdAt: response.user.createdAt,
              updatedAt: response.user.updatedAt,
            };
            setUser(userData);
          } else {
            console.log('✗ No valid session found');
            setUser(null);
          }
        } catch (error: any) {
          console.log('✗ Auth check failed:', error.status || error.message);
          // Token is invalid/expired or not present
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
        console.log('Auth initialization complete');
      }
    };

    initAuth();

    // Listen for unauthorized events from ApiClient (e.g. failed refresh)
    const handleUnauthorized = () => {
      console.log('Received auth:unauthorized event, logging out...');
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  // Login function
  const login = (userData: User) => {
    console.log('Setting user in context:', userData.email);
    setUser(userData);
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      authService.clearAuth();
      setUser(null);
      router.push('/');
    }
  };

  // Update user function
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
    }
  };

  // Refresh user data from server
  const refreshUser = async () => {
    try {
      const response = await authService.getProfile();
      if (response.success && response.user) {
        const userData: User = {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          role: response.user.role,
          plan: response.user.plan,
          isVerified: response.user.isVerified,
          authProvider: response.user.authProvider,
          planPrice: response.user.planPrice,
          billingCycle: response.user.billingCycle,
          subscriptionStart: response.user.subscriptionStart,
          subscriptionEnd: response.user.subscriptionEnd,
          isActive: response.user.isActive,
          apiKey: response.user.apiKey,
          apiUsage: response.user.apiUsage,
          questionLimit: response.user.questionLimit,
          questionsUsed: response.user.questionsUsed,
          chatbotLimit: response.user.chatbotLimit,
          chatbotsCreated: response.user.chatbotsCreated,
          teamMembers: response.user.teamMembers,
          supportType: response.user.supportType,
          watermarkType: response.user.watermarkType,
          analyticsEnabled: response.user.analyticsEnabled,
          earlyAccess: response.user.earlyAccess,
          vectorStoreType: response.user.vectorStoreType,
          systemPrompt: response.user.systemPrompt,
          chatbots: response.user.chatbots,
          lastLogin: response.user.lastLogin,
          createdAt: response.user.createdAt,
          updatedAt: response.user.updatedAt,
        };
        setUser(userData);
      }
    } catch (error) {
      console.error('Refresh user error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
