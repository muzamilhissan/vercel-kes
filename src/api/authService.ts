import { apiFetch } from './apiClient';
import { LoginCredentials, LoginResponse } from './types';

export const authService = {
  /**
   * Authenticate a user with email and password.
   * POST /auth/login
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    return apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  /**
   * Log out the current user.
   * GET /auth/logout
   */
  async logout(): Promise<void> {
    return apiFetch<void>('/auth/logout', {
      method: 'GET',
    });
  },
};
