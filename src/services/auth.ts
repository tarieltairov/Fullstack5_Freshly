import { api } from './httpClient';
import { normalizeUser, type ApiUser } from '../types/user';

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput extends LoginInput {
  name: string;
}

interface AuthResponse {
  access_token: string;
}

export async function loginRequest(data: LoginInput) {
  const response = await api.post<AuthResponse>('/auth/login', data);
  return response.data;
}

export async function registerRequest(data: RegisterInput) {
  const response = await api.post<AuthResponse>('/auth/register', data);
  return response.data;
}

export async function getCurrentUser() {
  const response = await api.get<ApiUser>('/users/me');
  return normalizeUser(response.data);
}
