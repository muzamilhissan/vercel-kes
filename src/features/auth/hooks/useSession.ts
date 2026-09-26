import { useCallback, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { session, UNAUTHORIZED_EVENT } from '@/shared/auth/session';
import type { User } from '@/shared/types/api';
import { authApi, type LoginResponse } from '../api/authApi';

/** The API returns the payload either at the root or nested under `data`. */
export function readLoginResponse(response: LoginResponse) {
  return {
    token: response.token ?? response.data?.token,
    user: response.user ?? response.data?.user,
  };
}

export interface SessionState {
  isAuthenticated: boolean;
  user: User | null;
  signIn: (response: LoginResponse) => void;
  signOut: () => Promise<void>;
}

export function useSession(): SessionState {
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(() => session.isAuthenticated());
  const [user, setUser] = useState<User | null>(() => session.getUser());

  // The API client clears the session on a 401; mirror that into React state.
  useEffect(() => {
    const handleUnauthorized = () => {
      setIsAuthenticated(false);
      setUser(null);
      queryClient.clear();
    };
    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
  }, [queryClient]);

  const signIn = useCallback((response: LoginResponse) => {
    const { token, user: nextUser } = readLoginResponse(response);
    if (!token) throw new Error('Login succeeded but no token was returned.');

    session.save(token, nextUser);
    setUser(nextUser ?? null);
    setIsAuthenticated(true);
  }, []);

  const signOut = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // The local session is cleared either way, so a failed call must not block sign-out.
    }
    session.clear();
    queryClient.clear();
    setIsAuthenticated(false);
    setUser(null);
  }, [queryClient]);

  return { isAuthenticated, user, signIn, signOut };
}
