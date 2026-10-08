import React, { createContext, useContext, useState, useEffect } from 'react';
import { IUser } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  loading: boolean;
  isFirstLogin: boolean;
  setIsFirstLogin: (val: boolean) => void;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: { name: string; email: string; password: string; confirmPassword?: string; collegeName?: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUserLocally: (updates: Partial<IUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('cg_token'));
  const [loading, setLoading] = useState<boolean>(true);
  const [isFirstLogin, setIsFirstLogin] = useState<boolean>(false);

  useEffect(() => {
    async function initAuth() {
      const storedToken = localStorage.getItem('cg_token');
      if (storedToken) {
        try {
          const profile = await api.getProfile();
          setUser(profile);
        } catch (err) {
          localStorage.removeItem('cg_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    }
    initAuth();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const res = await api.login(credentials);
    localStorage.setItem('cg_token', res.token);
    setToken(res.token);
    setUser(res.user);
    if (res.isFirstLogin) {
      setIsFirstLogin(true);
    }
  };

  const register = async (data: { name: string; email: string; password: string; confirmPassword?: string; collegeName?: string }) => {
    const res = await api.register(data);
    localStorage.setItem('cg_token', res.token);
    setToken(res.token);
    setUser(res.user);
    setIsFirstLogin(true);
  };

  const logout = () => {
    localStorage.removeItem('cg_token');
    setToken(null);
    setUser(null);
    setIsFirstLogin(false);
  };

  const refreshUser = async () => {
    try {
      const profile = await api.getProfile();
      setUser(profile);
    } catch (err) {
      // Ignore transient errors
    }
  };

  const updateUserLocally = (updates: Partial<IUser>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isFirstLogin,
        setIsFirstLogin,
        login,
        register,
        logout,
        refreshUser,
        updateUserLocally
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
