import { api } from '@/shared/api/client';
import type { ApiResponse } from '@/shared/types/api';
import type { CreatePurchaseOrderInput, PurchaseOrder } from '../types';

export const purchaseOrderApi = {
  create: (leadId: string | number, input: CreatePurchaseOrderInput) =>
    api.post<ApiResponse<PurchaseOrder>>(`/leads/${leadId}/po-workshops/store`, input),
};
