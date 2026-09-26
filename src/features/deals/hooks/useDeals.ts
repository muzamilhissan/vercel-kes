import { createCrudQueries } from '@/shared/api/createCrudQueries';
import { dealApi } from '../api/dealApi';
import type { CreateDealInput, Deal, UpdateDealInput } from '../types';

export const dealQueries = createCrudQueries<Deal, CreateDealInput, UpdateDealInput>('deals', dealApi, {
  singular: 'Deal',
});

export const {
  useList: useDealList,
  useCreate: useCreateDeal,
  useUpdate: useUpdateDeal,
  useRemove: useDeleteDeal,
} = dealQueries;
