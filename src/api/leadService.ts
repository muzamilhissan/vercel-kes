import { apiFetch } from './apiClient';
import { ApiResponse, Lead, CreateLeadInput, UpdateLeadInput, ConvertLeadInput, ConvertLeadResponse, LeadFollowUp, CreateFollowUpInput, UpdateFollowUpInput } from './types';

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

  /**
   * Get all assignable users.
   * GET /leads/assignable-users
   */
  async getAssignableUsers(): Promise<ApiResponse<any>> {
    return apiFetch<ApiResponse<any>>('/leads/assignable-users');
  },

  /**
   * Assign or reassign users to a lead.
   * PUT /leads/assign/:leadId
   */
  async assignLead(leadId: string | number, assignedTo: (number | string)[]): Promise<ApiResponse<any>> {
    return apiFetch<ApiResponse<any>>(`/leads/assign/${leadId}`, {
      method: 'PUT',
      body: JSON.stringify({ assigned_to: assignedTo }),
    });
  },

  // --------------------------------------------------------------------------
  // Lead Follow-ups
  // --------------------------------------------------------------------------

  async getFollowUps(leadId: string | number): Promise<ApiResponse<LeadFollowUp[]>> {
    return apiFetch<ApiResponse<LeadFollowUp[]>>(`/leads/${leadId}/follow-ups/list`);
  },

  async getFollowUpById(leadId: string | number, followUpId: string | number): Promise<ApiResponse<LeadFollowUp>> {
    return apiFetch<ApiResponse<LeadFollowUp>>(`/leads/${leadId}/follow-ups/show/${followUpId}`);
  },

  async createFollowUp(leadId: string | number, data: CreateFollowUpInput): Promise<ApiResponse<LeadFollowUp>> {
    return apiFetch<ApiResponse<LeadFollowUp>>(`/leads/${leadId}/follow-ups/store`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateFollowUp(leadId: string | number, followUpId: string | number, data: UpdateFollowUpInput): Promise<ApiResponse<LeadFollowUp>> {
    return apiFetch<ApiResponse<LeadFollowUp>>(`/leads/${leadId}/follow-ups/update/${followUpId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteFollowUp(leadId: string | number, followUpId: string | number): Promise<ApiResponse<void>> {
    return apiFetch<ApiResponse<void>>(`/leads/${leadId}/follow-ups/delete/${followUpId}`, {
      method: 'DELETE',
    });
  },

  async cancelFollowUp(leadId: string | number, followUpId: string | number): Promise<ApiResponse<LeadFollowUp>> {
    return apiFetch<ApiResponse<LeadFollowUp>>(`/leads/${leadId}/follow-ups/cancel/${followUpId}`, {
      method: 'POST',
    });
  },

  async completeFollowUp(leadId: string | number, followUpId: string | number): Promise<ApiResponse<LeadFollowUp>> {
    return apiFetch<ApiResponse<LeadFollowUp>>(`/leads/${leadId}/follow-ups/complete/${followUpId}`, {
      method: 'POST',
    });
  },
};

