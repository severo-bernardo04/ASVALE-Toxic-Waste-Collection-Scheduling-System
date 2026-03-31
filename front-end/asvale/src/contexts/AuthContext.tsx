import React, { createContext, useContext, useState, useCallback } from 'react';
import { authApi, SignInData, SignUpData, User } from '../services/api';

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (data: SignInData) => Promise<void>;
  signOut: () => void;
  signUp: (data: SignUpData) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('@Asvale:user');
    try {
      if (!storedUser || storedUser === "undefined") return null;
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  });

  const isAuthenticated = !!user;
  const isAdmin = user?.isAdmin || false;

  const signIn = useCallback(async (data: SignInData) => {
    const response = await authApi.signIn(data);
    console.log('Resposta do backend (login):', response.data);
    let { user: userData, token } = response.data;
    if (userData && (userData as any).admin !== undefined && userData.isAdmin === undefined) {
      userData.isAdmin = (userData as any).admin;
    }
    localStorage.setItem('@Asvale:user', JSON.stringify(userData));
    localStorage.setItem('@Asvale:token', token);
    setUser(userData);
    console.log('Usuário salvo no contexto (login):', userData);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@Asvale:user');
    localStorage.removeItem('@Asvale:token');
    setUser(null);
  }, []);

  const signUp = useCallback(async (data: SignUpData) => {
    const response = await authApi.signUp(data);
    console.log('Resposta do backend (registro):', response.data);
    let { user: userData, token } = response.data;
    if (userData && (userData as any).admin !== undefined && userData.isAdmin === undefined) {
      userData.isAdmin = (userData as any).admin;
    }
    localStorage.setItem('@Asvale:user', JSON.stringify(userData));
    localStorage.setItem('@Asvale:token', token);
    setUser(userData);
    console.log('Usuário salvo no contexto (registro):', userData);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        signIn,
        signOut,
        signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}; 