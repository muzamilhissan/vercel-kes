import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/shared/toast';
import { triggerDownload } from '@/shared/lib/file';
import { unwrapList } from '@/shared/api/unwrap';
import { dealFileApi } from '../api/dealApi';
import type { DealFile } from '../types';

const filesKey = (dealId: string | number) => ['deals', String(dealId), 'files'] as const;

/** The API reports unsupported types in several phrasings; show one message. */
function readableUploadError(message: string): string {
  return message.toLowerCase().includes('unsupported file type') ? 'File type not supported' : message;
}

export function useDealFiles(dealId: string | number) {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: filesKey(dealId) });

  const query = useQuery({
    queryKey: filesKey(dealId),
    queryFn: async () => {
      const files = unwrapList<DealFile>(await dealFileApi.list(dealId), 'files');
      return files.filter((file) => Boolean(file) && typeof file === 'object');
    },
  });

  const upload = useMutation({
    mutationFn: (file: File) => dealFileApi.upload(dealId, file),
    onSuccess: () => {
      toast.success('File uploaded successfully');
      invalidate();
    },
    onError: (error: Error) => toast.error(readableUploadError(error.message || 'Error uploading file')),
  });

  const remove = useMutation({
    mutationFn: (file: DealFile) => dealFileApi.remove(dealId, file.id),
    onSuccess: () => {
      toast.success('File deleted successfully');
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to delete file'),
  });

  const download = useMutation({
    mutationFn: async (file: DealFile) => {
      const filename = file.file_name || 'download';

      // Prefer a signed URL: fetching the redirect directly trips CORS.
      const response = await dealFileApi.signedUrl(dealId, file.id).catch(() => null);
      const signedUrl = response?.data?.url;
      if (typeof signedUrl === 'string' && signedUrl.startsWith('http')) {
        triggerDownload(signedUrl, filename);
        return;
      }

      const blob = await dealFileApi.download(dealId, file.id);
      triggerDownload(URL.createObjectURL(blob), filename, true);
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to download file'),
  });

  return { query, upload, remove, download };
}
