import { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { DEFAULT_PER_PAGE } from '@/shared/api/crud';
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';
import { useGlobalSearch } from '@/shared/hooks/useGlobalSearch';
import { usePagination } from '@/shared/hooks/usePagination';
import { isSameDay } from '@/shared/lib/format';
import { Button, ConfirmDialog, DateFilter, ErrorState, PageHeader, Pagination } from '@/shared/ui';
import { AccountDetailsModal } from '../components/AccountDetailsModal';
import { AccountFormModal } from '../components/AccountFormModal';
import { AccountTable } from '../components/AccountTable';
import { useAccountList, useCreateAccount, useDeleteAccount, useUpdateAccount } from '../hooks/useAccounts';
import type { Account, CreateAccountInput } from '../types';

type OpenDialog = 'form' | 'details' | 'delete' | null;

export default function AccountsPage() {
  const { query } = useGlobalSearch();
  const { page, setPage } = usePagination();
  const search = useDebouncedValue(query);

  const [dialog, setDialog] = useState<OpenDialog>(null);
  const [selected, setSelected] = useState<Account | null>(null);
  const [filterDate, setFilterDate] = useState('');

  const [searchParams, setSearchParams] = useSearchParams();

  const { data, isPending, isError, error, refetch } = useAccountList({ page, search });
  const createAccount = useCreateAccount();
  const updateAccount = useUpdateAccount();
  const deleteAccount = useDeleteAccount();

  const accounts = useMemo(() => {
    const items = data?.items ?? [];
    return filterDate ? items.filter((account) => isSameDay(account.created_at, filterDate)) : items;
  }, [data?.items, filterDate]);

  // Contacts link here as /accounts?accountId=123 to open that account's details.
  const requestedId = searchParams.get('accountId');
  useEffect(() => {
    if (!requestedId) return;
    const match = (data?.items ?? []).find((account) => String(account.id) === requestedId);
    if (!match) return;

    setSelected(match);
    setDialog('details');
    setSearchParams(
      (params) => {
        params.delete('accountId');
        return params;
      },
      { replace: true },
    );
  }, [requestedId, data?.items, setSearchParams]);

  const openDialog = (next: OpenDialog, account: Account | null) => {
    setSelected(account);
    setDialog(next);
  };

  const handleSubmit = (input: CreateAccountInput) =>
    selected ? updateAccount.mutateAsync({ id: selected.id, input }) : createAccount.mutateAsync(input);

  const handleDelete = async () => {
    if (!selected) return;
    await deleteAccount.mutateAsync(selected.id).then(() => setDialog(null), () => {});
  };

  return (
    <>
      <PageHeader
        title="Accounts"
        subtitle="Manage company records and their related contacts and deals."
        actions={
          <>
            <DateFilter value={filterDate} onChange={setFilterDate} />
            <Button onClick={() => openDialog('form', null)}>
              <Plus size={16} />
              Add Account
            </Button>
          </>
        }
      />

      {isError ? (
        <ErrorState message={error.message || 'Failed to fetch accounts.'} onRetry={() => refetch()} />
      ) : (
        <>
          <AccountTable
            accounts={accounts}
            isLoading={isPending}
            onView={(account) => openDialog('details', account)}
            onEdit={(account) => openDialog('form', account)}
            onDelete={(account) => openDialog('delete', account)}
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

      <AccountFormModal
        open={dialog === 'form'}
        onOpenChange={(open) => !open && setDialog(null)}
        account={selected}
        onSubmit={handleSubmit}
      />

      <AccountDetailsModal
        open={dialog === 'details'}
        onOpenChange={(open) => !open && setDialog(null)}
        account={selected}
      />

      <ConfirmDialog
        open={dialog === 'delete'}
        onOpenChange={(open) => !open && setDialog(null)}
        title="Delete Account"
        destructive
        confirmLabel="Delete"
        isPending={deleteAccount.isPending}
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
