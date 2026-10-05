import type { DocumentType } from '@/features/document-types/types';

export interface DocumentUploader {
  id: number | string;
  name: string;
  email?: string;
}

export interface CompanyDocument {
  id: string | number;
  document_type_id: number | string;
  document_type?: DocumentType | null;
  original_filename: string;
  stored_filename?: string;
  s3_path?: string;
  signed_url?: string;
  file_size?: number;
  file_size_formatted?: string;
  mime_type?: string;
  description?: string | null;
  uploaded_by?: number | string;
  uploader?: DocumentUploader | null;
  created_at?: string;
  updated_at?: string;
}

export interface UploadDocumentInput {
  document_type_id: number | string;
  file: File;
  description?: string;
}

export interface UpdateDocumentInput {
  description?: string;
  file?: File | null;
}
