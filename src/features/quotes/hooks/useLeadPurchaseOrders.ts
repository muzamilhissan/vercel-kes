import { useMutation } from '@tanstack/react-query';
import { toast } from '@/shared/toast';
import { purchaseOrderApi } from '../api/purchaseOrderApi';
import type { CreatePurchaseOrderInput } from '../types';

export function useCreatePurchaseOrder(leadId: string | number) {
  return useMutation({
    mutationFn: (input: CreatePurchaseOrderInput) => purchaseOrderApi.create(leadId, input),
    onSuccess: (response) => {
      const reference = response.po_workshop?.po_no;
      toast.success(
        reference
          ? `PO ${reference} created in the KES Main App`
          : 'Purchase order created in the KES Main App',
      );
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to create the purchase order'),
  });
}
