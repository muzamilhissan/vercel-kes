import { useCallback, useMemo, useRef, useState } from 'react';
import { LeadKanbanCard } from './LeadKanbanCard';
import type { Lead } from '../../../types';

const PAGE_SIZE = 20;

interface ColumnDefinition {
  title: string;
  color: string;
  /** Statuses that land in this column. */
  statuses: string[];
}

const COLUMNS: ColumnDefinition[] = [
  { title: 'New', color: '#3b82f6', statuses: ['New'] },
  { title: 'Contacted', color: '#f59e0b', statuses: ['Contacted'] },
  { title: 'Proposed', color: '#8b5cf6', statuses: ['Proposed'] },
  { title: 'Closed', color: '#64748b', statuses: ['Qualified', 'Disqualified'] },
];

interface ColumnProps extends Omit<ColumnDefinition, 'statuses'> {
  leads: Lead[];
  canAssign: boolean;
  onCardClick: (lead: Lead) => void;
  onAssign?: (lead: Lead) => void;
}

function KanbanColumn({ title, color, leads, canAssign, onCardClick, onAssign }: ColumnProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const observer = useRef<IntersectionObserver | null>(null);

  // Reveal the next batch when the sentinel at the end of the column scrolls into view.
  const sentinelRef = useCallback((node: HTMLDivElement | null) => {
    observer.current?.disconnect();
    if (!node) return;

    observer.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisibleCount((count) => count + PAGE_SIZE);
    });
    observer.current.observe(node);
  }, []);

  return (
    <section className="flex min-w-[15rem] flex-1 flex-col rounded-[0.875rem] border border-line bg-field">
      <header
        style={{ borderTopColor: color }}
        className="sticky top-0 z-10 flex w-full items-center justify-center gap-2 rounded-t-[0.875rem] border-t-4 bg-field p-4"
      >
        <h3 className="text-sm font-bold -tracking-[0.2px] text-ink">{title}</h3>
        <span
          style={{ backgroundColor: `${color}20`, color }}
          className="rounded-full px-2 py-0.5 text-2xs font-bold"
        >
          {leads.length}
        </span>
      </header>

      <div className="scrollbar-thin flex flex-1 flex-col gap-3 overflow-y-auto px-3 pb-3.5">
        {leads.length === 0 ? (
          <p className="px-5 py-10 text-center text-label font-medium text-ink-subtle">No leads in this stage</p>
        ) : (
          <>
            {leads.slice(0, visibleCount).map((lead) => (
              <LeadKanbanCard
                key={lead.id}
                lead={lead}
                color={color}
                canAssign={canAssign}
                onClick={onCardClick}
                onAssign={onAssign}
              />
            ))}
            {leads.length > visibleCount && (
              <div ref={sentinelRef} className="p-3 text-center text-label text-ink-subtle">
                Loading more...
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

interface LeadKanbanBoardProps {
  leads: Lead[];
  canAssign: boolean;
  onView: (lead: Lead) => void;
  onAssign?: (lead: Lead) => void;
}

export function LeadKanbanBoard({ leads, canAssign, onView, onAssign }: LeadKanbanBoardProps) {
  const byColumn = useMemo(
    () => COLUMNS.map((column) => ({ ...column, leads: leads.filter((lead) => column.statuses.includes(lead.status ?? '')) })),
    [leads],
  );

  return (
    <div className="flex min-h-full w-max min-w-full items-stretch gap-3">
      {byColumn.map((column) => (
        <KanbanColumn
          key={column.title}
          title={column.title}
          color={column.color}
          leads={column.leads}
          canAssign={canAssign}
          onCardClick={onView}
          onAssign={onAssign}
        />
      ))}
    </div>
  );
}
