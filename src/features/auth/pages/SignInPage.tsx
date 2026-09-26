import { useState } from 'react';
import { ApiError } from '@/shared/api/ApiError';
import { authApi, type LoginCredentials } from '../api/authApi';
import { AuthShell } from '../components/AuthShell';
import { SignInForm } from '../components/SignInForm';
import type { SessionState } from '../hooks/useSession';

export function SignInPage({ signIn }: { signIn: SessionState['signIn'] }) {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (credentials: LoginCredentials) => {
    setError(null);
    try {
      signIn(await authApi.login(credentials));
    } catch (err) {
      setError(err instanceof ApiError || err instanceof Error ? err.message : 'Sign in failed. Please try again.');
    }
  };

  return (
    <AuthShell>
      <div className="flex w-full justify-center">
        <img src="/nobg-logo.png" alt="" className="h-8 w-auto" />
      </div>

      <div className="my-auto w-full max-w-[21.25rem]">
        <h2 className="mb-2 text-center font-serif text-[2.375rem] font-bold -tracking-[1px] text-black">Welcome Back</h2>
        <p className="mx-auto mb-10 max-w-[18.75rem] text-center text-sm leading-normal text-ink-muted">
          Enter your email and password to access your account
        </p>
        <SignInForm onSubmit={handleSubmit} error={error} />
      </div>
    </AuthShell>
  );
}
