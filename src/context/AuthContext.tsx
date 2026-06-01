/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User } from '../types/user';
import {
  clearAccessToken,
  getApiErrorMessage,
  getCurrentUser,
  loginRequest,
  registerRequest,
  setAccessToken,
  type LoginInput,
  type RegisterInput,
} from '../services/api';

type AuthResult = { ok: true } | { ok: false; error: string };

interface AuthContextType {
  user: User | null;
  isAuth: boolean;
  login: (val: LoginInput) => Promise<AuthResult>;
  register: (val: RegisterInput) => Promise<AuthResult>;
  logout: () => void;
}

const CURRENT_USER_KEY = 'currentUser';

// -------------------------------------------

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(CURRENT_USER_KEY);

      if (!raw) return null;

      return JSON.parse(raw);
    } catch (error) {
      console.error('Invalid user data in localStorage:', error);

      localStorage.removeItem(CURRENT_USER_KEY);

      return null;
    }
  });

  // выход
  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
    clearAccessToken();
  };

  //функция входа
  const login = async (data: LoginInput): Promise<AuthResult> => {
    try {
      const { access_token } = await loginRequest(data);
      setAccessToken(access_token);

      const user = await getCurrentUser();
      setUser(user);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

      return { ok: true };
    } catch (err) {
      return { ok: false, error: getApiErrorMessage(err) };
    }
  };

  // функция регистрации
  const register = async (data: RegisterInput): Promise<AuthResult> => {
    try {
      const { access_token } = await registerRequest(data);
      setAccessToken(access_token);

      const user = await getCurrentUser();
      setUser(user);

      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

      return { ok: true };
    } catch (err) {
      return { ok: false, error: getApiErrorMessage(err) };
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuth: !!user, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuth must be used within <AuthProvider>');
  }

  return ctx;
}
