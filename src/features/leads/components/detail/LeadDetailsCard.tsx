import { Info, UserPlus } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { assigneesOf } from '../../lib/assignees';
import { DetailCard, InfoRow } from './DetailCard';
import type { Lead } from '../../types';

const randValue = (value: number | undefined) =>
  value === undefined || Number.isNaN(Number(value)) ? 'R 0' : `R ${Number(value).toLocaleString()}`;

const percent = (value: number | undefined) =>
  value === undefined || Number.isNaN(Number(value)) ? '0%' : `${Number(value)}%`;

interface LeadDetailsCardProps {
  lead: Lead;
  canAssign: boolean;
  onAssignClick?: () => void;
}

export function LeadDetailsCard({ lead, canAssign, onAssignClick }: LeadDetailsCardProps) {
  const assignees = assigneesOf(lead);
  const showAssignControl = canAssign && onAssignClick;

  return (
    <DetailCard icon={Info} title="Lead Details" highlighted>
      <InfoRow label="Stage:">
        <span
          className={cn(
            lead.status === 'Disqualified' && 'font-semibold text-red-500',
            lead.status === 'Qualified' && 'font-semibold text-green-500',
          )}
        >
          {lead.status}
        </span>
      </InfoRow>
      <InfoRow label="Expected Revenue:">{randValue(lead.expected_revenue)}</InfoRow>
      <InfoRow label="Probability:">{percent(lead.probability)}</InfoRow>

      <InfoRow label="Assigned To:">
        {assignees.length > 0 ? (
          <span className="flex flex-col items-end gap-1.5">
            {assignees.map((assignee) => (
              <span key={assignee.id} className="flex items-center gap-1.5">
                <img src={assignee.avatar} alt="" className="size-5 rounded-full object-cover" />
                <span className="text-label font-semibold text-ink">{assignee.fullName || assignee.name}</span>
              </span>
            ))}
            {showAssignControl && (
              <button
                type="button"
                onClick={onAssignClick}
                className="text-[0.71875rem] font-semibold text-brand underline"
              >
                Reassign
              </button>
            )}
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <span className="text-label italic text-ink-subtle">Unassigned</span>
            {showAssignControl && (
              <button
                type="button"
                onClick={onAssignClick}
                className="flex items-center gap-1 rounded-md border border-purple-300 bg-purple-100 px-2 py-0.5 text-2xs font-semibold text-brand"
              >
                <UserPlus size={12} />
                Assign
              </button>
            )}
          </span>
        )}
      </InfoRow>

      <div className="mt-2 flex flex-col gap-1 border-t border-field pt-2 text-label">
        <span className="font-medium text-ink-muted">Notes:</span>
        <p className="whitespace-pre-wrap leading-relaxed text-slate-600">{lead.notes || 'No notes added'}</p>
      </div>
    </DetailCard>
  );
}
