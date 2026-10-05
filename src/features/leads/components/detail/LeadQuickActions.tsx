import { useState } from 'react';
import { Check, Edit, FileSpreadsheet, Loader2, Phone, RotateCcw, Send, Trash2, UserPlus, XOctagon, Zap } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { DetailCard } from './DetailCard';
import type { Lead } from '../../types';

/** Statuses past the point where a lead can still be contacted for the first time. */
const CONTACTED_OR_LATER = ['Proposed', 'Qualified', 'Disqualified', 'Converted'];
const CLOSED = ['Qualified', 'Disqualified', 'Converted'];
const QUOTE_READY = ['Converted'];

/** The one status a lead can advance to from where it is now. */
const NEXT_STATUS: Record<string, string | undefined> = {
  New: 'Contacted',
  Contacted: 'Proposed',
  Proposed: 'Qualified',
};

const BASE =
  'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50';
const PRIMARY =
  'bg-linear-135 from-[#1e3a5f] to-slate-900 text-white shadow-[0_4px_12px_rgb(15_23_42_/_0.15)] hover:-translate-y-px hover:shadow-[0_6px_16px_rgb(15_23_42_/_0.25)]';
const OUTLINE = 'border border-line bg-surface text-slate-700 hover:border-slate-300 hover:bg-surface-muted hover:text-slate-900';
const DANGER_OUTLINE = 'border border-red-200 bg-red-50 text-red-500 hover:border-red-300 hover:bg-red-100 hover:text-red-600';

interface LeadQuickActionsProps {
  lead: Lead;
  canAssign: boolean;
  onContactClick: () => void;
  onSendProposalClick: () => void;
  onReproposeClick: () => void;
  onCreateQuoteClick: () => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
  onAssignClick?: () => void;
  onStatusUpdate: (status: string) => Promise<unknown>;
}

export function LeadQuickActions({
  lead,
  canAssign,
  onContactClick,
  onSendProposalClick,
  onReproposeClick,
  onCreateQuoteClick,
  onEditClick,
  onDeleteClick,
  onAssignClick,
  onStatusUpdate,
}: LeadQuickActionsProps) {
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const status = lead.status ?? 'New';

  const changeStatus = async (next: string) => {
    if (pendingStatus) return;
    setPendingStatus(next);
    try {
      await onStatusUpdate(next);
    } finally {
      setPendingStatus(null);
    }
  };

  const advanceTo = NEXT_STATUS[status];
  const alreadyContacted = CONTACTED_OR_LATER.includes(status);
  const isClosed = CLOSED.includes(status);

  const StatusIcon = ({ target }: { target: string }) =>
    pendingStatus === target ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />;

  return (
    <DetailCard icon={Zap} title="Quick Actions">
      <div className="flex flex-col gap-3">
        {QUOTE_READY.includes(status) ? (
          <button type="button" className={cn(BASE, PRIMARY)} onClick={onCreateQuoteClick}>
            <FileSpreadsheet size={16} /> Create Quote
          </button>
        ) : status === 'Proposed' ? (
          <button type="button" className={cn(BASE, PRIMARY)} onClick={onReproposeClick}>
            <RotateCcw size={16} /> Re-propose
          </button>
        ) : status === 'Contacted' ? (
          <button type="button" className={cn(BASE, PRIMARY)} onClick={onSendProposalClick}>
            <Send size={16} /> Send Proposal
          </button>
        ) : (
          <button
            type="button"
            className={cn(BASE, PRIMARY)}
            disabled={alreadyContacted}
            title={alreadyContacted ? 'Lead is already contacted' : undefined}
            onClick={onContactClick}
          >
            <Phone size={16} /> {alreadyContacted ? 'Lead Contacted' : 'Contact Lead'}
          </button>
        )}

        {canAssign && onAssignClick && (
          <button
            type="button"
            className={cn(BASE, 'border border-purple-300 bg-purple-50 text-brand hover:bg-purple-100')}
            onClick={onAssignClick}
          >
            <UserPlus size={16} /> Assign / Reassign
          </button>
        )}

        {advanceTo ? (
          <button
            type="button"
            className={cn(BASE, OUTLINE)}
            disabled={Boolean(pendingStatus)}
            onClick={() => changeStatus(advanceTo)}
          >
            <StatusIcon target={advanceTo} /> Mark as {advanceTo}
          </button>
        ) : (
          <button type="button" className={cn(BASE, OUTLINE)} disabled>
            <Check size={16} /> Closed Lead
          </button>
        )}

        <button type="button" className={cn(BASE, OUTLINE)} onClick={onEditClick}>
          <Edit size={16} /> Edit Lead
        </button>

        {isClosed ? (
          <button type="button" className={cn(BASE, DANGER_OUTLINE)} disabled>
            <XOctagon size={16} /> {status === 'Disqualified' ? 'Lead is Disqualified' : 'Lead is Closed'}
          </button>
        ) : (
          <button
            type="button"
            className={cn(BASE, DANGER_OUTLINE)}
            disabled={Boolean(pendingStatus)}
            onClick={() => changeStatus('Disqualified')}
          >
            {pendingStatus === 'Disqualified' ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <XOctagon size={16} />
            )}{' '}
            Mark as Disqualified
          </button>
        )}

        <hr className="my-2 border-line" />

        <button
          type="button"
          className={cn(BASE, 'justify-center bg-transparent text-red-500 hover:bg-red-50')}
          onClick={onDeleteClick}
        >
          <Trash2 size={16} /> Delete this lead
        </button>
      </div>
    </DetailCard>
  );
}
