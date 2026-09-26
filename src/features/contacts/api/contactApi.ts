import { createCrudApi } from '@/shared/api/crud';
import type { Contact, CreateContactInput, UpdateContactInput } from '../types';

export const contactApi = createCrudApi<Contact, CreateContactInput, UpdateContactInput>('contacts');
