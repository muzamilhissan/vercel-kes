export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface LoginResponse {
  token?: string;
  user?: {
    id: number | string;
    email: string;
    name?: string;
  };
}

export interface Lead {
  id: string | number;
  name: string;
  company: string;
  email: string;
  phone: string;
  status?: string;
  dateAdded?: string;
}

export interface CreateLeadInput {
  name: string;
  company: string;
  email: string;
  phone: string;
}

export interface UpdateLeadInput {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  status?: string;
}

// Convert Lead Payload Modes
export interface ConvertLeadModeAPayload {
  existing_contact_id: number | string;
}

export interface ConvertLeadModeBPayload {
  contact_name: string;
  contact_company: string;
  contact_email: string;
  contact_phone: string;
}

export type ConvertLeadInput = ConvertLeadModeAPayload | ConvertLeadModeBPayload;

export interface ConvertLeadResponse {
  success: boolean;
  contact_id?: number | string;
  message?: string;
}
