import { ExternalLink, LogOut, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { POMS_ALLOWED_EMAIL, redirectToKudonPOMS } from '@/features/auth/sso';
import { session } from '@/shared/auth/session';
import { cn } from '@/shared/lib/cn';
import { NAV_ITEMS } from './navigation';
import { SidebarProfile } from './SidebarProfile';

const ITEM_BASE =
  'mb-1.5 flex items-center gap-3 rounded-2xl px-[1.125rem] py-3 text-sm font-bold transition-all duration-300 ease-control';
const INACTIVE_ITEM = 'text-slate-600 hover:translate-x-1.5 hover:bg-white/50 hover:text-brand';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSignOut: () => void;
}

export function Sidebar({ isOpen, onClose, onSignOut }: SidebarProps) {
  const canSwitchToPoms = session.getUser()?.email === POMS_ALLOWED_EMAIL;

  return (
    <aside
      className={cn(
        'flex w-[17.5rem] shrink-0 flex-col border-r border-blue-100 bg-linear-to-b from-[#f1f4ff] to-[#e5eaff] px-5 py-8',
        'sticky top-0 h-dvh',
        'max-md:fixed max-md:inset-y-0 max-md:z-1000 max-md:shadow-[20px_0_50px_rgb(15_23_42_/_0.15)] max-md:transition-[left] max-md:duration-300 max-md:ease-control',
        isOpen ? 'max-md:left-0' : 'max-md:-left-[17.5rem]',
      )}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close sidebar"
        className="absolute right-5 top-6 hidden size-9 place-items-center rounded-full text-ink-muted transition-all hover:bg-brand/10 hover:text-brand max-md:grid"
      >
        <X size={20} />
      </button>

      <div className="mb-6 flex items-center justify-center">
        <img src="/nobg-logo.png" alt="KES" className="h-8 w-auto object-contain" />
      </div>

      <SidebarProfile />

      <nav className="flex flex-1 flex-col">
        <p className="mb-3 px-3 text-2xs font-extrabold uppercase tracking-[1.5px] text-ink-muted">Menu</p>
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                ITEM_BASE,
                isActive
                  ? 'border border-brand/15 bg-white text-brand shadow-[0_10px_25px_-5px_rgb(112_48_159_/_0.15)]'
                  : INACTIVE_ITEM,
              )
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}

        {canSwitchToPoms && (
          <button
            type="button"
            onClick={redirectToKudonPOMS}
            className={cn(ITEM_BASE, INACTIVE_ITEM)}
          >
            <ExternalLink size={20} />
            Go to POMS
          </button>
        )}
      </nav>

      <div className="flex flex-col border-t border-brand/10 pt-6">
        <button
          type="button"
          onClick={onSignOut}
          className={cn(ITEM_BASE, INACTIVE_ITEM)}
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
