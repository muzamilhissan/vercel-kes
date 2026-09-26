import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_PER_PAGE } from '@/shared/api/crud';
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';
import { useGlobalSearch } from '@/shared/hooks/useGlobalSearch';
import { usePagination } from '@/shared/hooks/usePagination';
import { isSameDay } from '@/shared/lib/format';
import { Button, ConfirmDialog, DateFilter, ErrorState, PageHeader, Pagination } from '@/shared/ui';
import { useAccountOptions } from '@/features/accounts/hooks/useAccountOptions';
import { ContactDetailsModal } from '../components/ContactDetailsModal';
import { ContactFormModal } from '../components/ContactFormModal';
import { ContactTable } from '../components/ContactTable';
import { useContactList, useCreateContact, useDeleteContact, useUpdateContact } from '../hooks/useContacts';
import type { Contact, CreateContactInput } from '../types';

type OpenDialog = 'form' | 'details' | 'delete' | null;

export default function ContactsPage() {
  const navigate = useNavigate();
  const { query } = useGlobalSearch();
  const { page, setPage } = usePagination();
  const search = useDebouncedValue(query);

  const [dialog, setDialog] = useState<OpenDialog>(null);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [filterDate, setFilterDate] = useState('');

  const { data, isPending, isError, error, refetch } = useContactList({ page, search });
  const { accounts } = useAccountOptions();
  const createContact = useCreateContact();
  const updateContact = useUpdateContact();
  const deleteContact = useDeleteContact();

  const accountNames = useMemo(
    () => new Map(accounts.map((account) => [String(account.id), account.name])),
    [accounts],
  );

  /** The list endpoint may embed the account or only its id, so fall back to the lookup. */
  const accountNameOf = (contact: Contact) =>
    contact.account?.name ?? accountNames.get(String(contact.account_id)) ?? 'No Account';

  const contacts = useMemo(() => {
    const items = data?.items ?? [];
    return filterDate ? items.filter((contact) => isSameDay(contact.created_at, filterDate)) : items;
  }, [data?.items, filterDate]);

  const openDialog = (next: OpenDialog, contact: Contact | null) => {
    setSelected(contact);
    setDialog(next);
  };

  const handleSubmit = (input: CreateContactInput) =>
    selected ? updateContact.mutateAsync({ id: selected.id, input }) : createContact.mutateAsync(input);

  const handleDelete = async () => {
    if (!selected) return;
    await deleteContact.mutateAsync(selected.id).then(() => setDialog(null), () => {});
  };

  return (
    <>
      <PageHeader
        title="Contacts"
        subtitle="People you work with across your accounts."
        actions={
          <>
            <DateFilter value={filterDate} onChange={setFilterDate} />
            <Button onClick={() => openDialog('form', null)}>
              <Plus size={16} />
              Add Contact
            </Button>
          </>
        }
      />

      {isError ? (
        <ErrorState message={error.message || 'Failed to fetch contacts.'} onRetry={() => refetch()} />
      ) : (
        <>
          <ContactTable
            contacts={contacts}
            isLoading={isPending}
            accountNameOf={accountNameOf}
            onView={(contact) => openDialog('details', contact)}
            onEdit={(contact) => openDialog('form', contact)}
            onDelete={(contact) => openDialog('delete', contact)}
            onAccountClick={(accountId) => navigate(`/accounts?accountId=${accountId}`)}
          />
          <Pagination
            page={page}
            totalPages={data?.totalPages ?? 1}
            totalItems={data?.totalItems ?? 0}
            perPage={DEFAULT_PER_PAGE}
            onPageChange={setPage}
          />
        </>
      )}

      <ContactFormModal
        open={dialog === 'form'}
        onOpenChange={(open) => !open && setDialog(null)}
        contact={selected}
        onSubmit={handleSubmit}
      />

      <ContactDetailsModal
        open={dialog === 'details'}
        onOpenChange={(open) => !open && setDialog(null)}
        contact={selected}
        accountName={selected ? accountNameOf(selected) : ''}
      />

      <ConfirmDialog
        open={dialog === 'delete'}
        onOpenChange={(open) => !open && setDialog(null)}
        title="Delete Contact"
        destructive
        confirmLabel="Delete"
        isPending={deleteContact.isPending}
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
