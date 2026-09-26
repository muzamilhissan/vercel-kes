import { api } from '@/shared/api/client';
import type { User } from '@/shared/types/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  /** Some deployments nest the payload one level deeper. */
  data?: { token?: string; user?: User };
}

export const authApi = {
  login: (credentials: LoginCredentials) => api.post<LoginResponse>('/auth/login', credentials),
  logout: () => api.get<void>('/auth/logout'),
  generateSwitchToken: () => api.post<{ switch_token: string }>('/auth/generate-switch-token'),
  loginWithSwitchToken: (switchToken: string) =>
    api.post<LoginResponse>('/auth/token-login', { switch_token: switchToken }),
};
