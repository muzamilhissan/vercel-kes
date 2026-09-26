import { useMemo } from 'react';
import { session } from '@/shared/auth/session';

const FALLBACK_AVATAR =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop';

export function SidebarProfile() {
  const user = session.getUser();

  const { fullName, designation, avatarUrl } = useMemo(() => {
    const name = user?.name || user?.fullName || 'Jane Sparrow';
    return {
      fullName: name,
      designation: user?.roles?.[0]?.name || user?.designation || 'Sales Executive',
      avatarUrl: user
        ? `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=70309f&color=fff&bold=true`
        : FALLBACK_AVATAR,
    };
  }, [user]);

  return (
    <div className="mb-6 flex items-center gap-4 px-3">
      <div className="relative grid size-[3.375rem] place-items-center">
        <span className="absolute inset-0 rotate-45 rounded-full border-2 border-indigo-50 border-r-brand border-t-brand" />
        <img
          src={avatarUrl}
          alt=""
          className="z-1 size-11 rounded-full border-2 border-white bg-field object-cover"
        />
      </div>
      <div className="min-w-0">
        <h3 className="truncate text-[0.9375rem] font-bold text-ink">{fullName}</h3>
        <p className="mt-0.5 truncate text-xs font-medium text-ink-subtle">{designation}</p>
      </div>
    </div>
  );
}
