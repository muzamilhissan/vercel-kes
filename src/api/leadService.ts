import { apiFetch } from './apiClient';
import { Lead, CreateLeadInput, UpdateLeadInput, ConvertLeadInput, ConvertLeadResponse } from './types';

export const leadService = {
  /**
   * Get all leads.
   * GET /leads/list
   */
  async list(): Promise<Lead[]> {
    return apiFetch<Lead[]>('/leads/list');
  },

  /**
   * Store a new lead.
   * POST /leads/store
   */
  async store(leadData: CreateLeadInput): Promise<Lead> {
    return apiFetch<Lead>('/leads/store', {
      method: 'POST',
      body: JSON.stringify(leadData),
    });
  },

  /**
   * Get details of a specific lead by ID.
   * GET /leads/show/:id
   */
  async show(id: string | number): Promise<Lead> {
    return apiFetch<Lead>(`/leads/show/${id}`);
  },

  /**
   * Update an existing lead by ID.
   * PUT /leads/update/:id
   */
  async update(id: string | number, leadData: UpdateLeadInput): Promise<Lead> {
    return apiFetch<Lead>(`/leads/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(leadData),
    });
  },

  /**
   * Delete a lead by ID.
   * DELETE /leads/delete/:id
   */
  async delete(id: string | number): Promise<void> {
    return apiFetch<void>(`/leads/delete/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Convert a lead to a contact.
   * POST /leads/convert/:id
   * Supports Mode A (existing contact) or Mode B (new contact details).
   */
  async convert(id: string | number, convertData: ConvertLeadInput): Promise<ConvertLeadResponse> {
    return apiFetch<ConvertLeadResponse>(`/leads/convert/${id}`, {
      method: 'POST',
      body: JSON.stringify(convertData),
    });
  },
};
