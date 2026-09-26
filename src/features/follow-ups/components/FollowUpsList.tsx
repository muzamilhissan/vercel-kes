import { useState } from 'react';
import { Calendar, Clock, Edit2, Trash2, XCircle } from 'lucide-react';
import {
  Button,
  ConfirmDialog,
  DataTable,
  IconButton,
  Loader,
  Pagination,
  useClientPagination,
  type Column,
} from '@/shared/ui';
import { cn } from '@/shared/lib/cn';
import { todayInputValue } from '@/shared/lib/format';
import { useFollowUps } from '../hooks/useFollowUps';
import { FollowUpFormModal } from './FollowUpFormModal';
import { followUpDate, followUpTime, type LeadFollowUp } from '../types';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Follow-up dates arrive as plain YYYY-MM-DD, so format without a timezone shift. */
function formatFollowUpDate(value: string | undefined): string {
  if (!value) return 'N/A';
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day || month < 1 || month > 12) return value;
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

const isPast = (followUp: LeadFollowUp) => {
  const date = followUpDate(followUp);
  return Boolean(date) && date < todayInputValue();
};
const isCancelled = (followUp: LeadFollowUp) => followUp.status?.toLowerCase() === 'cancelled';

const STATUS_STYLES: Record<string, string> = {
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  scheduled: 'bg-sky-100 text-sky-700',
};

type OpenDialog = 'form' | 'cancel' | 'delete' | null;

export function FollowUpsList({ leadId }: { leadId: string | number }) {
  const { query, save, cancel, remove } = useFollowUps(leadId);
  const [dialog, setDialog] = useState<OpenDialog>(null);
  const [selected, setSelected] = useState<LeadFollowUp | null>(null);

  // The follow-ups endpoint returns every record, so paging happens in memory.
  const { page, setPage, totalPages, totalItems, perPage, pageItems } = useClientPagination(query.data ?? []);

  const openDialog = (next: OpenDialog, followUp: LeadFollowUp | null) => {
    setSelected(followUp);
    setDialog(next);
  };

  const runAndClose = async (action: (followUp: LeadFollowUp) => Promise<unknown>) => {
    if (!selected) return;
    await action(selected);
    setDialog(null);
  };

  const columns: Column<LeadFollowUp>[] = [
    {
      id: 'date',
      header: 'Date',
      cell: (followUp) => (
        <span className="flex items-center gap-2">
          <Calendar size={16} className="text-ink-muted" />
          {formatFollowUpDate(followUpDate(followUp))}
        </span>
      ),
    },
    {
      id: 'time',
      header: 'Time',
      cell: (followUp) => (
        <span className="flex items-center gap-2">
          <Clock size={16} className="text-ink-muted" />
          {followUpTime(followUp) || 'N/A'}
        </span>
      ),
    },
    { id: 'notes', header: 'Notes', className: 'max-w-xs text-ink-muted', cell: (followUp) => followUp.notes || '-' },
    {
      id: 'status',
      header: 'Status',
      cell: (followUp) => {
        const key = (followUp.status || 'scheduled').toLowerCase();
        return (
          <span className={cn('inline-block rounded-[0.625rem] px-3 py-1.5 text-xs font-bold', STATUS_STYLES[key] ?? STATUS_STYLES.scheduled)}>
            {followUp.status || 'Scheduled'}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      cell: (followUp) => {
        const locked = isCancelled(followUp) || isPast(followUp);
        return (
          <div className="flex justify-end gap-2">
            <IconButton
              label={isPast(followUp) ? 'Cannot edit past follow-up' : 'Edit follow-up'}
              disabled={locked}
              onClick={() => openDialog('form', followUp)}
            >
              <Edit2 size={16} />
            </IconButton>
            <IconButton
              label={isPast(followUp) ? 'Cannot cancel past follow-up' : 'Cancel follow-up'}
              disabled={locked}
              onClick={() => openDialog('cancel', followUp)}
            >
              <XCircle size={16} />
            </IconButton>
            <IconButton label="Delete follow-up" className="text-red-500" onClick={() => openDialog('delete', followUp)}>
              <Trash2 size={16} />
            </IconButton>
          </div>
        );
      },
    },
  ];

  if (query.isPending) return <Loader message="Loading follow-ups..." />;

  return (
    <section>
      <header className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-ink">Follow-ups</h3>
        <Button onClick={() => openDialog('form', null)}>+ Add Follow-up</Button>
      </header>

      <DataTable
        columns={columns}
        rows={pageItems}
        rowKey={(followUp) => followUp.id}
        minWidth="43.75rem"
        emptyMessage="No follow-ups found."
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        perPage={perPage}
        onPageChange={setPage}
      />

      <FollowUpFormModal
        open={dialog === 'form'}
        onOpenChange={(open) => !open && setDialog(null)}
        followUp={selected}
        onSubmit={(input) => save.mutateAsync({ id: selected?.id, input })}
      />

      <ConfirmDialog
        open={dialog === 'cancel'}
        onOpenChange={(open) => !open && setDialog(null)}
        title="Cancel Follow-up"
        message="Are you sure you want to cancel this follow-up?"
        confirmLabel="Cancel Follow-up"
        cancelLabel="Keep It"
        isPending={cancel.isPending}
        onConfirm={() => runAndClose(cancel.mutateAsync)}
      />

      <ConfirmDialog
        open={dialog === 'delete'}
        onOpenChange={(open) => !open && setDialog(null)}
        title="Delete Follow-up"
        message="Are you sure you want to delete this follow-up permanently?"
        destructive
        confirmLabel="Delete"
        isPending={remove.isPending}
        onConfirm={() => runAndClose(remove.mutateAsync)}
      />
    </section>
  );
}
