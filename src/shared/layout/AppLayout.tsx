import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function AppLayout({ onSignOut }: { onSignOut: () => void }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-dvh overflow-hidden bg-surface">
      {isSidebarOpen && (
        <div
          onClick={closeSidebar}
          aria-hidden
          className="fixed inset-0 z-999 bg-slate-900/30 backdrop-blur-[4px] md:hidden"
        />
      )}

      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} onSignOut={onSignOut} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="scrollbar-thin flex flex-1 flex-col overflow-auto bg-surface-muted p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
