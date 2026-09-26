import { useMemo } from 'react';
import { CheckCircle2, FileText, PhoneForwarded, UserPlus, Users, XCircle, type LucideIcon } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { toLeadStatus, type LeadStatus } from '../../constants';
import type { Lead } from '../../types';

interface StatDefinition {
  label: string;
  icon: LucideIcon;
  iconClass: string;
  /** Omitted for the total, which counts every lead. */
  status?: LeadStatus;
}

const STATS: StatDefinition[] = [
  { label: 'Total Leads', icon: Users, iconClass: 'bg-emerald-100 text-emerald-500' },
  { label: 'New', icon: UserPlus, iconClass: 'bg-blue-100 text-blue-500', status: 'New' },
  { label: 'Contacted', icon: PhoneForwarded, iconClass: 'bg-amber-100 text-amber-500', status: 'Contacted' },
  { label: 'Proposed', icon: FileText, iconClass: 'bg-violet-100 text-violet-500', status: 'Proposed' },
  { label: 'Qualified', icon: CheckCircle2, iconClass: 'bg-emerald-100 text-emerald-500', status: 'Qualified' },
  { label: 'Disqualified', icon: XCircle, iconClass: 'bg-red-100 text-red-500', status: 'Disqualified' },
];

interface LeadStatsCardsProps {
  leads: Lead[];
  totalItems: number;
  /** The kanban layout keeps the cards on one row to line up with the columns. */
  alignToKanban?: boolean;
}

export function LeadStatsCards({ leads, totalItems, alignToKanban = false }: LeadStatsCardsProps) {
  const counts = useMemo(() => {
    const tally = new Map<LeadStatus, number>();
    for (const lead of leads) {
      const status = toLeadStatus(lead.status);
      tally.set(status, (tally.get(status) ?? 0) + 1);
    }
    return tally;
  }, [leads]);

  return (
    /* Two per row on phones; the flex row (and its kanban alignment) resumes at md. */
    <div
      className={cn(
        'mb-6 grid grid-cols-2 gap-3 md:flex md:gap-4',
        alignToKanban ? 'md:flex-nowrap md:gap-3' : 'md:flex-wrap',
      )}
    >
      {STATS.map(({ label, icon: Icon, iconClass, status }) => (
        <article
          key={label}
          className="relative flex flex-col gap-1.5 overflow-hidden rounded-xl border border-field bg-surface px-4 py-3 shadow-[0_4px_15px_rgb(0_0_0_/_0.03)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgb(0_0_0_/_0.06)] md:min-w-[8.125rem] md:flex-1"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</p>
          <p className="text-xl font-bold leading-tight text-slate-900">
            {status ? (counts.get(status) ?? 0) : totalItems || leads.length}
          </p>
          <span className={cn('absolute bottom-3 right-4 grid size-8 place-items-center rounded-lg opacity-85', iconClass)}>
            <Icon size={14} />
          </span>
        </article>
      ))}
    </div>
  );
}
