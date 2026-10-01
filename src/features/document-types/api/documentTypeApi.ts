import { createCrudApi } from '@/shared/api/crud';
import type { CreateDocumentTypeInput, DocumentType, UpdateDocumentTypeInput } from '../types';

export const documentTypeApi = createCrudApi<DocumentType, CreateDocumentTypeInput, UpdateDocumentTypeInput>(
  'document-types',
);
