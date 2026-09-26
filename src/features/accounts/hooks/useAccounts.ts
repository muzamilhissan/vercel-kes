import { createCrudQueries } from '@/shared/api/createCrudQueries';
import { accountApi } from '../api/accountApi';
import type { Account, CreateAccountInput, UpdateAccountInput } from '../types';

export const accountQueries = createCrudQueries<Account, CreateAccountInput, UpdateAccountInput>(
  'accounts',
  accountApi,
  { singular: 'Account' },
);

export const {
  useList: useAccountList,
  useCreate: useCreateAccount,
  useUpdate: useUpdateAccount,
  useRemove: useDeleteAccount,
} = accountQueries;
