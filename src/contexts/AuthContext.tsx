import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../lib/api';
import { authService } from '../lib/services/auth.service';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, firstName: string, lastName: string, phone?: string, role?: string) => Promise<boolean>;
  logout: () => void;
  switchRole?: (role: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      api.setToken(token);
      // Optionally fetch user profile to validate token
      authService
        .getProfile()
        .then((response) => {
          const userData = response.data;
          // Transform backend response to User type
          const user: User = {
            id: userData.id,
            email: userData.email,
            name: `${userData.firstName} ${userData.lastName}`.trim(),
            role: userData.role as any,
            avatar: userData.avatar,
            phone: userData.phone,
          };
          setUser(user);
        })
        .catch(() => {
          // Token is invalid, clear it
          localStorage.removeItem('auth_token');
          api.clearToken();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.login({ email, password });
      // Handle both direct response and nested data structure
      const loginData = response.data || response;
      const { user: userData, token } = loginData;
      
      if (!userData || !token) {
        throw new Error('Invalid login response structure');
      }
      
      
      // Transform backend response to User type
      const user: User = {
        id: userData.id,
        email: userData.email,
        name: `${userData.firstName} ${userData.lastName}`.trim(),
        role: userData.role as any,
        avatar: userData.avatar,
      };
      
      api.setToken(token);
      setUser(user);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone?: string,
    role?: string
  ): Promise<boolean> => {
    try {
      await authService.register({
        email,
        password,
        firstName,
        lastName,
        phone,
        role,
      });
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    api.clearToken();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
