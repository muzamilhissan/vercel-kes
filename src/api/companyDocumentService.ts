import { apiFetch } from './apiClient';
import { ApiResponse, CompanyDocument } from './types';

export const companyDocumentService = {
  listDocuments: async (): Promise<ApiResponse<CompanyDocument[]>> => {
    return await apiFetch('/company-documents');
  },

  uploadDocument: async (formData: FormData): Promise<ApiResponse<CompanyDocument>> => {
    return await apiFetch('/company-documents', {
      method: 'POST',
      body: formData,
      // Content-Type is intentionally left blank so the browser sets it with the boundary for FormData
    });
  },

  deleteDocument: async (id: string | number): Promise<ApiResponse<null>> => {
    return await apiFetch(`/company-documents/${id}`, { method: 'DELETE' });
  }
};
