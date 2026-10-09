import { Calendar, Download, ExternalLink, Eye, FileText, Paperclip, RotateCcw } from 'lucide-react';
import { Button, IconButton, Modal } from '@/shared/ui';
import { formatFileSize } from '@/shared/lib/file';
import { formatDate } from '@/shared/lib/format';
import { attachmentUrl } from '../lib/attachmentUrl';
import type { Proposal } from '../types';

interface ViewProposalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proposal: (Proposal & { proposalNumber?: number }) | null;
  onRepropose?: () => void;
}

export function ViewProposalModal({ open, onOpenChange, proposal, onRepropose }: ViewProposalModalProps) {
  if (!proposal) return null;

  const attachments = proposal.attachments ?? [];

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="View Proposal"
      description={proposal.proposalNumber ? `Proposal #${proposal.proposalNumber}` : undefined}
      size="lg"
      footer={
        onRepropose && (
          <Button variant="secondary" onClick={onRepropose}>
            <RotateCcw size={14} />
            Re-propose
          </Button>
        )
      }
    >
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-field pb-4">
        <h3 className="text-lg font-bold text-ink">{proposal.email_subject || 'Untitled proposal'}</h3>
        <span className="flex items-center gap-1.5 text-label text-ink-muted">
          <Calendar size={14} />
          {formatDate(proposal.created_at)}
        </span>
      </header>

      <div className="flex flex-col gap-3 text-sm leading-relaxed text-slate-700">
        {(proposal.email_body ?? '').split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      {proposal.proposal_download_url && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface-muted p-4">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-brand-50 text-brand">
              <FileText size={20} />
            </span>
            <div>
              <p className="text-sm font-bold text-ink">Generated Proposal Document (PDF)</p>
              <p className="text-xs text-ink-muted">Automated proposal synthesized from requirements</p>
            </div>
          </div>
          <a
            href={proposal.proposal_download_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
          >
            <ExternalLink size={14} /> View / Download PDF
          </a>
        </div>
      )}

      {attachments.length > 0 && (
        <section className="border-t border-field pt-4">
          <h4 className="mb-3 text-label font-bold uppercase tracking-wide text-ink-muted">
            Attachments ({attachments.length})
          </h4>
          <ul className="flex flex-col gap-2">
            {attachments.map((attachment) => {
              const url = attachmentUrl(attachment);
              return (
                <li
                  key={attachment.id}
                  className="flex items-center gap-3 rounded-xl border border-line bg-surface-muted px-3 py-2.5"
                >
                  <Paperclip size={16} className="shrink-0 text-ink-muted" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-label font-semibold text-ink">{attachment.file_name}</span>
                    {attachment.file_size && (
                      <span className="block text-2xs text-ink-muted">{formatFileSize(attachment.file_size)}</span>
                    )}
                  </span>
                  {url && (
                    <span className="flex shrink-0 gap-2">
                      <IconButton asChild label="View attachment">
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          <Eye size={16} />
                        </a>
                      </IconButton>
                      <IconButton asChild label="Download attachment">
                        <a href={url} download={attachment.file_name}>
                          <Download size={16} />
                        </a>
                      </IconButton>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </Modal>
  );
}
