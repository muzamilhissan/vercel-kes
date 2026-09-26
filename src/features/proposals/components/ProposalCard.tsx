import { Edit2, Eye, Trash2 } from 'lucide-react';
import { IconButton } from '@/shared/ui';
import { formatDate } from '@/shared/lib/format';
import type { NumberedProposal } from '../lib/attachmentUrl';
import type { Proposal } from '../types';

const PREVIEW_LENGTH = 150;

interface ProposalCardProps {
  proposal: Proposal & NumberedProposal;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ProposalCard({ proposal, onView, onEdit, onDelete }: ProposalCardProps) {
  const preview =
    proposal.content && proposal.content.length > PREVIEW_LENGTH
      ? `${proposal.content.slice(0, PREVIEW_LENGTH)}...`
      : proposal.content || '';

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5 transition-shadow hover:shadow-panel">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-brand-50 px-2 py-0.5 text-2xs font-bold text-brand">
              Proposal #{proposal.proposalNumber}
            </span>
            {proposal.isLatest && (
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-2xs font-bold text-emerald-700">
                Latest
              </span>
            )}
          </div>
          <h4 className="truncate text-base font-bold text-ink">{proposal.subject}</h4>
        </div>

        <div className="flex shrink-0 gap-2">
          <IconButton label="View proposal" onClick={onView}>
            <Eye size={16} />
          </IconButton>
          <IconButton label="Edit proposal" onClick={onEdit}>
            <Edit2 size={16} />
          </IconButton>
          <IconButton label="Delete proposal" className="text-red-500" onClick={onDelete}>
            <Trash2 size={16} />
          </IconButton>
        </div>
      </header>

      <p className="text-label leading-relaxed text-ink-muted">{preview}</p>

      <footer className="flex flex-wrap gap-6 border-t border-field pt-3 text-xs">
        <span className="text-ink-muted">
          Created: <strong className="font-semibold text-ink">{formatDate(proposal.created_at)}</strong>
        </span>
        <span className="text-ink-muted">
          Attachments: <strong className="font-semibold text-ink">{proposal.attachments?.length ?? 0}</strong>
        </span>
      </footer>
    </article>
  );
}
