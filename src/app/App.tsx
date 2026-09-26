import { useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';
import { useSession } from '@/features/auth/hooks/useSession';
import { ConfirmDialog } from '@/shared/ui/overlay/ConfirmDialog';
import { AppRoutes } from './routes';

export function App() {
  const session = useSession();
  const [isSignOutOpen, setIsSignOutOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    document.title = session.isAuthenticated ? 'KudonCRM' : 'Login';
  }, [session.isAuthenticated]);

  const confirmSignOut = async () => {
    setIsSigningOut(true);
    await session.signOut();
    setIsSigningOut(false);
    setIsSignOutOpen(false);
  };

  return (
    <>
      <AppRoutes session={{ ...session, signOut: async () => setIsSignOutOpen(true) }} />
      <ConfirmDialog
        open={isSignOutOpen}
        onOpenChange={setIsSignOutOpen}
        title="Confirm Sign Out"
        icon={LogOut}
        message="Are you sure you want to sign out of KudonCRM?"
        confirmLabel="Sign Out"
        isPending={isSigningOut}
        onConfirm={confirmSignOut}
      />
    </>
  );
}
