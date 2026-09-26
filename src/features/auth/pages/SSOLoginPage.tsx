import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader } from '@/shared/ui/feedback/Loader';
import { authApi } from '../api/authApi';
import { AuthShell } from '../components/AuthShell';
import type { SessionState } from '../hooks/useSession';

const REDIRECT_DELAY_MS = 3000;

/** Exchanges a Kudon-POMS switch token for a CRM session, then lands on Leads. */
export function SSOLoginPage({ signIn }: { signIn: SessionState['signIn'] }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const hasRun = useRef(false);

  const switchToken = searchParams.get('token');

  useEffect(() => {
    // Switch tokens are single-use, so guard against React's double-invoked effects.
    if (hasRun.current) return;
    hasRun.current = true;

    if (!switchToken) {
      setError('No authentication token provided.');
      return;
    }

    authApi
      .loginWithSwitchToken(switchToken)
      .then((response) => {
        signIn(response);
        navigate('/leads', { replace: true });
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Authentication failed. Please try again.');
      });
  }, [switchToken, signIn, navigate]);

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => navigate('/login', { replace: true }), REDIRECT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [error, navigate]);

  return (
    <AuthShell>
      <div className="text-center">
        <img src="/nobg-logo.png" alt="" className="mx-auto mb-5 w-[7.5rem]" />
        {error ? (
          <>
            <h2 className="mb-2 text-2xl font-bold text-red-600">Authentication Failed</h2>
            <p className="mt-5 rounded-lg bg-red-50 px-4 py-4 text-red-600">{error}</p>
            <p className="mt-4 text-ink-muted">Redirecting to login page...</p>
          </>
        ) : (
          <>
            <h2 className="mb-2 text-2xl font-bold text-ink">Logging you in...</h2>
            <p className="mb-8 text-ink-muted">Please wait while we authenticate your session.</p>
            <Loader className="h-auto" />
          </>
        )}
      </div>
    </AuthShell>
  );
}
