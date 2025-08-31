import { useState, useEffect, useCallback, useMemo } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import createContextHook from '@nkzw/create-context-hook';

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}



const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

// Mock storage for web compatibility
const webStorage = {
  getItem: (key: string) => Promise.resolve(localStorage.getItem(key)),
  setItem: (key: string, value: string) => Promise.resolve(localStorage.setItem(key, value)),
  deleteItem: (key: string) => Promise.resolve(localStorage.removeItem(key)),
};

const storage = Platform.OS === 'web' ? webStorage : {
  getItem: SecureStore.getItemAsync,
  setItem: SecureStore.setItemAsync,
  deleteItem: SecureStore.deleteItemAsync,
};

// Mock API functions - replace with real API calls
const mockLogin = async (email: string, password: string): Promise<{ success: boolean; user?: User; token?: string; error?: string }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock validation
  if (email === 'demo@example.com' && password === 'password') {
    return {
      success: true,
      user: {
        id: '1',
        email: 'demo@example.com',
        name: 'Demo User',
        createdAt: new Date().toISOString(),
      },
      token: 'mock_token_123',
    };
  }
  
  return {
    success: false,
    error: 'Invalid email or password',
  };
};

const mockSignup = async (email: string, password: string, name: string): Promise<{ success: boolean; user?: User; token?: string; error?: string }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock validation
  if (email && password && name) {
    return {
      success: true,
      user: {
        id: Date.now().toString(),
        email,
        name,
        createdAt: new Date().toISOString(),
      },
      token: 'mock_token_' + Date.now(),
    };
  }
  
  return {
    success: false,
    error: 'Please fill in all fields',
  };
};

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isAuthenticated = !!user;

  // Load user data on app start
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const [token, userData] = await Promise.all([
        storage.getItem(AUTH_TOKEN_KEY),
        storage.getItem(USER_DATA_KEY),
      ]);

      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
    } catch {
      console.log('Error loading stored auth');
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const result = await mockLogin(email, password);
      
      if (result.success && result.user && result.token) {
        await Promise.all([
          storage.setItem(AUTH_TOKEN_KEY, result.token),
          storage.setItem(USER_DATA_KEY, JSON.stringify(result.user)),
        ]);
        setUser(result.user);
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch {
      return { success: false, error: 'Login failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const result = await mockSignup(email, password, name);
      
      if (result.success && result.user && result.token) {
        await Promise.all([
          storage.setItem(AUTH_TOKEN_KEY, result.token),
          storage.setItem(USER_DATA_KEY, JSON.stringify(result.user)),
        ]);
        setUser(result.user);
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch {
      return { success: false, error: 'Signup failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await Promise.all([
        storage.deleteItem(AUTH_TOKEN_KEY),
        storage.deleteItem(USER_DATA_KEY),
      ]);
      setUser(null);
    } catch {
      console.log('Error during logout');
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<User>): Promise<void> => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    try {
      await storage.setItem(USER_DATA_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch {
      console.log('Error updating profile');
    }
  }, [user]);

  return useMemo(() => ({
    user,
    isLoading,
    isAuthenticated,
    login,
    signup,
    logout,
    updateProfile,
  }), [user, isLoading, isAuthenticated, login, signup, logout, updateProfile]);
});