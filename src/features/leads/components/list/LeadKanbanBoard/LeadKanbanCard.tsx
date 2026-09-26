import { Coins, UserPlus } from 'lucide-react';
import { assigneesOf } from '../../../lib/assignees';
import type { Lead } from '../../../types';

const MAX_AVATARS = 2;

const SHORT_DATE: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };

interface LeadKanbanCardProps {
  lead: Lead;
  color: string;
  canAssign: boolean;
  onClick: (lead: Lead) => void;
  onAssign?: (lead: Lead) => void;
}

export function LeadKanbanCard({ lead, color, canAssign, onClick, onAssign }: LeadKanbanCardProps) {
  const assignees = assigneesOf(lead);
  const added = lead.dateAdded ? new Date(lead.dateAdded) : null;
  const isClosed = lead.status === 'Qualified' || lead.status === 'Disqualified';

  return (
    <article
      onClick={() => onClick(lead)}
      style={{ backgroundColor: `${color}08`, borderColor: `${color}30` }}
      className="flex cursor-pointer flex-col gap-2 rounded-[0.625rem] border-[1.5px] bg-surface p-3 shadow-sm transition-all duration-200 ease-control hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
    >
      <header className="flex items-start justify-between gap-2.5">
        <h4 className="flex-1 text-[0.84375rem] font-semibold leading-snug text-ink">{lead.name}</h4>
        <div className="flex shrink-0 flex-col items-end gap-1">
          {added && !Number.isNaN(added.getTime()) && (
            <span className="whitespace-nowrap text-2xs font-medium text-ink-subtle">
              {added.toLocaleDateString('en-US', SHORT_DATE)}
            </span>
          )}
          {(lead.expected_revenue !== undefined || lead.probability !== undefined) && (
            <span className="flex items-center gap-1 whitespace-nowrap text-2xs font-semibold text-emerald-500">
              <Coins size={12} />
              R {(lead.expected_revenue ?? 0).toLocaleString()}
              {lead.probability ? ` (${lead.probability}%)` : ''}
            </span>
          )}
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        {lead.industry && lead.industry.trim() !== '-' && (
          <span className="rounded-md bg-surface-muted px-2 py-0.5 text-[0.625rem] font-bold text-ink-muted">
            {lead.industry}
          </span>
        )}
        {lead.company && (
          <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-[0.625rem] font-bold text-blue-500">
            {lead.company}
          </span>
        )}
        {isClosed && (
          <span
            className={`rounded-md border-[1.5px] px-2 py-0.5 text-[0.625rem] font-bold ${
              lead.status === 'Qualified'
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500'
                : 'border-red-500/30 bg-red-500/10 text-red-500'
            }`}
          >
            {lead.status}
          </span>
        )}
      </div>

      <footer className="mt-1 flex items-center justify-between gap-2">
        <span className="min-w-0 flex-1 truncate text-[0.71875rem] text-ink-muted">{lead.email}</span>

        {assignees.length > 0 ? (
          <span
            title={assignees.map((assignee) => assignee.fullName || assignee.name).join(', ')}
            onClick={canAssign && onAssign ? (event) => (event.stopPropagation(), onAssign(lead)) : undefined}
            className={`flex shrink-0 items-center ${canAssign ? 'cursor-pointer' : ''}`}
          >
            <span className="flex -space-x-1.5">
              {assignees.slice(0, MAX_AVATARS).map((assignee) => (
                <img
                  key={assignee.id}
                  src={assignee.avatar}
                  alt=""
                  className="size-[1.375rem] rounded-full border-[1.5px] border-white object-cover"
                />
              ))}
            </span>
            {assignees.length > MAX_AVATARS && (
              <span className="ml-1 text-[0.625rem] font-semibold text-ink-muted">+{assignees.length - MAX_AVATARS}</span>
            )}
          </span>
        ) : (
          canAssign &&
          onAssign && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onAssign(lead);
              }}
              className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-dashed border-purple-400 bg-purple-100 px-1.5 py-0.5 text-[0.65625rem] font-semibold text-brand"
            >
              <UserPlus size={11} />
              Assign
            </button>
          )
        )}
      </footer>
    </article>
  );
}
