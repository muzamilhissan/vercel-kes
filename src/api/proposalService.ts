import { apiFetch } from './apiClient';
import {
  ApiResponse,
  Proposal,
  ProposalOptionsResponse,
  CreateProposalRequestInput,
  StoreProposalRequestResponse,
  ProposalRequestContentResponse,
} from './types';

export const proposalService = {
  /**
   * Get options for proposal request questionnaire.
   * GET /leads/proposal-requests/options
   */
  async getProposalOptions(): Promise<ProposalOptionsResponse> {
    return apiFetch<ProposalOptionsResponse>('/leads/proposal-requests/options');
  },

  /**
   * Store a proposal request and generate AI proposal content.
   * POST /leads/:lead/proposal-requests/store
   */
  async storeProposalRequest(
    leadId: string | number,
    payload: CreateProposalRequestInput
  ): Promise<StoreProposalRequestResponse> {
    return apiFetch<StoreProposalRequestResponse>(`/leads/${leadId}/proposal-requests/store`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Get generated content for a proposal request.
   * GET /leads/:lead/proposal-requests/content/:proposalRequest
   */
  async getProposalRequestContent(
    leadId: string | number,
    proposalRequestId: string | number
  ): Promise<ProposalRequestContentResponse> {
    return apiFetch<ProposalRequestContentResponse>(
      `/leads/${leadId}/proposal-requests/content/${proposalRequestId}`
    );
  },

  /**
   * Regenerate proposal request content.
   * POST /leads/:lead/proposal-requests/regenerate/:proposalRequest
   */
  async regenerateProposalRequest(
    leadId: string | number,
    proposalRequestId: string | number
  ): Promise<StoreProposalRequestResponse> {
    return apiFetch<StoreProposalRequestResponse>(
      `/leads/${leadId}/proposal-requests/regenerate/${proposalRequestId}`,
      {
        method: 'POST',
      }
    );
  },

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

