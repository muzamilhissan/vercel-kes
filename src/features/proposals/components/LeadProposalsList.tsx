import { useMemo, useState } from 'react';
import { FileText, RotateCcw, Sparkles } from 'lucide-react';
import { Button, ConfirmDialog, Loader, Pagination, useClientPagination } from '@/shared/ui';
import { useProposals } from '../hooks/useProposals';
import { numberProposals, type NumberedProposal } from '../lib/attachmentUrl';
import { EditProposalModal } from './EditProposalModal';
import { ProposalCard } from './ProposalCard';
import { ViewProposalModal } from './ViewProposalModal';
import type { Proposal } from '../types';

type NumberedProposalItem = Proposal & NumberedProposal;
type OpenDialog = 'view' | 'edit' | 'delete' | null;

interface LeadProposalsListProps {
  leadId: string | number;
  onRepropose: (nextProposalNumber: number) => void;
  onSendProposal: () => void;
}

export function LeadProposalsList({ leadId, onRepropose, onSendProposal }: LeadProposalsListProps) {
  const { query, remove } = useProposals(leadId);
  const [dialog, setDialog] = useState<OpenDialog>(null);
  const [selected, setSelected] = useState<NumberedProposalItem | null>(null);

  const proposals = useMemo(() => numberProposals(query.data ?? []), [query.data]);
  const nextNumber = proposals.length + 1;

  // Proposals come back unpaginated, so page them in memory.
  const { page, setPage, totalPages, totalItems, perPage, pageItems } = useClientPagination(proposals);

  const openDialog = (next: OpenDialog, proposal: NumberedProposalItem) => {
    setSelected(proposal);
    setDialog(next);
  };

  const confirmDelete = async () => {
    if (!selected) return;
    await remove.mutateAsync(selected.id);
    setDialog(null);
  };

  if (query.isPending) return <Loader message="Loading proposals..." />;

  if (proposals.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line py-20 text-center">
        <span className="grid size-20 place-items-center rounded-full bg-brand-50 text-brand">
          <FileText size={44} />
        </span>
        <h3 className="text-lg font-bold text-ink">No proposals found</h3>
        <p className="text-sm text-ink-muted">This lead currently doesn't have any associated proposals.</p>
        <Button onClick={onSendProposal}>
          <Sparkles size={16} />
          Draft First Proposal
        </Button>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-ink">Proposals</h3>
            <span className="rounded-full bg-field px-2.5 py-0.5 text-xs font-bold text-slate-600">
              {proposals.length}
            </span>
          </div>
          <p className="mt-1 text-sm text-ink-muted">
            Review past proposal submissions or generate a second/revised proposal with AI.
          </p>
        </div>

        <Button onClick={() => onRepropose(nextNumber)} title={`Generate Proposal #${nextNumber} with AI`}>
          <RotateCcw size={15} />
          Re-propose
          <span className="rounded-md bg-white/20 px-2 py-0.5 text-2xs">Proposal #{nextNumber}</span>
        </Button>
      </header>

      <div className="flex flex-col gap-3">
        {pageItems.map((proposal) => (
          <ProposalCard
            key={proposal.id}
            proposal={proposal}
            onView={() => openDialog('view', proposal)}
            onEdit={() => openDialog('edit', proposal)}
            onDelete={() => openDialog('delete', proposal)}
          />
        ))}
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        perPage={perPage}
        onPageChange={setPage}
      />

      <ViewProposalModal
        open={dialog === 'view'}
        onOpenChange={(open) => !open && setDialog(null)}
        proposal={selected}
        onRepropose={() => {
          setDialog(null);
          onRepropose(nextNumber);
        }}
      />

      <EditProposalModal
        open={dialog === 'edit'}
        onOpenChange={(open) => !open && setDialog(null)}
        proposal={selected}
        leadId={leadId}
        onSuccess={() => setDialog(null)}
      />

      <ConfirmDialog
        open={dialog === 'delete'}
        onOpenChange={(open) => !open && setDialog(null)}
        title="Delete Proposal"
        destructive
        confirmLabel="Delete"
        isPending={remove.isPending}
        onConfirm={confirmDelete}
        message={
          <>
            Are you sure you want to delete the proposal{' '}
            <strong className="text-ink">&ldquo;{selected?.subject}&rdquo;</strong>?
          </>
        }
      />
    </section>
  );
}
