export interface POCondition {
  label: string;
  description: string;
}

export interface CreatePurchaseOrderInput {
  po_no?: string;
  invoice_no?: string;
  po_owner: string;
  client_id?: number | string;
  site_id?: number | string;
  delivery_option: number;
  delivery_address?: string;
  project_description: string;
  conditions: POCondition[];
}

export interface PurchaseOrder {
  id: string | number;
  lead_id?: string | number;
  po_no?: string;
  invoice_no?: string;
  po_owner?: string;
  client_id?: number | string | null;
  site_id?: number | string | null;
  delivery_option?: number;
  delivery_address?: string;
  project_description?: string;
  conditions?: POCondition[];
  status?: string;
  created_at?: string;
}
