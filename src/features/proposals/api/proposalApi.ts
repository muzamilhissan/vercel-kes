import { api } from '@/shared/api/client';
import type { ApiResponse } from '@/shared/types/api';
import type {
  CreateProposalRequestInput,
  Proposal,
  ProposalOptionsResponse,
  ProposalRequestContentResponse,
  StoreProposalRequestResponse,
} from '../types';

export const PROPOSAL_REQUESTS_API_READY = false;

export const PROPOSAL_REQUESTS_API_PENDING_MESSAGE =
  'Proposal generation is not connected to the backend yet.';

const base = (leadId: string | number) => `/leads/${leadId}/proposals`;
const requestBase = (leadId: string | number) => `/leads/${leadId}/proposal-requests`;

/** AI-generated proposal requests. */
export const proposalRequestApi = {
  options: () => api.get<ProposalOptionsResponse>('/leads/proposal-requests/options'),

  create: (leadId: string | number, input: CreateProposalRequestInput) =>
    api.post<StoreProposalRequestResponse>(`${requestBase(leadId)}/store`, input),

  content: (leadId: string | number, requestId: string | number) =>
    api.get<ProposalRequestContentResponse>(`${requestBase(leadId)}/${requestId}/content`),

  regenerate: (leadId: string | number, requestId: string | number) =>
    api.post<StoreProposalRequestResponse>(`${requestBase(leadId)}/${requestId}/regenerate`),
};

/** Proposals saved against a lead, with their file attachments. */
export const proposalApi = {
  list: (leadId: string | number) => api.get<ApiResponse<Proposal[]>>(`${base(leadId)}/list`),
  show: (leadId: string | number, id: string | number) => api.get<ApiResponse<Proposal>>(`${base(leadId)}/show/${id}`),
  create: (leadId: string | number, body: FormData) => api.post<ApiResponse<Proposal>>(`${base(leadId)}/store`, body),
  update: (leadId: string | number, id: string | number, body: FormData) =>
    api.post<ApiResponse<Proposal>>(`${base(leadId)}/update/${id}`, body),
  remove: (leadId: string | number, id: string | number) => api.delete<ApiResponse<void>>(`${base(leadId)}/delete/${id}`),
};
