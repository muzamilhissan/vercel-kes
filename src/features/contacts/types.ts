import type { Account } from '@/features/accounts/types';

export interface Contact {
  id: string | number;
  name: string;
  job_title: string;
  company?: string | null;
  email: string;
  phone: string;
  account_id?: number | string;
  account?: Account;
  created_at?: string;
  updated_at?: string;
}

export interface CreateContactInput {
  name: string;
  job_title: string;
  email: string;
  phone: string;
  account_id: number | string;
}

export type UpdateContactInput = Partial<CreateContactInput>;
