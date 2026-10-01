import { useState } from 'react';
import { Plus } from 'lucide-react';
import { DEFAULT_PER_PAGE } from '@/shared/api/crud';
import { Button, ConfirmDialog, ErrorState, Pagination } from '@/shared/ui';
import { usePagination } from '@/shared/hooks/usePagination';
import {
  useCreateDocumentType,
  useDeleteDocumentType,
  useDocumentTypeList,
  useUpdateDocumentType,
} from '../hooks/useDocumentTypes';
import { DocumentTypeFormModal } from './DocumentTypeFormModal';
import { DocumentTypeTable } from './DocumentTypeTable';
import type { CreateDocumentTypeInput, DocumentType } from '../types';

type OpenDialog = 'form' | 'delete' | null;

export function DocumentTypesPanel() {
  const { page, setPage } = usePagination();
  const [dialog, setDialog] = useState<OpenDialog>(null);
  const [selected, setSelected] = useState<DocumentType | null>(null);

  const { data, isPending, isError, error, refetch } = useDocumentTypeList({ page });
  const createDocumentType = useCreateDocumentType();
  const updateDocumentType = useUpdateDocumentType();
  const deleteDocumentType = useDeleteDocumentType();

  const openDialog = (next: OpenDialog, documentType: DocumentType | null) => {
    setSelected(documentType);
    setDialog(next);
  };

  const handleSubmit = (input: CreateDocumentTypeInput) =>
    selected
      ? updateDocumentType.mutateAsync({ id: selected.id, input })
      : createDocumentType.mutateAsync(input);

  const handleDelete = async () => {
    if (!selected) return;
    await deleteDocumentType.mutateAsync(selected.id).then(() => setDialog(null), () => {});
  };

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-muted">
          Categories available when uploading a document.
        </p>
        <Button onClick={() => openDialog('form', null)}>
          <Plus size={16} />
          Add Document Type
        </Button>
      </div>

      {isError ? (
        <ErrorState message={error.message || 'Failed to fetch document types.'} onRetry={() => refetch()} />
      ) : (
        <>
          <DocumentTypeTable
            documentTypes={data?.items ?? []}
            isLoading={isPending}
            onEdit={(documentType) => openDialog('form', documentType)}
            onDelete={(documentType) => openDialog('delete', documentType)}
          />
          <Pagination
            page={page}
            totalPages={data?.totalPages ?? 1}
            totalItems={data?.totalItems ?? 0}
            perPage={DEFAULT_PER_PAGE}
            onPageChange={setPage}
          />
        </>
      )}

      <DocumentTypeFormModal
        open={dialog === 'form'}
        onOpenChange={(open) => !open && setDialog(null)}
        documentType={selected}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={dialog === 'delete'}
        onOpenChange={(open) => !open && setDialog(null)}
        title="Delete Document Type"
        destructive
        confirmLabel="Delete"
        isPending={deleteDocumentType.isPending}
        onConfirm={handleDelete}
        message={
          <>
            Are you sure you want to delete <strong className="text-ink">{selected?.name}</strong>? This action
            cannot be undone.
          </>
        }
      />
    </>
  );
}
