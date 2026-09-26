import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, ConfirmDialog, ErrorState, Loader, initialsOf } from '@/shared/ui';
import { SendProposalModal } from '@/features/proposals/components/SendProposalModal';
import { LeadProposalsList } from '@/features/proposals/components/LeadProposalsList';
import { AssignLeadModal } from '../components/dialogs/AssignLeadModal';
import { ContactLeadModal } from '../components/dialogs/ContactLeadModal';
import { LeadActivityTimeline } from '../components/detail/LeadActivityTimeline';
import { LeadContactInfo } from '../components/detail/LeadContactInfo';
import { LeadDetailsCard } from '../components/detail/LeadDetailsCard';
import { LeadDetailsStepper } from '../components/detail/LeadDetailsStepper';
import { LeadDetailsTabs } from '../components/detail/LeadDetailsTabs';
import { LeadEngagementStats } from '../components/detail/LeadEngagementStats';
import { FollowUpsList } from '@/features/follow-ups/components/FollowUpsList';
import { LeadFormModal } from '../components/dialogs/LeadFormModal';
import { LeadQuickActions } from '../components/detail/LeadQuickActions';
import { useLeadTab } from '../hooks/useLeadTab';
import { useSaveLead } from '../hooks/useLeadMutations';
import {
  leadQueries,
  useAssignLead,
  useAssignableUsers,
  useDeleteLead,
  useUpdateLeadStatus,
} from '../hooks/useLeadQueries';
import { useVisibleLeads } from '../hooks/useVisibleLeads';

type OpenDialog = 'edit' | 'delete' | 'assign' | 'contact' | 'proposal' | null;

const NO_FILTERS = { date: '', assignees: [] };

export default function LeadDetailsPage() {
  const { leadId } = useParams<{ leadId: string }>();
  const navigate = useNavigate();
  const { tab, setTab } = useLeadTab();

  const [dialog, setDialog] = useState<OpenDialog>(null);
  const [proposalNumber, setProposalNumber] = useState(1);
  const [isRepropose, setIsRepropose] = useState(false);

  const leadQuery = leadQueries.useItem(leadId);
  const { data: assignableUsers = [] } = useAssignableUsers();
  const { isSuperAdmin } = useVisibleLeads([], NO_FILTERS);

  const { save } = useSaveLead(isSuperAdmin);
  const assignLead = useAssignLead();
  const deleteLead = useDeleteLead();
  const updateStatus = useUpdateLeadStatus();

  if (leadQuery.isPending) return <Loader message="Loading lead details..." />;
  if (leadQuery.isError || !leadQuery.data?.data) {
    return (
      <ErrorState
        message={leadQuery.error?.message || 'This lead could not be loaded.'}
        onRetry={() => leadQuery.refetch()}
      />
    );
  }

  const lead = leadQuery.data.data;

  const openProposal = (repropose: boolean, number: number) => {
    setIsRepropose(repropose);
    setProposalNumber(number);
    setDialog('proposal');
  };

  const handleDelete = async () => {
    await deleteLead.mutateAsync(lead.id).then(() => navigate('/leads'), () => {});
  };

  return (
    <>
      <header className="mb-2.5 flex items-center gap-4">
        <Button variant="secondary" onClick={() => navigate('/leads')}>
          <ArrowLeft size={16} /> Back
        </Button>
        <span aria-hidden className="h-6 w-px bg-line" />
        <span className="grid size-10 shrink-0 place-items-center rounded-lg border-2 border-white bg-linear-135 from-violet-500 to-indigo-500 text-base font-bold text-white shadow-[0_8px_16px_rgb(139_92_246_/_0.25)]">
          {initialsOf(lead.name || 'Lead')}
        </span>
        <div className="min-w-0">
          <h2 className="truncate text-lg font-bold leading-tight text-ink">{lead.name}</h2>
          <p className="truncate text-xs text-ink-muted">{lead.email}</p>
        </div>
      </header>

      <LeadDetailsStepper currentStatus={lead.status} />
      <LeadDetailsTabs active={tab} onChange={setTab} />

      {tab === 'overview' && (
        <div className="grid gap-3 lg:grid-cols-[2fr_1fr]">
          <div className="flex flex-col gap-3">
            <LeadContactInfo lead={lead} />
            <LeadEngagementStats />
            <LeadActivityTimeline lead={lead} />
          </div>
          <div className="flex flex-col gap-3">
            <LeadDetailsCard
              lead={lead}
              canAssign={isSuperAdmin}
              onAssignClick={() => setDialog('assign')}
            />
            <LeadQuickActions
              lead={lead}
              canAssign={isSuperAdmin}
              onContactClick={() => setDialog('contact')}
              onSendProposalClick={() => openProposal(false, 1)}
              onReproposeClick={() => openProposal(true, 2)}
              onEditClick={() => setDialog('edit')}
              onDeleteClick={() => setDialog('delete')}
              onAssignClick={() => setDialog('assign')}
              onStatusUpdate={(status) => updateStatus.mutateAsync({ id: lead.id, status })}
            />
          </div>
        </div>
      )}

      {tab === 'proposals' && (
        <LeadProposalsList
          leadId={lead.id}
          onRepropose={(next) => openProposal(true, next)}
          onSendProposal={() => openProposal(false, 1)}
        />
      )}

      {tab === 'followups' && <FollowUpsList leadId={lead.id} />}

      <ContactLeadModal
        open={dialog === 'contact'}
        onOpenChange={(open) => !open && setDialog(null)}
        lead={lead}
        isPending={updateStatus.isPending}
        onMarkContacted={() => updateStatus.mutateAsync({ id: lead.id, status: 'Contacted' })}
      />

      <SendProposalModal
        open={dialog === 'proposal'}
        onOpenChange={(open) => !open && setDialog(null)}
        lead={lead}
        isRepropose={isRepropose}
        proposalNumber={proposalNumber}
        onSuccess={() => {
          setDialog(null);
          setTab('proposals');
          if (lead.status !== 'Proposed') updateStatus.mutate({ id: lead.id, status: 'Proposed' });
        }}
      />

      <LeadFormModal
        open={dialog === 'edit'}
        onOpenChange={(open) => !open && setDialog(null)}
        lead={lead}
        isSuperAdmin={isSuperAdmin}
        assignableUsers={assignableUsers}
        onSubmit={(values) => save(values, lead)}
      />

      <AssignLeadModal
        open={dialog === 'assign'}
        onOpenChange={(open) => !open && setDialog(null)}
        lead={lead}
        assignableUsers={assignableUsers}
        isPending={assignLead.isPending}
        onAssign={(target, userIds) => assignLead.mutateAsync({ id: target.id, userIds })}
      />

      <ConfirmDialog
        open={dialog === 'delete'}
        onOpenChange={(open) => !open && setDialog(null)}
        title="Delete Lead"
        destructive
        confirmLabel="Delete"
        isPending={deleteLead.isPending}
        onConfirm={handleDelete}
        message={
          <>
            Are you sure you want to delete <strong className="text-ink">{lead.name}</strong>? This action cannot be
            undone.
          </>
        }
      />
    </>
  );
}
