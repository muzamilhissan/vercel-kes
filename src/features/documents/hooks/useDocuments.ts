import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/shared/toast';
import { unwrapList } from '@/shared/api/unwrap';
import { documentApi } from '../api/documentApi';
import type { CompanyDocument } from '../types';

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

const documentsKey = ['company-documents'] as const;

/** Documents are served from storage, so relative paths need the API host prefixed. */
export function documentUrl(document: CompanyDocument): string {
  const path = document.signedUrl || document.signed_url || document.file_path;
  if (!path) return '';
  if (path.startsWith('http')) return path;

  const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/api$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}

/**
 * @param enabled set false to hold the fetch back until it is needed — the document
 * picker mounts with its dialog closed and should not load the library until opened.
 */
export function useDocuments(enabled = true) {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: documentsKey });

  const query = useQuery({
    queryKey: documentsKey,
    queryFn: async () => unwrapList<CompanyDocument>(await documentApi.list(), 'documents'),
    enabled,
  });

  const upload = useMutation({
    mutationFn: (file: File) => {
      if (file.size > MAX_UPLOAD_BYTES) throw new Error('File exceeds the 10MB limit.');
      const body = new FormData();
      body.append('document', file);
      return documentApi.upload(body);
    },
    onSuccess: () => {
      toast.success('Document uploaded successfully');
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message || 'Error uploading document'),
  });

  const remove = useMutation({
    mutationFn: (document: CompanyDocument) => documentApi.remove(document.id),
    onSuccess: () => {
      toast.success('Document deleted successfully');
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message || 'Error deleting document'),
  });

  return { query, upload, remove };
}
