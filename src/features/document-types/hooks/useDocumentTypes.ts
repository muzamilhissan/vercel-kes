import { createCrudQueries } from '@/shared/api/createCrudQueries';
import { documentTypeApi } from '../api/documentTypeApi';
import type { CreateDocumentTypeInput, DocumentType, UpdateDocumentTypeInput } from '../types';

export const documentTypeQueries = createCrudQueries<
  DocumentType,
  CreateDocumentTypeInput,
  UpdateDocumentTypeInput
>('document-types', documentTypeApi, { singular: 'Document type' });

export const {
  useList: useDocumentTypeList,
  useCreate: useCreateDocumentType,
  useUpdate: useUpdateDocumentType,
  useRemove: useDeleteDocumentType,
} = documentTypeQueries;
