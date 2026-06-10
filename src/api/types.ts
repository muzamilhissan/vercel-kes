export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface Role {
  id?: number | string;
  name: string;
}

export interface User {
  id: number | string;
  fullName: string;
  email: string;
  designation?: string;
  phoneNumber?: string;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
  roles?: Role[];
}

export interface LoginResponse {
  token: string;
  user: User;
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

export interface Account {
  id: string | number;
  name: string;
  industry: string;
  website: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateAccountInput {
  name: string;
  industry: string;
  website: string;
  description: string;
}

export interface UpdateAccountInput {
  name?: string;
  industry?: string;
  website?: string;
  description?: string;
}

export interface Contact {
  id: string | number;
  name: string;
  job_title: string;
  email: string;
  phone: string;
  account_id?: number | string;
  account?: Account;
  created_at?: string;
  updated_at?: string;
}

export interface CreateContactInput {
  name: string;
  job_title: string;
  email: string;
  phone: string;
  account_id: number | string;
}

export interface UpdateContactInput {
  name?: string;
  job_title?: string;
  email?: string;
  phone?: string;
  account_id?: number | string;
}

export interface Deal {
  id: string | number;
  name: string;
  account_id?: number | string;
  value: number;
  close_date: string;
  stage: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateDealInput {
  name: string;
  account_id: number | string;
  value: number;
  close_date: string;
  stage: string;
  notes?: string;
}

export interface UpdateDealInput {
  name?: string;
  account_id?: number | string;
  value?: number;
  close_date?: string;
  stage?: string;
  notes?: string;
}
