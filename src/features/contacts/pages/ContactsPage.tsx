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
import { useConvertedLeads } from '@/features/leads/hooks/useLeadQueries';
import type { Lead } from '@/features/leads/types';
import { ContactsViewTabs, type ContactView } from '../components/ContactsViewTabs';
import { ConvertedLeadDetailsModal } from '../components/ConvertedLeadDetailsModal';
import { ConvertedLeadTable } from '../components/ConvertedLeadTable';
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
  const [view, setView] = useState<ContactView>('converted');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const convertedQuery = useConvertedLeads({ page });

  const convertedLeads = useMemo(() => {
    const items = convertedQuery.data?.items ?? [];
    const needle = search.trim().toLowerCase();
    const matched = needle
      ? items.filter((lead) =>
          [lead.name, lead.company, lead.email, lead.industry]
            .some((value) => (value ?? '').toLowerCase().includes(needle)),
        )
      : items;
    return filterDate ? matched.filter((lead) => isSameDay(lead.converted_at, filterDate)) : matched;
  }, [convertedQuery.data?.items, search, filterDate]);

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
        subtitle="Converted clients and the people you work with across your accounts."
        actions={
          <>
            <DateFilter value={filterDate} onChange={setFilterDate} />
            {view === 'contacts' && (
              <Button onClick={() => openDialog('form', null)}>
                <Plus size={16} />
                Add Contact
              </Button>
            )}
          </>
        }
      />

      <ContactsViewTabs
        active={view}
        onChange={(next) => {
          setView(next);
          setPage(1);
        }}
      />

      {view === 'converted' ? (
        convertedQuery.isError ? (
          <ErrorState
            message={convertedQuery.error.message || 'Failed to fetch converted leads.'}
            onRetry={() => convertedQuery.refetch()}
          />
        ) : (
          <>
            <ConvertedLeadTable
              leads={convertedLeads}
              isLoading={convertedQuery.isPending}
              onView={setSelectedLead}
            />
            <Pagination
              page={page}
              totalPages={convertedQuery.data?.totalPages ?? 1}
              totalItems={convertedQuery.data?.totalItems ?? 0}
              perPage={convertedQuery.data?.perPage ?? DEFAULT_PER_PAGE}
              onPageChange={setPage}
            />
          </>
        )
      ) : isError ? (
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

      <ConvertedLeadDetailsModal
        open={Boolean(selectedLead)}
        onOpenChange={(open) => !open && setSelectedLead(null)}
        lead={selectedLead}
      />

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
