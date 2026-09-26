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
import { DealAttachmentsModal } from '../components/DealAttachmentsModal';
import { DealDetailsModal } from '../components/DealDetailsModal';
import { DealFormModal } from '../components/DealFormModal';
import { DealTable } from '../components/DealTable';
import { useCreateDeal, useDealList, useDeleteDeal, useUpdateDeal } from '../hooks/useDeals';
import type { CreateDealInput, Deal } from '../types';

type OpenDialog = 'form' | 'details' | 'delete' | 'files' | null;

export default function DealsPage() {
  const navigate = useNavigate();
  const { query } = useGlobalSearch();
  const { page, setPage } = usePagination();
  const search = useDebouncedValue(query);

  const [dialog, setDialog] = useState<OpenDialog>(null);
  const [selected, setSelected] = useState<Deal | null>(null);
  const [filterDate, setFilterDate] = useState('');

  const { data, isPending, isError, error, refetch } = useDealList({ page, search });
  const { accounts } = useAccountOptions();
  const createDeal = useCreateDeal();
  const updateDeal = useUpdateDeal();
  const deleteDeal = useDeleteDeal();

  const accountNames = useMemo(
    () => new Map(accounts.map((account) => [String(account.id), account.name])),
    [accounts],
  );
  const accountNameOf = (deal: Deal) => accountNames.get(String(deal.account_id)) ?? 'No account linked';

  const deals = useMemo(() => {
    const items = data?.items ?? [];
    return filterDate ? items.filter((deal) => isSameDay(deal.created_at, filterDate)) : items;
  }, [data?.items, filterDate]);

  const openDialog = (next: OpenDialog, deal: Deal | null) => {
    setSelected(deal);
    setDialog(next);
  };

  const handleSubmit = (input: CreateDealInput) =>
    selected ? updateDeal.mutateAsync({ id: selected.id, input }) : createDeal.mutateAsync(input);

  const handleDelete = async () => {
    if (!selected) return;
    await deleteDeal.mutateAsync(selected.id).then(() => setDialog(null), () => {});
  };

  const goToAccount = (accountId: string) => navigate(`/accounts?accountId=${accountId}`);

  return (
    <>
      <PageHeader
        title="Deals"
        subtitle="Track opportunities from first conversation through to close."
        actions={
          <>
            <DateFilter value={filterDate} onChange={setFilterDate} />
            <Button onClick={() => openDialog('form', null)}>
              <Plus size={16} />
              Add Deal
            </Button>
          </>
        }
      />

      {isError ? (
        <ErrorState message={error.message || 'Failed to fetch deals.'} onRetry={() => refetch()} />
      ) : (
        <>
          <DealTable
            deals={deals}
            isLoading={isPending}
            accountNameOf={accountNameOf}
            onView={(deal) => openDialog('details', deal)}
            onEdit={(deal) => openDialog('form', deal)}
            onDelete={(deal) => openDialog('delete', deal)}
            onFiles={(deal) => openDialog('files', deal)}
            onAccountClick={goToAccount}
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

      <DealFormModal
        open={dialog === 'form'}
        onOpenChange={(open) => !open && setDialog(null)}
        deal={selected}
        onSubmit={handleSubmit}
      />

      <DealDetailsModal
        open={dialog === 'details'}
        onOpenChange={(open) => !open && setDialog(null)}
        deal={selected}
        accountName={selected ? accountNameOf(selected) : ''}
        onAccountClick={goToAccount}
      />

      <DealAttachmentsModal
        open={dialog === 'files'}
        onOpenChange={(open) => !open && setDialog(null)}
        deal={selected}
      />

      <ConfirmDialog
        open={dialog === 'delete'}
        onOpenChange={(open) => !open && setDialog(null)}
        title="Delete Deal"
        destructive
        confirmLabel="Delete"
        isPending={deleteDeal.isPending}
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
