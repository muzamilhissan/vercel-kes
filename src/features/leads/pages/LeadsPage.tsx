import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';
import { useGlobalSearch } from '@/shared/hooks/useGlobalSearch';
import { usePagination } from '@/shared/hooks/usePagination';
import { DEFAULT_PER_PAGE } from '@/shared/api/crud';
import { ConfirmDialog, ErrorState, Loader, Pagination } from '@/shared/ui';
import { AssignLeadModal } from '../components/dialogs/AssignLeadModal';
import { ConvertLeadModal } from '../components/dialogs/ConvertLeadModal';
import { LeadFormModal } from '../components/dialogs/LeadFormModal';
import { LeadKanbanBoard } from '../components/list/LeadKanbanBoard';
import { LeadStatsCards } from '../components/list/LeadStatsCards';
import { LeadTable } from '../components/list/LeadTable';
import { LeadsPageHeader } from '../components/list/LeadsPageHeader';
import { normalizeAssignee, type LeadAssignee } from '../lib/assignees';
import { useLeadViewMode } from '../hooks/useLeadViewMode';
import { useSaveLead } from '../hooks/useLeadMutations';
import {
  useAllLeads,
  useAssignLead,
  useAssignableUsers,
  useConvertLead,
  useDeleteLead,
  useLeadList,
} from '../hooks/useLeadQueries';
import { useVisibleLeads } from '../hooks/useVisibleLeads';
import type { Lead } from '../types';

type OpenDialog = 'form' | 'delete' | 'convert' | 'assign' | null;

export default function LeadsPage() {
  const navigate = useNavigate();
  const { query } = useGlobalSearch();
  const { page, setPage } = usePagination();
  const { viewMode, setViewMode } = useLeadViewMode();
  const search = useDebouncedValue(query);

  const [dialog, setDialog] = useState<OpenDialog>(null);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [filterDate, setFilterDate] = useState('');
  const [filterAssignees, setFilterAssignees] = useState<string[]>([]);

  const pageQuery = useLeadList({ page, search });
  const allQuery = useAllLeads(search);
  const { data: assignableUsers = [] } = useAssignableUsers();

  const filters = useMemo(() => ({ date: filterDate, assignees: filterAssignees }), [filterDate, filterAssignees]);
  const { visible: pagedLeads, isSuperAdmin } = useVisibleLeads(pageQuery.data?.items ?? [], filters);
  const { visible: allLeads } = useVisibleLeads(allQuery.data?.items ?? [], filters);

  // The form owns its own submitting state, so only the save function is needed here.
  const { save } = useSaveLead(isSuperAdmin);
  const assignLead = useAssignLead();
  const convertLead = useConvertLead();
  const deleteLead = useDeleteLead();

  const assignees = useMemo(
    () => assignableUsers.map(normalizeAssignee).filter((user): user is LeadAssignee => user !== null),
    [assignableUsers],
  );

  const openDialog = (next: OpenDialog, lead: Lead | null) => {
    setSelected(lead);
    setDialog(next);
  };

  const handleDelete = async () => {
    if (!selected) return;
    await deleteLead.mutateAsync(selected.id).then(() => setDialog(null), () => {});
  };

  const handleConvert = async () => {
    if (!selected) return;
    await convertLead.mutateAsync({
      id: selected.id,
      input: {
        contact_name: selected.name,
        contact_company: selected.company,
        contact_email: selected.email,
        contact_phone: selected.phone,
      },
    });
    setDialog(null);
  };

  const isLoading = viewMode === 'kanban' ? allQuery.isPending : pageQuery.isPending;
  const activeQuery = viewMode === 'kanban' ? allQuery : pageQuery;

  return (
    <>
      <LeadsPageHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        filterDate={filterDate}
        onFilterDateChange={setFilterDate}
        filterAssignees={filterAssignees}
        onFilterAssigneesChange={setFilterAssignees}
        assignees={assignees}
        onAddLead={() => openDialog('form', null)}
      />

      {activeQuery.isError ? (
        <ErrorState
          message={activeQuery.error.message || 'Failed to fetch leads.'}
          onRetry={() => activeQuery.refetch()}
        />
      ) : isLoading ? (
        <Loader message="Loading sales opportunities..." />
      ) : (
        <>
          <LeadStatsCards
            leads={allLeads}
            totalItems={allQuery.data?.totalItems ?? 0}
            alignToKanban={viewMode === 'kanban'}
          />

          {viewMode === 'kanban' ? (
            <div className="scrollbar-thin flex-1 overflow-x-auto pb-3">
              <LeadKanbanBoard
                leads={allLeads}
                canAssign={isSuperAdmin}
                onView={(lead) => navigate(`/leads/${lead.id}`)}
                onAssign={isSuperAdmin ? (lead) => openDialog('assign', lead) : undefined}
              />
            </div>
          ) : (
            <>
              <LeadTable
                leads={pagedLeads}
                isLoading={pageQuery.isPending}
                isSuperAdmin={isSuperAdmin}
                onView={(lead) => navigate(`/leads/${lead.id}`)}
                onEdit={(lead) => openDialog('form', lead)}
                onDelete={(lead) => openDialog('delete', lead)}
                onConvert={(lead) => openDialog('convert', lead)}
                onAssign={isSuperAdmin ? (lead) => openDialog('assign', lead) : undefined}
              />
              <Pagination
                page={page}
                totalPages={pageQuery.data?.totalPages ?? 1}
                totalItems={pageQuery.data?.totalItems ?? 0}
                perPage={DEFAULT_PER_PAGE}
                onPageChange={setPage}
              />
            </>
          )}
        </>
      )}

      <LeadFormModal
        open={dialog === 'form'}
        onOpenChange={(open) => !open && setDialog(null)}
        lead={selected}
        isSuperAdmin={isSuperAdmin}
        assignableUsers={assignableUsers}
        onSubmit={(values) => save(values, selected)}
      />

      <AssignLeadModal
        open={dialog === 'assign'}
        onOpenChange={(open) => !open && setDialog(null)}
        lead={selected}
        assignableUsers={assignableUsers}
        isPending={assignLead.isPending}
        onAssign={(lead, userIds) => assignLead.mutateAsync({ id: lead.id, userIds })}
      />

      <ConvertLeadModal
        open={dialog === 'convert'}
        onOpenChange={(open) => !open && setDialog(null)}
        leadName={selected?.name ?? ''}
        isPending={convertLead.isPending}
        onConfirm={handleConvert}
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
            Are you sure you want to delete <strong className="text-ink">{selected?.name}</strong>? This action cannot
            be undone.
          </>
        }
      />
    </>
  );
}
