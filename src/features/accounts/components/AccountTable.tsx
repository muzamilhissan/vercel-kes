import { Edit2, Trash2 } from 'lucide-react';
import { DataTable, IconButton, useSortable, type Column } from '@/shared/ui';
import { capitalize, displayUrl, toAbsoluteUrl } from '@/shared/lib/text';
import type { Account } from '../types';

type SortKey = 'name' | 'industry' | 'website';

const ACCESSORS: Record<SortKey, (account: Account) => string> = {
  name: (account) => (account.name ?? '').toLowerCase(),
  industry: (account) => (account.industry ?? '').toLowerCase(),
  website: (account) => (account.website ?? '').toLowerCase(),
};

interface AccountTableProps {
  accounts: Account[];
  isLoading: boolean;
  onView: (account: Account) => void;
  onEdit: (account: Account) => void;
  onDelete: (account: Account) => void;
}

export function AccountTable({ accounts, isLoading, onView, onEdit, onDelete }: AccountTableProps) {
  const { sorted, sort, toggle } = useSortable<Account, SortKey>(accounts, ACCESSORS);

  const columns: Column<Account>[] = [
    {
      id: 'name',
      header: 'Company Name',
      sortable: true,
      cell: (account) => <span className="font-semibold">{capitalize(account.name)}</span>,
    },
    {
      id: 'industry',
      header: 'Industry',
      sortable: true,
      className: 'text-ink-muted',
      cell: (account) => capitalize(account.industry),
    },
    {
      id: 'website',
      header: 'Website',
      sortable: true,
      cell: (account) =>
        account.website ? (
          <a
            href={toAbsoluteUrl(account.website)}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="font-semibold text-brand hover:underline"
          >
            {displayUrl(account.website)}
          </a>
        ) : (
          <span className="text-ink-subtle">-</span>
        ),
    },
    {
      id: 'actions',
      header: 'Actions',
      headerClassName: 'text-center',
      cell: (account) => (
        <div className="flex justify-center gap-2" onClick={(event) => event.stopPropagation()}>
          <IconButton label="Edit account" onClick={() => onEdit(account)}>
            <Edit2 size={16} />
          </IconButton>
          <IconButton label="Delete account" className="text-red-500" onClick={() => onDelete(account)}>
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
      rowKey={(account) => account.id}
      isLoading={isLoading}
      onRowClick={onView}
      sort={sort}
      onSort={(key) => toggle(key as SortKey)}
      emptyMessage='No accounts found. Click "Add Account" to get started!'
    />
  );
}
