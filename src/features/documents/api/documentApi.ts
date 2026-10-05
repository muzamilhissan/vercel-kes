import { api } from '@/shared/api/client';
import type { ApiResponse } from '@/shared/types/api';
import type { CompanyDocument } from '../types';

export interface DocumentListParams {
  page?: number;
  perPage?: number;
  documentTypeId?: number | string;
}

export const documentApi = {
  list: ({ page, perPage, documentTypeId }: DocumentListParams = {}) =>
    api.get<ApiResponse<unknown>>('/documents/list', {
      params: { page, per_page: perPage, document_type_id: documentTypeId },
    }),

  show: (id: string | number) => api.get<ApiResponse<CompanyDocument>>(`/documents/show/${id}`),

  upload: (body: FormData) => api.post<ApiResponse<CompanyDocument>>('/documents/upload', body),

  update: (id: string | number, body: FormData) =>
    api.post<ApiResponse<CompanyDocument>>(`/documents/update/${id}`, body),

  remove: (id: string | number) => api.delete<ApiResponse<void>>(`/documents/delete/${id}`),
};
