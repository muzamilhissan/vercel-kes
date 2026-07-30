import { apiFetch } from './apiClient';
import { ApiResponse, Proposal } from './types';

export const proposalService = {
  /**
   * Get all proposals for a lead.
   * GET /leads/:lead/proposals/list
   */
  async listProposals(leadId: string | number): Promise<ApiResponse<Proposal[]>> {
    return apiFetch<ApiResponse<Proposal[]>>(`/leads/${leadId}/proposals/list`);
  },

  /**
   * Store a new proposal.
   * POST /leads/:lead/proposals/store
   */
  async storeProposal(leadId: string | number, formData: FormData): Promise<ApiResponse<Proposal>> {
    return apiFetch<ApiResponse<Proposal>>(`/leads/${leadId}/proposals/store`, {
      method: 'POST',
      body: formData, // Sending FormData directly for file upload
    });
  },

  /**
   * Get details of a specific proposal.
   * GET /leads/:lead/proposals/show/:proposal
   */
  async showProposal(leadId: string | number, proposalId: string | number): Promise<ApiResponse<Proposal>> {
    return apiFetch<ApiResponse<Proposal>>(`/leads/${leadId}/proposals/show/${proposalId}`);
  },

  /**
   * Update an existing proposal.
   * POST /leads/:lead/proposals/update/:proposal
   */
  async updateProposal(leadId: string | number, proposalId: string | number, formData: FormData): Promise<ApiResponse<Proposal>> {
    return apiFetch<ApiResponse<Proposal>>(`/leads/${leadId}/proposals/update/${proposalId}`, {
      method: 'POST', // Typically POST with _method=PUT in form data, or just POST for updates with files
      body: formData,
    });
  },

  /**
   * Delete a proposal.
   * DELETE /leads/:lead/proposals/delete/:proposal
   */
  async deleteProposal(leadId: string | number, proposalId: string | number): Promise<ApiResponse<void>> {
    return apiFetch<ApiResponse<void>>(`/leads/${leadId}/proposals/delete/${proposalId}`, {
      method: 'DELETE',
    });
  },
};
