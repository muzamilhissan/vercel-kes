import { useMemo } from 'react';
import type { ComboboxOption } from '@/shared/ui';
import { useAccountList } from './useAccounts';

const ALL_ACCOUNTS_PER_PAGE = 1000;

/**
 * Every account as select options. Contacts and Deals both need the full list
 * rather than the current page, so this asks for a single large page.
 */
export function useAccountOptions() {
  const { data, isPending } = useAccountList({ page: 1, perPage: ALL_ACCOUNTS_PER_PAGE });

  const options = useMemo<ComboboxOption[]>(
    () => (data?.items ?? []).map((account) => ({ value: String(account.id), label: account.name })),
    [data?.items],
  );

  return { options, accounts: data?.items ?? [], isPending };
}
