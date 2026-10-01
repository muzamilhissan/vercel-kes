import { api } from '@/shared/api/client';
import type { ApiResponse } from '@/shared/types/api';
import type { CreatePurchaseOrderInput, PurchaseOrder } from '../types';

export const PURCHASE_ORDERS_API_READY = false;

export const PURCHASE_ORDERS_API_PENDING_MESSAGE =
  'Purchase orders are not connected to the backend yet.';

const base = (leadId: string | number) => `/leads/${leadId}/purchase-orders`;

export const purchaseOrderApi = {
  list: (leadId: string | number) => api.get<ApiResponse<PurchaseOrder[]>>(`${base(leadId)}/list`),

  show: (leadId: string | number, id: string | number) =>
    api.get<ApiResponse<PurchaseOrder>>(`${base(leadId)}/show/${id}`),

  create: (leadId: string | number, input: CreatePurchaseOrderInput) =>
    api.post<ApiResponse<PurchaseOrder>>(`${base(leadId)}/store`, input),

  syncStatus: (leadId: string | number, id: string | number) =>
    api.get<ApiResponse<PurchaseOrder>>(`${base(leadId)}/${id}/status`),
};
