import { api } from '@/shared/api/client';
import type { ApiResponse } from '@/shared/types/api';
import type { CompanyDocument } from '../types';

export const documentApi = {
  list: () => api.get<ApiResponse<CompanyDocument[]>>('/company-documents'),
  upload: (body: FormData) => api.post<ApiResponse<CompanyDocument>>('/company-documents', body),
  remove: (id: string | number) => api.delete<ApiResponse<null>>(`/company-documents/${id}`),
};
