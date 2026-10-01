import { Edit2, Trash2 } from 'lucide-react';
import { DataTable, IconButton, useSortable, type Column } from '@/shared/ui';
import { formatDate } from '@/shared/lib/format';
import type { DocumentType } from '../types';

type SortKey = 'name' | 'created_at';

const ACCESSORS: Record<SortKey, (documentType: DocumentType) => string> = {
  name: (documentType) => (documentType.name ?? '').toLowerCase(),
  created_at: (documentType) => documentType.created_at ?? '',
};

interface DocumentTypeTableProps {
  documentTypes: DocumentType[];
  isLoading: boolean;
  onEdit: (documentType: DocumentType) => void;
  onDelete: (documentType: DocumentType) => void;
}

export function DocumentTypeTable({ documentTypes, isLoading, onEdit, onDelete }: DocumentTypeTableProps) {
  const { sorted, sort, toggle } = useSortable<DocumentType, SortKey>(documentTypes, ACCESSORS);

  const columns: Column<DocumentType>[] = [
    {
      id: 'name',
      header: 'Name',
      sortable: true,
      cell: (documentType) => <span className="font-semibold">{documentType.name}</span>,
    },
    {
      id: 'created_at',
      header: 'Created',
      sortable: true,
      className: 'text-ink-muted',
      cell: (documentType) => formatDate(documentType.created_at),
    },
    {
      id: 'actions',
      header: 'Actions',
      headerClassName: 'text-center',
      cell: (documentType) => (
        <div className="flex justify-center gap-2">
          <IconButton label={`Edit ${documentType.name}`} onClick={() => onEdit(documentType)}>
            <Edit2 size={16} />
          </IconButton>
          <IconButton
            label={`Delete ${documentType.name}`}
            className="text-red-500"
            onClick={() => onDelete(documentType)}
          >
            <Trash2 size={16} />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={sorted}
      rowKey={(documentType) => documentType.id}
      isLoading={isLoading}
      sort={sort}
      onSort={(key) => toggle(key as SortKey)}
      emptyMessage='No document types yet. Click "Add Document Type" to create one.'
    />
  );
}
