import { api } from '@/shared/api/client';
import { createCrudApi } from '@/shared/api/crud';
import { session } from '@/shared/auth/session';
import type { ApiResponse } from '@/shared/types/api';
import type { CreateDealInput, Deal, DealFile, UpdateDealInput } from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const dealApi = createCrudApi<Deal, CreateDealInput, UpdateDealInput>('deals');

export const dealFileApi = {
  list: (dealId: string | number) => api.get<ApiResponse<DealFile[]>>(`/deals/${dealId}/files`),

  upload: (dealId: string | number, file: File) => {
    const body = new FormData();
    body.append('file', file);
    return api.post<ApiResponse<DealFile>>(`/deals/${dealId}/files/upload`, body);
  },

  signedUrl: (dealId: string | number, fileId: string | number) =>
    api.get<ApiResponse<{ url: string }>>(`/deals/${dealId}/files/${fileId}/signed-url`),

  remove: (dealId: string | number, fileId: string | number) =>
    api.delete<ApiResponse<void>>(`/deals/${dealId}/files/${fileId}/delete`),

  /** Downloads return a binary body, so this bypasses the JSON client. */
  async download(dealId: string | number, fileId: string | number): Promise<Blob> {
    const token = session.getToken();
    const response = await fetch(`${BASE_URL}/deals/${dealId}/files/${fileId}/download`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!response.ok) throw new Error(`Failed to download file. Status: ${response.status}`);
    return response.blob();
  },
};
