import type { User } from '@/shared/types/api';

export interface CompanyDocument {
  id: string | number;
  file_name: string;
  file_path: string;
  signedUrl?: string;
  signed_url?: string;
  file_size?: number;
  mime_type?: string;
  uploaded_by?: User | number | string;
  created_at?: string;
  updated_at?: string;
}
