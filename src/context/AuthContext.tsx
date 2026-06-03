/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  AUTH_UNAUTHORIZED_EVENT,
  CURRENT_USER_KEY,
  clearAuthStorage,
  getAccessToken,
  getApiErrorMessage,
  getCurrentUser,
  loginRequest,
  registerRequest,
  setAccessToken,
  type LoginInput,
  type RegisterInput,
} from '../services/api';
import type { User } from '../types/user';

type AuthResult = { ok: true } | { ok: false; error: string };

interface AuthContextType {
  user: User | null;
  isAuth: boolean;
  isLoading: boolean;
  login: (val: LoginInput) => Promise<AuthResult>;
  register: (val: RegisterInput) => Promise<AuthResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function readCurrentUser() {
  if (!getAccessToken()) return null;

  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    localStorage.removeItem(CURRENT_USER_KEY);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(readCurrentUser);
  const [isLoading, setIsLoading] = useState(() => !!getAccessToken());

  useEffect(() => {
    let ignore = false;
    const token = getAccessToken();

    if (!token) {
      return;
    }

    getCurrentUser()
      .then((currentUser) => {
        if (ignore) return;
        setUser(currentUser);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
      })
      .catch(() => {
        if (ignore) return;
        clearAuthStorage();
        setUser(null);
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setIsLoading(false);
    };

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);

    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, []);

  const logout = () => {
    setUser(null);
    clearAuthStorage();
  };

  const login = async (data: LoginInput): Promise<AuthResult> => {
    try {
      const { access_token } = await loginRequest(data);
      setAccessToken(access_token);

      const currentUser = await getCurrentUser();
      setUser(currentUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));

      return { ok: true };
    } catch (err) {
      return { ok: false, error: getApiErrorMessage(err) };
    }
  };

  const register = async (data: RegisterInput): Promise<AuthResult> => {
    try {
      const { access_token } = await registerRequest(data);
      setAccessToken(access_token);

      const currentUser = await getCurrentUser();
      setUser(currentUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));

      return { ok: true };
    } catch (err) {
      return { ok: false, error: getApiErrorMessage(err) };
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuth: !!user, isLoading, login, register, logout }}
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
