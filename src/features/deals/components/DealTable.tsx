import { Edit2, Trash2, Upload } from 'lucide-react';
import { Badge, DataTable, IconButton, useSortable, type Column } from '@/shared/ui';
import { formatCurrency, formatDate } from '@/shared/lib/format';
import { stageTone } from '../constants';
import type { Deal } from '../types';

type SortKey = 'name' | 'account' | 'value';

interface DealTableProps {
  deals: Deal[];
  isLoading: boolean;
  accountNameOf: (deal: Deal) => string;
  onView: (deal: Deal) => void;
  onEdit: (deal: Deal) => void;
  onDelete: (deal: Deal) => void;
  onFiles: (deal: Deal) => void;
  onAccountClick: (accountId: string) => void;
}

export function DealTable({
  deals,
  isLoading,
  accountNameOf,
  onView,
  onEdit,
  onDelete,
  onFiles,
  onAccountClick,
}: DealTableProps) {
  const { sorted, sort, toggle } = useSortable<Deal, SortKey>(deals, {
    name: (deal) => (deal.name ?? '').toLowerCase(),
    account: (deal) => accountNameOf(deal).toLowerCase(),
    // Pad so numeric values still order correctly through a string comparison.
    value: (deal) => String(deal.value ?? 0).padStart(16, '0'),
  });

  const columns: Column<Deal>[] = [
    { id: 'name', header: 'Deal Name', sortable: true, cell: (deal) => <span className="font-semibold">{deal.name}</span> },
    {
      id: 'account',
      header: 'Account',
      sortable: true,
      cell: (deal) =>
        deal.account_id ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onAccountClick(String(deal.account_id));
            }}
            className="font-semibold text-brand hover:underline"
          >
            {accountNameOf(deal)}
          </button>
        ) : (
          <span className="text-ink-muted">{accountNameOf(deal)}</span>
        ),
    },
    {
      id: 'value',
      header: 'Value',
      sortable: true,
      className: 'font-semibold',
      cell: (deal) => formatCurrency(deal.value),
    },
    { id: 'close_date', header: 'Close Date', className: 'text-ink-muted', cell: (deal) => formatDate(deal.close_date) },
    { id: 'stage', header: 'Stage', cell: (deal) => <Badge tone={stageTone(deal.stage)}>{deal.stage}</Badge> },
    {
      id: 'actions',
      header: 'Actions',
      headerClassName: 'text-center',
      cell: (deal) => (
        <div className="flex justify-center gap-2" onClick={(event) => event.stopPropagation()}>
          <IconButton label="Upload attachments" className="text-brand" onClick={() => onFiles(deal)}>
            <Upload size={16} />
          </IconButton>
          <IconButton label="Edit deal" onClick={() => onEdit(deal)}>
            <Edit2 size={16} />
          </IconButton>
          <IconButton label="Delete deal" className="text-red-500" onClick={() => onDelete(deal)}>
            <Trash2 size={16} />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={sorted}
      rowKey={(deal) => deal.id}
      isLoading={isLoading}
      onRowClick={onView}
      sort={sort}
      onSort={(key) => toggle(key as SortKey)}
      minWidth="56.25rem"
      emptyMessage='No deals found. Click "Add Deal" to get started!'
    />
  );
}
