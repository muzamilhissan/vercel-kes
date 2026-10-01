import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useSearchParams } from 'react-router-dom';
import { SignInPage } from '@/features/auth/pages/SignInPage';
import { SSOLoginPage } from '@/features/auth/pages/SSOLoginPage';
import type { SessionState } from '@/features/auth/hooks/useSession';
import { AppLayout } from '@/shared/layout/AppLayout';
import { isSuperAdmin } from '@/shared/auth/permissions';
import { session as sessionStore } from '@/shared/auth/session';
import { Loader } from '@/shared/ui/feedback/Loader';

// Feature pages are split out so the initial bundle only carries the shell.
const LeadsPage = lazy(() => import('@/features/leads/pages/LeadsPage'));
const LeadDetailsPage = lazy(() => import('@/features/leads/pages/LeadDetailsPage'));
const DealsPage = lazy(() => import('@/features/deals/pages/DealsPage'));
const ContactsPage = lazy(() => import('@/features/contacts/pages/ContactsPage'));
const AccountsPage = lazy(() => import('@/features/accounts/pages/AccountsPage'));
const DocumentsPage = lazy(() => import('@/features/documents/pages/DocumentsPage'));
const AdminConfigurationsPage = lazy(() => import('@/features/admin/pages/AdminConfigurationsPage'));

/** POMS hands the session over as `/?token=...`, so the root doubles as the SSO callback. */
function RootEntry({ signIn }: { signIn: SessionState['signIn'] }) {
  const [searchParams] = useSearchParams();
  if (searchParams.has('token')) return <SSOLoginPage signIn={signIn} />;
  return <Navigate to="/login" replace />;
}

export function AppRoutes({ session }: { session: SessionState }) {
  const { isAuthenticated, signIn, signOut } = session;
  const isAdmin = isSuperAdmin(sessionStore.getUser());

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<RootEntry signIn={signIn} />} />
        <Route path="/login" element={<SignInPage signIn={signIn} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Suspense fallback={<Loader message="Loading..." className="h-full" />}>
      <Routes>
        <Route element={<AppLayout onSignOut={signOut} />}>
          <Route path="/leads" element={<LeadsPage />} />
          <Route path="/leads/:leadId" element={<LeadDetailsPage />} />
          <Route path="/deals" element={<DealsPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          {isAdmin && <Route path="/admin-configurations" element={<AdminConfigurationsPage />} />}
        </Route>
        <Route path="*" element={<Navigate to="/leads" replace />} />
      </Routes>
    </Suspense>
  );
}
