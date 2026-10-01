import type { PODeliveryOption, POStatus } from './constants';

export interface POTermCondition {
  id?: string | number;
  title: string;
  description: string;
}

export interface PurchaseOrder {
  id: string | number;
  lead_id: string | number;
  po_number: string;
  invoice_number?: string;
  po_owner: string;
  site: string;
  delivery_option: PODeliveryOption;
  delivery_address?: string;
  project_description?: string;
  client_name: string;
  client_company?: string;
  contact_id?: string | number | null;
  status?: POStatus | string;
  terms_conditions?: POTermCondition[];
  created_at?: string;
  updated_at?: string;
}

export interface CreatePurchaseOrderInput {
  po_number: string;
  invoice_number?: string;
  po_owner: string;
  site: string;
  delivery_option: PODeliveryOption;
  delivery_address?: string;
  project_description?: string;
  client_name: string;
  client_company?: string;
  terms_conditions: POTermCondition[];
}
