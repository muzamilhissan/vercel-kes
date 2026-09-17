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
  industry?: string;
  province?: string;
  website?: string;
  source?: string;
  expected_revenue?: number;
  probability?: number;
  notes?: string;
  assigned_to?: (number | string)[] | string | null;
  assignee?: User | null;
  assigned_users?: User[];
  assignees?: User[];
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
  expected_revenue?: number;
  probability?: number;
  notes?: string;
  assigned_to?: (number | string)[];
}

export interface UpdateLeadInput {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  status?: string;
  industry?: string;
  province?: string;
  website?: string;
  source?: string;
  expected_revenue?: number;
  probability?: number;
  notes?: string;
  assigned_to?: (number | string)[] | string | null;
}

export interface AssignLeadInput {
  assigned_to: (number | string)[];
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

export interface DealFile {
  id: string | number;
  deal_id: string | number;
  file_name: string;
  file_path: string;
  file_size?: number;
  mime_type?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProposalAttachment {
  id: string | number;
  proposal_id: string | number;
  file_name: string;
  file_path: string;
  file_size?: number;
  mime_type?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Proposal {
  id: string | number;
  lead_id: string | number;
  subject: string;
  content: string;
  created_at?: string;
  updated_at?: string;
  attachments?: ProposalAttachment[];
}

export interface LeadFollowUp {
  id: string | number;
  lead_id: string | number;
  follow_up_date: string;
  follow_up_time: string;
  notes: string;
  status: string; // 'Scheduled', 'Completed', 'Cancelled'
  created_at?: string;
  updated_at?: string;
}

export interface CreateFollowUpInput {
  date: string;
  time: string;
  notes?: string;
}

export interface UpdateFollowUpInput {
  date?: string;
  time?: string;
  notes?: string;
  status?: string;
}

export interface ProposalOptionItem {
  id: number;
  name: string;
}

export interface ProposalOptionsData {
  ppc_operations: ProposalOptionItem[];
  services: ProposalOptionItem[];
  main_purposes: ProposalOptionItem[];
  commercial_approaches: ProposalOptionItem[];
}

export interface ProposalOptionsResponse {
  success: boolean;
  message?: string;
  options: ProposalOptionsData;
}

export interface CreateProposalRequestInput {
  ppc_operation_id?: number;
  plant_name?: string;
  custom_ppc_operation?: string;
  service_ids: number[];
  main_purpose_id: number;
  commercial_approach_id: number;
}

export interface GeneratedContent {
  proposal_request_id?: number;
  generation_status: string;
  error_message?: string | null;
  email_subject: string;
  email_body: string;
  proposal_download_url?: string;
  generated_at?: string;
  created_at?: string;
}

export interface ProposalRequestItem {
  id: number;
  lead_id: number | string;
  ppc_operation?: ProposalOptionItem | null;
  custom_ppc_operation?: string | null;
  operation_display_name?: string;
  plant_name?: string | null;
  services: ProposalOptionItem[];
  main_purpose: ProposalOptionItem;
  commercial_approach: ProposalOptionItem;
  requested_by?: {
    id: number;
    name: string;
  };
  generated_content?: GeneratedContent;
  created_at?: string;
}

export interface StoreProposalRequestResponse {
  success: boolean;
  message?: string;
  proposal_request: ProposalRequestItem;
}

export interface ProposalRequestContentResponse {
  success: boolean;
  message?: string;
  generated_content: GeneratedContent;
}

