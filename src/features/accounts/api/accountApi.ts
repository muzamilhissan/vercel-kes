import { createCrudApi } from '@/shared/api/crud';
import type { Account, CreateAccountInput, UpdateAccountInput } from '../types';

export const accountApi = createCrudApi<Account, CreateAccountInput, UpdateAccountInput>('accounts');
