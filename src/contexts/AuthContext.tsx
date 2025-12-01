import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, getToken, setToken as saveToken, removeToken } from '@/lib/api';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = getToken();
      if (savedToken) {
        try {
          const response = await authApi.getProfile();
          if (response.success) {
            setUser(response.data);
            setToken(savedToken);
          } else {
            removeToken();
            setToken(null);
          }
        } catch (error) {
          console.error('Auth init error:', error);
          removeToken();
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authApi.login(email, password);
    if (response.success) {
      setUser(response.data.user);
      setToken(response.data.token);
      saveToken(response.data.token);
    } else {
      throw new Error(response.error || 'Login fehlgeschlagen');
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    const response = await authApi.register(email, password, name);
    if (response.success) {
      setUser(response.data.user);
      setToken(response.data.token);
      saveToken(response.data.token);
    } else {
      throw new Error(response.error || 'Registrierung fehlgeschlagen');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    removeToken();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
