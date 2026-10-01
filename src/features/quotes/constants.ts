import type { BadgeTone } from '@/shared/ui';

export const PO_STATUSES = [
  'Draft',
  'Submitted',
  'Approved',
  'Rejected',
  'Invoiced',
  'Completed',
  'Cancelled',
] as const;

export type POStatus = (typeof PO_STATUSES)[number];

export const PO_STATUS_TONES: Record<POStatus, BadgeTone> = {
  Draft: 'neutral',
  Submitted: 'info',
  Approved: 'success',
  Rejected: 'danger',
  Invoiced: 'brand',
  Completed: 'success',
  Cancelled: 'danger',
};

export function toPOStatus(value: unknown): POStatus {
  const normalized = String(value ?? '').toLowerCase();
  return PO_STATUSES.find((status) => status.toLowerCase() === normalized) ?? 'Draft';
}

export const toneForPOStatus = (value: unknown): BadgeTone => PO_STATUS_TONES[toPOStatus(value)];

export const PO_DELIVERY_OPTIONS = ['Delivery', 'Collection'] as const;
export type PODeliveryOption = (typeof PO_DELIVERY_OPTIONS)[number];

export const DELIVERY_REQUIRES_ADDRESS: PODeliveryOption = 'Delivery';
