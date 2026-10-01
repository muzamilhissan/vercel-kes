import { cn } from '@/shared/lib/cn';

export const ADMIN_TABS = ['document-types'] as const;
export type AdminTab = (typeof ADMIN_TABS)[number];

const LABELS: Record<AdminTab, string> = {
  'document-types': 'Document Type',
};

interface AdminConfigTabsProps {
  active: AdminTab;
  onChange: (tab: AdminTab) => void;
}

export function AdminConfigTabs({ active, onChange }: AdminConfigTabsProps) {
  return (
    <div role="tablist" className="mb-5 flex gap-3 border-b border-line pb-0.5">
      {ADMIN_TABS.map((tab) => (
        <button
          key={tab}
          role="tab"
          type="button"
          aria-selected={active === tab}
          onClick={() => onChange(tab)}
          className={cn(
            'relative px-4 py-2 text-[0.9375rem] font-semibold transition-colors',
            active === tab
              ? 'text-indigo-500 after:absolute after:inset-x-0 after:-bottom-[3px] after:h-0.5 after:rounded-t-sm after:bg-indigo-500'
              : 'text-ink-muted hover:text-ink',
          )}
        >
          {LABELS[tab]}
        </button>
      ))}
    </div>
  );
}
