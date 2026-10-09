import { api } from '@/shared/api/client';
import type { CreatePurchaseOrderInput, CreatePurchaseOrderResponse } from '../types';

export const purchaseOrderApi = {
  create: (leadId: string | number, input: CreatePurchaseOrderInput) =>
    api.post<CreatePurchaseOrderResponse>(`/leads/${leadId}/po-workshops/store`, input),
};
