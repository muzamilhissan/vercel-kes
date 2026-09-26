import { api } from '@/shared/api/client';
import type { ApiResponse } from '@/shared/types/api';
import type { CreateFollowUpInput, LeadFollowUp, UpdateFollowUpInput } from '../types';

const base = (leadId: string | number) => `/leads/${leadId}/follow-ups`;

export const followUpApi = {
  list: (leadId: string | number) => api.get<ApiResponse<LeadFollowUp[]>>(`${base(leadId)}/list`),

  show: (leadId: string | number, id: string | number) =>
    api.get<ApiResponse<LeadFollowUp>>(`${base(leadId)}/show/${id}`),

  create: (leadId: string | number, input: CreateFollowUpInput) =>
    api.post<ApiResponse<LeadFollowUp>>(`${base(leadId)}/store`, input),

  update: (leadId: string | number, id: string | number, input: UpdateFollowUpInput) =>
    api.put<ApiResponse<LeadFollowUp>>(`${base(leadId)}/update/${id}`, input),

  remove: (leadId: string | number, id: string | number) =>
    api.delete<ApiResponse<void>>(`${base(leadId)}/delete/${id}`),

  cancel: (leadId: string | number, id: string | number) =>
    api.post<ApiResponse<LeadFollowUp>>(`${base(leadId)}/cancel/${id}`),

  complete: (leadId: string | number, id: string | number) =>
    api.post<ApiResponse<LeadFollowUp>>(`${base(leadId)}/complete/${id}`),
};
