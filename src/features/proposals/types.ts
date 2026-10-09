export interface ProposalAttachment {
  id: string | number;
  proposal_id: string | number;
  file_name: string;
  file_path: string;
  signedUrl?: string;
  signed_url?: string;
  file_size?: number;
  mime_type?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Proposal {
  id: string | number;
  lead_id: string | number;
  email_subject?: string;
  email_body?: string;
  proposal_download_url?: string | null;
  created_at?: string;
  updated_at?: string;
  attachments?: ProposalAttachment[];
}

export interface ProposalOptionItem {
  id: number;
  name: string;
}

export interface ProposalOptionsData {
  ppc_operations?: ProposalOptionItem[];
  services: ProposalOptionItem[];
  main_purposes: ProposalOptionItem[];
  commercial_approaches: ProposalOptionItem[];
}

export interface ProposalOptionsResponse {
  success: boolean;
  message?: string;
  data: ProposalOptionsData;
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
  requested_by?: { id: number; name: string };
  generated_content?: GeneratedContent;
  created_at?: string;
}

export interface GeneratedProposal extends GeneratedContent {
  id: number | string;
  lead_id: number | string;
  services?: ProposalOptionItem[];
  main_purpose?: ProposalOptionItem;
  commercial_approach?: ProposalOptionItem;
  attachments?: ProposalAttachment[];
}

export interface StoreProposalRequestResponse {
  success: boolean;
  message?: string;
  proposal: GeneratedProposal;
}

export interface ProposalRequestContentResponse {
  success: boolean;
  message?: string;
  generated_content: GeneratedContent;
}
