import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { unwrapList } from '@/shared/api/unwrap';
import { toast } from '@/shared/toast';
import {
  PURCHASE_ORDERS_API_PENDING_MESSAGE,
  PURCHASE_ORDERS_API_READY,
  purchaseOrderApi,
} from '../api/purchaseOrderApi';
import type { CreatePurchaseOrderInput, PurchaseOrder } from '../types';

export const purchaseOrderKeys = {
  forLead: (leadId: string | number) => ['leads', String(leadId), 'purchase-orders'] as const,
};

export function useLeadPurchaseOrders(leadId: string | number, enabled = true) {
  const queryClient = useQueryClient();
  const queryKey = purchaseOrderKeys.forLead(leadId);

  const query = useQuery({
    queryKey,
    enabled: PURCHASE_ORDERS_API_READY && Boolean(leadId) && enabled,
    queryFn: async () => {
      if (!PURCHASE_ORDERS_API_READY) throw new Error(PURCHASE_ORDERS_API_PENDING_MESSAGE);
      const items = unwrapList<PurchaseOrder>(
        await purchaseOrderApi.list(leadId),
        'purchase_orders',
        'purchaseOrders',
      );
      return [...items].sort((a, b) => String(b.created_at ?? '').localeCompare(String(a.created_at ?? '')));
    },
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  const create = useMutation({
    mutationFn: (input: CreatePurchaseOrderInput) => {
      if (!PURCHASE_ORDERS_API_READY) throw new Error(PURCHASE_ORDERS_API_PENDING_MESSAGE);
      return purchaseOrderApi.create(leadId, input);
    },
    onSuccess: () => {
      toast.success('Purchase order created successfully');
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to create the purchase order'),
  });

  const refreshStatus = useMutation({
    mutationFn: (id: string | number) => {
      if (!PURCHASE_ORDERS_API_READY) throw new Error(PURCHASE_ORDERS_API_PENDING_MESSAGE);
      return purchaseOrderApi.syncStatus(leadId, id);
    },
    onSuccess: invalidate,
    onError: (error: Error) => toast.error(error.message || 'Could not refresh the PO status'),
  });

  const purchaseOrders = query.data ?? [];

  return {
    query,
    isLoading: query.isFetching,
    purchaseOrders,
    linkedPO: purchaseOrders[0] ?? null,
    hasPurchaseOrder: purchaseOrders.length > 0,
    create,
    refreshStatus,
  };
}
