/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState, type ReactNode } from 'react';
import type { StoredUser, User } from '../types/user';

type AuthResult = { ok: true } | { ok: false; error: string };

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuth: boolean;
  login: (val: LoginInput) => AuthResult;
  register: (val: RegisterInput) => AuthResult;
  logout: () => void;
}

const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'currentUser';

// -------------------------------------------
// helpers

function readUsers(): StoredUser[] {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
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
  };

  //функция входа
  const login = (val: LoginInput): AuthResult => {
    const users = readUsers();

    const found = users.find(
      (u) => u.email === val.email && u.password === val.password,
    );

    if (!found) {
      return { ok: false, error: 'Неверный email или пароль' };
    }

    const { password, ...safeUser } = found;
    console.log(password);

    setUser(safeUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));

    return { ok: true };
  };

  // функция регистрации
  const register = (val: RegisterInput): AuthResult => {
    const users = readUsers();

    if (
      users.some((u) => u.email === val.email && u.password === val.password)
    ) {
      return { ok: false, error: 'Пользователь с таким email уже существует' };
    }

    const isFirstUser = users.length === 0;

    const newUser: StoredUser = {
      id: Date.now(),
      email: val.email,
      name: val.name,
      password: val.password,
      role: isFirstUser ? 'admin' : 'user',
    };

    writeUsers([...users, newUser]);

    // Авто-логин после регистрации
    const { password, ...safeUser } = newUser;

    console.log(password);

    setUser(safeUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));

    return { ok: true };
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
