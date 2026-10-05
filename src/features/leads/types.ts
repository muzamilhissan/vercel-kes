import type { LeadAssignee } from './lib/assignees';

export type { LeadAssignee };

export interface Lead {
  id: string | number;
  name: string;
  company: string;
  email: string;
  phone: string;
  status?: string;
  dateAdded?: string;
  created_at?: string;
  industry?: string;
  province?: string;
  website?: string;
  source?: string;
  representative_position?: string;
  vat_number?: string;
  vendor_number?: string;
  registration_no?: string;
  finance_email?: string;
  enduser_name?: string;
  billing_statement_email?: string;
  address?: string;
  expected_revenue?: number;
  probability?: number;
  notes?: string;
  contact_id?: number | string | null;
  client_id?: number | string | null;
  converted_at?: string | null;
  assigned_to?: (number | string)[] | string | null;
  assignee?: LeadAssignee | null;
  assigned_users?: LeadAssignee[];
  assignees?: LeadAssignee[];
}

export interface CreateLeadInput {
  name: string;
  company: string;
  email: string;
  phone: string;
  industry?: string;
  province?: string;
  website?: string;
  source?: string;
  representative_position?: string;
  vat_number?: string;
  vendor_number?: string;
  registration_no?: string;
  finance_email?: string;
  enduser_name?: string;
  billing_statement_email?: string;
  address?: string;
  expected_revenue?: number;
  probability?: number;
  notes?: string;
  assigned_to?: (number | string)[];
}

export interface UpdateLeadInput extends Partial<Omit<CreateLeadInput, 'assigned_to'>> {
  status?: string;
  assigned_to?: (number | string)[] | string | null;
}

/** Mode A: attach the lead to a contact that already exists. */
export interface ConvertToExistingContact {
  existing_contact_id: number | string;
}

/** Mode B: create the contact from details captured during conversion. */
export interface ConvertToNewContact {
  contact_name: string;
  contact_company: string;
  contact_email: string;
  contact_phone: string;
}

export type ConvertLeadInput = ConvertToExistingContact | ConvertToNewContact;

export interface ConvertLeadResponse {
  success: boolean;
  contact_id?: number | string;
  message?: string;
}
