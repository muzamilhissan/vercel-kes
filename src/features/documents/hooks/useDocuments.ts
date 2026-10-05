import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { session } from '@/shared/auth/session';
import { hasPermission, isSuperAdmin } from '@/shared/auth/permissions';
import { toast } from '@/shared/toast';
import { documentApi, type DocumentListParams } from '../api/documentApi';
import type { CompanyDocument, UpdateDocumentInput, UploadDocumentInput } from '../types';

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

const documentsKey = (params: DocumentListParams) => ['documents', params] as const;

export interface DocumentListPage {
  items: CompanyDocument[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
}

function normalize(response: unknown): DocumentListPage {
  const envelope = (response ?? {}) as Record<string, unknown>;
  const inner = (envelope.data ?? {}) as Record<string, unknown>;
  const items = (Array.isArray(inner.data) ? inner.data : Array.isArray(envelope.data) ? envelope.data : []) as
    CompanyDocument[];
  const meta = (inner.meta ?? envelope.meta ?? {}) as Record<string, number>;

  return {
    items,
    currentPage: meta.current_page ?? 1,
    totalPages: meta.last_page ?? 1,
    totalItems: meta.total ?? items.length,
    perPage: meta.per_page ?? items.length,
  };
}

export function documentUrl(document: CompanyDocument): string {
  return document.signed_url ?? '';
}

export function useDocumentPermissions() {
  const user = session.getUser();
  const admin = isSuperAdmin(user);

  return {
    canView: admin || hasPermission(user, 'View Document'),
    canUpload: admin || hasPermission(user, 'Add Document'),
    canEdit: admin || hasPermission(user, 'Edit Document'),
    canDelete: admin || hasPermission(user, 'Delete Document'),
  };
}

export function useDocuments(params: DocumentListParams = {}, enabled = true) {
  const queryClient = useQueryClient();
  const queryKey = documentsKey(params);

  const query = useQuery({
    queryKey,
    enabled,
    queryFn: async () => normalize(await documentApi.list(params)),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['documents'] });

  const upload = useMutation({
    mutationFn: ({ document_type_id, file, description }: UploadDocumentInput) => {
      if (file.size > MAX_UPLOAD_BYTES) throw new Error('File exceeds the 10MB limit.');
      const body = new FormData();
      body.append('document_type_id', String(document_type_id));
      body.append('file', file);
      if (description) body.append('description', description);
      return documentApi.upload(body);
    },
    onSuccess: () => {
      toast.success('Document uploaded successfully');
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message || 'Error uploading document'),
  });

  const update = useMutation({
    mutationFn: ({ id, input }: { id: string | number; input: UpdateDocumentInput }) => {
      if (input.file && input.file.size > MAX_UPLOAD_BYTES) throw new Error('File exceeds the 10MB limit.');
      const body = new FormData();
      if (input.description !== undefined) body.append('description', input.description);
      if (input.file) body.append('file', input.file);
      return documentApi.update(id, body);
    },
    onSuccess: () => {
      toast.success('Document updated successfully');
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message || 'Error updating document'),
  });

  const remove = useMutation({
    mutationFn: (document: CompanyDocument) => documentApi.remove(document.id),
    onSuccess: () => {
      toast.success('Document deleted successfully');
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message || 'Error deleting document'),
  });

  const data = query.data;

  return {
    query,
    isLoading: query.isPending,
    documents: data?.items ?? [],
    page: data?.currentPage ?? 1,
    totalPages: data?.totalPages ?? 1,
    totalItems: data?.totalItems ?? 0,
    perPage: data?.perPage ?? 15,
    upload,
    update,
    remove,
  };
}
