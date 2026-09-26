import { createCrudQueries } from '@/shared/api/createCrudQueries';
import { contactApi } from '../api/contactApi';
import type { Contact, CreateContactInput, UpdateContactInput } from '../types';

export const contactQueries = createCrudQueries<Contact, CreateContactInput, UpdateContactInput>(
  'contacts',
  contactApi,
  { singular: 'Contact' },
);

export const {
  useList: useContactList,
  useCreate: useCreateContact,
  useUpdate: useUpdateContact,
  useRemove: useDeleteContact,
} = contactQueries;
