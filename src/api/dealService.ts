import { apiFetch } from './apiClient';
import { ApiResponse, Deal, CreateDealInput, UpdateDealInput, DealFile } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const dealService = {
  /**
   * Get all deals.
   * GET /deals/list
   */
  async list(page?: number, perPage?: number, search?: string): Promise<ApiResponse<Deal[]>> {
    const params: Record<string, string> = {};
    if (page !== undefined) params.page = String(page);
    if (perPage !== undefined) params.per_page = String(perPage);
    if (search !== undefined && search.trim() !== '') params.search = search;
    return apiFetch<ApiResponse<Deal[]>>('/deals/list', { params });
  },

  /**
   * Get details of a specific deal by ID.
   * GET /deals/show/:id
   */
  async show(id: string | number): Promise<ApiResponse<Deal>> {
    return apiFetch<ApiResponse<Deal>>(`/deals/show/${id}`);
  },

  /**
   * Store a new deal.
   * POST /deals/store
   */
  async store(dealData: CreateDealInput): Promise<ApiResponse<Deal>> {
    return apiFetch<ApiResponse<Deal>>('/deals/store', {
      method: 'POST',
      body: JSON.stringify(dealData),
    });
  },

  /**
   * Update an existing deal by ID.
   * PUT /deals/update/:id
   */
  async update(id: string | number, dealData: UpdateDealInput): Promise<ApiResponse<Deal>> {
    return apiFetch<ApiResponse<Deal>>(`/deals/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dealData),
    });
  },

  /**
   * Delete a deal by ID.
   * DELETE /deals/delete/:id
   */
  async delete(id: string | number): Promise<ApiResponse<void>> {
    return apiFetch<ApiResponse<void>>(`/deals/delete/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get all files for a specific deal.
   * GET /deals/:deal/files
   */
  async listFiles(dealId: string | number): Promise<ApiResponse<DealFile[]>> {
    return apiFetch<ApiResponse<DealFile[]>>(`/deals/${dealId}/files`);
  },

  /**
   * Upload a file for a specific deal.
   * POST /deals/:deal/files/upload
   */
  async uploadFile(dealId: string | number, file: File): Promise<ApiResponse<DealFile>> {
    const formData = new FormData();
    formData.append('files[]', file);
    return apiFetch<ApiResponse<DealFile>>(`/deals/${dealId}/files/upload`, {
      method: 'POST',
      body: formData,
    });
  },

  /**
   * Get a signed URL for a specific deal file.
   * GET /deals/:deal/files/:file/signed-url
   */
  async getSignedUrl(dealId: string | number, fileId: string | number): Promise<ApiResponse<{ url: string }>> {
    return apiFetch<ApiResponse<{ url: string }>>(`/deals/${dealId}/files/${fileId}/signed-url`);
  },

  /**
   * Download a specific deal file as a blob.
   * GET /deals/:deal/files/:file/download
   */
  async downloadFile(dealId: string | number, fileId: string | number): Promise<Blob> {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}/deals/${dealId}/files/${fileId}/download`, {
      headers,
    });
    if (!response.ok) {
      throw new Error(`Failed to download file. Status: ${response.status}`);
    }
    return response.blob();
  },

  /**
   * Delete a specific deal file.
   * DELETE /deals/:deal/files/:file
   */
  async deleteFile(dealId: string | number, fileId: string | number): Promise<ApiResponse<void>> {
    return apiFetch<ApiResponse<void>>(`/deals/${dealId}/files/${fileId}`, {
      method: 'DELETE',
    });
  },
};
