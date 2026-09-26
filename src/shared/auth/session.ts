import type { User } from '@/shared/types/api';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

/** Fired when the API rejects the stored token, so the app can drop to the sign-in screen. */
export const UNAUTHORIZED_EVENT = 'auth:unauthorized';

function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

/**
 * Token + user persistence. Kept as a module rather than a hook so the API client,
 * which runs outside React, can read the token too.
 */
export const session = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  getUser: () => readJson<User>(USER_KEY),
  isAuthenticated: () => Boolean(localStorage.getItem(TOKEN_KEY)),

  save(token: string, user?: User | null) {
    localStorage.setItem(TOKEN_KEY, token);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
  },
};
