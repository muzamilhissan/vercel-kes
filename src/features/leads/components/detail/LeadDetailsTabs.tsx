import { cn } from '@/shared/lib/cn';

export const LEAD_TABS = ['overview', 'proposals', 'followups'] as const;
export type LeadTab = (typeof LEAD_TABS)[number];

const LABELS: Record<LeadTab, string> = {
  overview: 'Overview',
  proposals: 'Proposals',
  followups: 'Follow-ups',
};

interface LeadDetailsTabsProps {
  active: LeadTab;
  onChange: (tab: LeadTab) => void;
}

export function LeadDetailsTabs({ active, onChange }: LeadDetailsTabsProps) {
  return (
    <div role="tablist" className="mb-5 flex gap-3 border-b border-line pb-0.5">
      {LEAD_TABS.map((tab) => (
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
