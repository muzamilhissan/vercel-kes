import { useMemo } from 'react';
import { Calendar, Menu, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useGlobalSearch } from '@/shared/hooks/useGlobalSearch';
import { NAV_ITEMS } from './navigation';

const DATE_FORMAT: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { pathname } = useLocation();
  const { query, setQuery } = useGlobalSearch();

  const today = useMemo(() => new Date().toLocaleDateString('en-US', DATE_FORMAT), []);
  const section = NAV_ITEMS.find((item) => pathname.startsWith(item.to));
  const placeholder = section ? `Search ${section.label.toLowerCase()}...` : 'Search leads, deals, or tasks...';

  return (
    <header className="flex flex-col justify-center border-b border-field bg-surface px-4 py-3 md:px-10 md:py-4">
      <div className="flex w-full items-center justify-between gap-3 md:gap-5">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open menu"
            className="hidden shrink-0 rounded-lg p-2 text-ink transition-colors hover:bg-field max-md:block"
          >
            <Menu size={22} />
          </button>

          <img src="/nobg-logo.png" alt="KES" className="hidden h-7 w-auto object-contain max-md:block" />

          <nav aria-label="Breadcrumb" className="flex select-none items-center gap-2 text-sm font-semibold max-md:hidden">
            <span className="text-ink-subtle">Dashboard</span>
            <span className="text-2xs text-slate-300">&gt;</span>
            <span className="font-bold text-brand">{section?.label ?? 'Overview'}</span>
          </nav>
        </div>

        <div className="flex flex-[1.2] justify-center">
          <label className="flex w-full max-w-[27.5rem] items-center rounded-[0.875rem] border border-indigo-50 bg-surface-muted px-[1.125rem] py-2.5 transition-all focus-within:border-brand focus-within:bg-surface focus-within:shadow-[0_4px_12px_rgb(112_48_159_/_0.08)]">
            <Search size={18} className="mr-3 shrink-0 text-brand" />
            <span className="sr-only">Search</span>
            <input
              type="search"
              value={query}
              placeholder={placeholder}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full border-none bg-transparent text-sm text-ink outline-none placeholder:text-ink-subtle"
            />
          </label>
        </div>

        <div className="flex flex-1 items-center justify-end gap-4 max-md:flex-none">
          <div className="flex items-center gap-2 rounded-xl border border-field bg-surface-muted px-3.5 py-2 text-label font-semibold text-ink-muted max-md:hidden">
            <Calendar size={15} />
            <span>{today}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
