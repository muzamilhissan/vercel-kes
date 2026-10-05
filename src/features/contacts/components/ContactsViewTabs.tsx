import { cn } from '@/shared/lib/cn';

export const CONTACT_VIEWS = ['converted', 'contacts'] as const;
export type ContactView = (typeof CONTACT_VIEWS)[number];

const LABELS: Record<ContactView, string> = {
  converted: 'Converted Leads',
  contacts: 'Contacts',
};

interface ContactsViewTabsProps {
  active: ContactView;
  onChange: (view: ContactView) => void;
}

export function ContactsViewTabs({ active, onChange }: ContactsViewTabsProps) {
  return (
    <div role="tablist" className="mb-5 flex gap-3 border-b border-line pb-0.5">
      {CONTACT_VIEWS.map((view) => (
        <button
          key={view}
          role="tab"
          type="button"
          aria-selected={active === view}
          onClick={() => onChange(view)}
          className={cn(
            'relative px-4 py-2 text-[0.9375rem] font-semibold transition-colors',
            active === view
              ? 'text-indigo-500 after:absolute after:inset-x-0 after:-bottom-[3px] after:h-0.5 after:rounded-t-sm after:bg-indigo-500'
              : 'text-ink-muted hover:text-ink',
          )}
        >
          {LABELS[view]}
        </button>
      ))}
    </div>
  );
}
