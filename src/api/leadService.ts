import { apiFetch } from './apiClient';
import { ApiResponse, Lead, CreateLeadInput, UpdateLeadInput, ConvertLeadInput, ConvertLeadResponse } from './types';

export const leadService = {
  /**
   * Get all leads.
   * GET /leads/list
   */
  async list(page?: number, perPage?: number, search?: string): Promise<ApiResponse<Lead[]>> {
    const params: Record<string, string> = {};
    if (page !== undefined) params.page = String(page);
    if (perPage !== undefined) params.per_page = String(perPage);
    if (search !== undefined && search.trim() !== '') params.search = search;
    return apiFetch<ApiResponse<Lead[]>>('/leads/list', { params });
  },

  /**
   * Store a new lead.
   * POST /leads/store
   */
  async store(leadData: CreateLeadInput): Promise<ApiResponse<Lead>> {
    return apiFetch<ApiResponse<Lead>>('/leads/store', {
      method: 'POST',
      body: JSON.stringify(leadData),
    });
  },

  /**
   * Get details of a specific lead by ID.
   * GET /leads/show/:id
   */
  async show(id: string | number): Promise<ApiResponse<Lead>> {
    return apiFetch<ApiResponse<Lead>>(`/leads/show/${id}`);
  },

  /**
   * Update an existing lead by ID.
   * PUT /leads/update/:id
   */
  async update(id: string | number, leadData: UpdateLeadInput): Promise<ApiResponse<Lead>> {
    return apiFetch<ApiResponse<Lead>>(`/leads/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(leadData),
    });
  },

  /**
   * Update lead status.
   * PUT /leads/update-status/:id
   */
  async updateStatus(id: string | number, status: string): Promise<ApiResponse<Lead>> {
    return apiFetch<ApiResponse<Lead>>(`/leads/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  /**
   * Delete a lead by ID.
   * DELETE /leads/delete/:id
   */
  async delete(id: string | number): Promise<ApiResponse<void>> {
    return apiFetch<ApiResponse<void>>(`/leads/delete/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Convert a lead to a contact.
   * POST /leads/convert/:id
   * Supports Mode A (existing contact) or Mode B (new contact details).
   */
  async convert(id: string | number, convertData: ConvertLeadInput): Promise<ApiResponse<ConvertLeadResponse>> {
    return apiFetch<ApiResponse<ConvertLeadResponse>>(`/leads/convert/${id}`, {
      method: 'POST',
      body: JSON.stringify(convertData),
    });
  },
};
