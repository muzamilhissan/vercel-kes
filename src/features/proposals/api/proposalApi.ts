import { api } from '@/shared/api/client';
import type { ApiResponse } from '@/shared/types/api';
import type {
  CreateProposalRequestInput,
  Proposal,
  ProposalOptionsResponse,
  StoreProposalRequestResponse,
} from '../types';

const base = (leadId: string | number) => `/leads/${leadId}/proposals`;

/** AI-generated proposal requests. */
export const proposalRequestApi = {
  options: () => api.get<ProposalOptionsResponse>('/leads/proposals/options'),

  create: (leadId: string | number, input: CreateProposalRequestInput) =>
    api.post<StoreProposalRequestResponse>(`${base(leadId)}/store`, input),
};

/** Proposals saved against a lead, with their file attachments. */
export const proposalApi = {
  list: (leadId: string | number) => api.get<ApiResponse<Proposal[]>>(`${base(leadId)}/list`),
  show: (leadId: string | number, id: string | number) => api.get<ApiResponse<Proposal>>(`${base(leadId)}/show/${id}`),
  update: (leadId: string | number, id: string | number, body: FormData) =>
    api.post<ApiResponse<Proposal>>(`${base(leadId)}/update/${id}`, body),
  send: (leadId: string | number, id: string | number) =>
    api.post<ApiResponse<Proposal>>(`${base(leadId)}/send/${id}`),
  remove: (leadId: string | number, id: string | number) => api.delete<ApiResponse<void>>(`${base(leadId)}/delete/${id}`),
};
