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

  /**
   * SSO: Generate a switch token to redirect to Kudon-POMS
   * POST /auth/generate-switch-token
   */
  async generateSwitchToken(): Promise<{ switch_token: string }> {
    return apiFetch<{ switch_token: string }>('/auth/generate-switch-token', {
      method: 'POST',
    });
  },

  /**
   * SSO: Login with a switch token from Kudon-POMS
   * POST /auth/token-login
   */
  async loginWithSwitchToken(switchToken: string): Promise<LoginResponse> {
    return apiFetch<LoginResponse>('/auth/token-login', {
      method: 'POST',
      body: JSON.stringify({ switch_token: switchToken }),
    });
  },
};