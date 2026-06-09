import { apiFetch } from './apiClient';
import { ApiResponse, Deal, CreateDealInput, UpdateDealInput } from './types';

export const dealService = {
  /**
   * Get all deals.
   * GET /deals/list
   */
  async list(): Promise<ApiResponse<Deal[]>> {
    return apiFetch<ApiResponse<Deal[]>>('/deals/list');
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
};
