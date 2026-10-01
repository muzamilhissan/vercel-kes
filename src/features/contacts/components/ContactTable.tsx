import { Edit2, Trash2 } from 'lucide-react';
import { DataTable, IconButton, useSortable, type Column } from '@/shared/ui';
import { capitalize } from '@/shared/lib/text';
import type { Contact } from '../types';

type SortKey = 'name' | 'job_title' | 'company' | 'email' | 'phone';

const ACCESSORS: Record<SortKey, (contact: Contact) => string> = {
  name: (contact) => (contact.name ?? '').toLowerCase(),
  job_title: (contact) => (contact.job_title ?? '').toLowerCase(),
  company: (contact) => (contact.company ?? '').toLowerCase(),
  email: (contact) => (contact.email ?? '').toLowerCase(),
  phone: (contact) => contact.phone ?? '',
};

interface ContactTableProps {
  contacts: Contact[];
  isLoading: boolean;
  accountNameOf: (contact: Contact) => string;
  onView: (contact: Contact) => void;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
  onAccountClick: (accountId: string) => void;
}

export function ContactTable({
  contacts,
  isLoading,
  accountNameOf,
  onView,
  onEdit,
  onDelete,
  onAccountClick,
}: ContactTableProps) {
  const { sorted, sort, toggle } = useSortable<Contact, SortKey>(contacts, ACCESSORS);

  const columns: Column<Contact>[] = [
    {
      id: 'name',
      header: 'Name',
      sortable: true,
      cell: (contact) => <span className="font-semibold">{capitalize(contact.name)}</span>,
    },
    {
      id: 'job_title',
      header: 'Job Title',
      sortable: true,
      className: 'text-ink-muted',
      cell: (contact) => (contact.job_title ? capitalize(contact.job_title) : 'N/A'),
    },
    {
      id: 'company',
      header: 'Company',
      sortable: true,
      className: 'text-ink-muted',
      cell: (contact) => (contact.company ? capitalize(contact.company) : 'N/A'),
    },
    {
      id: 'account',
      header: 'Account',
      cell: (contact) =>
        contact.account_id ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onAccountClick(String(contact.account_id));
            }}
            className="font-semibold text-brand hover:underline"
          >
            {accountNameOf(contact)}
          </button>
        ) : (
          <span className="font-semibold text-ink-muted">{accountNameOf(contact)}</span>
        ),
    },
    { id: 'email', header: 'Email', sortable: true, cell: (contact) => contact.email },
    { id: 'phone', header: 'Phone', sortable: true, cell: (contact) => contact.phone },
    {
      id: 'actions',
      header: 'Actions',
      headerClassName: 'text-center',
      cell: (contact) => (
        <div className="flex justify-center gap-2" onClick={(event) => event.stopPropagation()}>
          <IconButton label="Edit contact" onClick={() => onEdit(contact)}>
            <Edit2 size={16} />
          </IconButton>
          <IconButton label="Delete contact" className="text-red-500" onClick={() => onDelete(contact)}>
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
      rowKey={(contact) => contact.id}
      isLoading={isLoading}
      onRowClick={onView}
      sort={sort}
      onSort={(key) => toggle(key as SortKey)}
      minWidth="56.25rem"
      emptyMessage='No contacts found. Click "Add Contact" to get started!'
    />
  );
}
