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

export type UpdateAccountInput = Partial<CreateAccountInput>;
