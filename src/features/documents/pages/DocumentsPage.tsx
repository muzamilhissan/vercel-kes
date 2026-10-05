import { useMemo, useState } from 'react';
import { Folder, UploadCloud } from 'lucide-react';
import { useGlobalSearch } from '@/shared/hooks/useGlobalSearch';
import { usePagination } from '@/shared/hooks/usePagination';
import { Button, Combobox, ConfirmDialog, ErrorState, Loader, PageHeader, Pagination } from '@/shared/ui';
import { useDocumentTypeList } from '@/features/document-types/hooks/useDocumentTypes';
import { DocumentCard } from '../components/DocumentCard';
import { UploadDocumentModal } from '../components/UploadDocumentModal';
import { useDocumentPermissions, useDocuments } from '../hooks/useDocuments';
import type { CompanyDocument } from '../types';

const ALL_TYPES = '';

export default function DocumentsPage() {
  const { query: search } = useGlobalSearch();
  const { page, setPage } = usePagination();
  const [typeFilter, setTypeFilter] = useState(ALL_TYPES);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<CompanyDocument | null>(null);

  const { canUpload, canDelete } = useDocumentPermissions();

  const typesQuery = useDocumentTypeList({ page: 1, perPage: 100 });
  const typeOptions = useMemo(
    () => [
      { value: ALL_TYPES, label: 'All document types' },
      ...(typesQuery.data?.items ?? []).map((type) => ({ value: String(type.id), label: type.name })),
    ],
    [typesQuery.data?.items],
  );

  const { query, isLoading, documents, totalPages, totalItems, perPage, upload, remove } = useDocuments({
    page,
    documentTypeId: typeFilter || undefined,
  });

  const visible = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) return documents;
    return documents.filter(
      (document) =>
        document.original_filename.toLowerCase().includes(needle) ||
        (document.description ?? '').toLowerCase().includes(needle) ||
        (document.document_type?.name ?? '').toLowerCase().includes(needle),
    );
  }, [documents, search]);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    await remove.mutateAsync(pendingDelete).then(() => setPendingDelete(null), () => {});
  };

  return (
    <>
      <PageHeader
        title="Document Management"
        subtitle="Company profile, BEE, ISO certificates and registration documents."
        actions={
          <>
            <div className="min-w-[13rem]">
              <Combobox
                options={typeOptions}
                value={typeFilter}
                onChange={(next) => {
                  setTypeFilter(next);
                  setPage(1);
                }}
                placeholder="Filter by type"
                disabled={typesQuery.isPending}
              />
            </div>
            {canUpload && (
              <Button onClick={() => setIsUploadOpen(true)}>
                <UploadCloud size={16} />
                Upload Document
              </Button>
            )}
          </>
        }
      />

      {isLoading ? (
        <Loader message="Loading documents..." />
      ) : query.isError ? (
        <ErrorState message={query.error.message || 'Failed to load documents.'} onRetry={() => query.refetch()} />
      ) : visible.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line py-20 text-center">
          <Folder size={48} className="text-ink-subtle" />
          <h3 className="text-lg font-bold text-ink">No documents found</h3>
          <p className="text-sm text-ink-muted">
            {search || typeFilter
              ? 'No documents match your search criteria.'
              : 'The company library is currently empty.'}
          </p>
          {canUpload && !search && !typeFilter && (
            <Button onClick={() => setIsUploadOpen(true)}>
              <UploadCloud size={16} />
              Upload the first document
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                canDelete={canDelete}
                onDelete={setPendingDelete}
              />
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={totalItems}
            perPage={perPage}
            onPageChange={setPage}
          />
        </>
      )}

      <UploadDocumentModal
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        onSubmit={(input) => upload.mutateAsync(input)}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete Document"
        destructive
        confirmLabel="Delete"
        isPending={remove.isPending}
        onConfirm={confirmDelete}
        message={
          <>
            Are you sure you want to delete{' '}
            <strong className="text-ink">{pendingDelete?.original_filename}</strong>? This action cannot be undone.
          </>
        }
      />
    </>
  );
}
