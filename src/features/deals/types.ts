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

export type UpdateDealInput = Partial<CreateDealInput>;

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
