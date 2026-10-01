export interface DocumentType {
  id: string | number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateDocumentTypeInput {
  name: string;
}

export type UpdateDocumentTypeInput = Partial<CreateDocumentTypeInput>;
