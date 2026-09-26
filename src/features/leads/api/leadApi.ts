import { api } from '@/shared/api/client';
import { createCrudApi, type CrudApi } from '@/shared/api/crud';
import type { ApiResponse, User } from '@/shared/types/api';
import type {
  ConvertLeadInput,
  ConvertLeadResponse,
  CreateLeadInput,
  Lead,
  UpdateLeadInput,
} from '../types';
import { mapApiLead } from './mapLead';

const crud = createCrudApi<Lead, CreateLeadInput, UpdateLeadInput>('leads');

/** Every read goes through `mapApiLead`, so callers never see the raw API shape. */
const mapped: CrudApi<Lead, CreateLeadInput, UpdateLeadInput> = {
  ...crud,
  async list(params) {
    const result = await crud.list(params);
    return { ...result, items: result.items.map(mapApiLead) };
  },
  async show(id) {
    const response = await crud.show(id);
    return { ...response, data: mapApiLead(response.data) };
  },
};

export const leadApi = {
  ...mapped,

  /** Status lives on the same update endpoint; kept separate so callers read clearly. */
  updateStatus: (id: string | number, status: string) => mapped.update(id, { status }),

  convert: (id: string | number, input: ConvertLeadInput) =>
    api.post<ApiResponse<ConvertLeadResponse>>(`/leads/convert/${id}`, input),

  getAssignableUsers: () => api.get<ApiResponse<User[]>>('/leads/assignable-users'),

  assign: (id: string | number, assignedTo: (number | string)[]) =>
    api.put<ApiResponse<Lead>>(`/leads/assign/${id}`, { assigned_to: assignedTo }),
};
