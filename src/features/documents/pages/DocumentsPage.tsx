import { useMemo, useRef, useState } from 'react';
import { Folder, Loader2, UploadCloud } from 'lucide-react';
import { useGlobalSearch } from '@/shared/hooks/useGlobalSearch';
import { session } from '@/shared/auth/session';
import { hasAnyPermission } from '@/shared/auth/permissions';
import { Button, ConfirmDialog, ErrorState, Loader, PageHeader, Pagination, useClientPagination } from '@/shared/ui';
import { DocumentCard } from '../components/DocumentCard';
import { useDocuments } from '../hooks/useDocuments';
import type { CompanyDocument } from '../types';

export default function DocumentsPage() {
  const { query: search } = useGlobalSearch();
  const { query, upload, remove } = useDocuments();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pendingDelete, setPendingDelete] = useState<CompanyDocument | null>(null);

  const canManage = hasAnyPermission(session.getUser(), ['Manage Company Documents', 'admin']);

  const documents = useMemo(() => {
    const needle = search.trim().toLowerCase();
    const items = query.data ?? [];
    return needle ? items.filter((document) => document.file_name.toLowerCase().includes(needle)) : items;
  }, [query.data, search]);

  // The document endpoint returns the whole library, so page it in memory.
  const { page, setPage, totalPages, totalItems, perPage, pageItems } = useClientPagination(documents, 12);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    await remove.mutateAsync(pendingDelete);
    setPendingDelete(null);
  };

  return (
    <>
      <PageHeader
        title="Company Documents"
        subtitle="Browse and manage standard company documents, brochures, and templates."
        actions={
          canManage && (
            <>
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) upload.mutate(file);
                  event.target.value = '';
                }}
              />
              <Button disabled={upload.isPending} onClick={() => inputRef.current?.click()}>
                {upload.isPending ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                {upload.isPending ? 'Uploading...' : 'Upload Document'}
              </Button>
            </>
          )
        }
      />

      {query.isPending ? (
        <Loader message="Loading documents..." />
      ) : query.isError ? (
        <ErrorState message={query.error.message || 'Failed to load documents.'} onRetry={() => query.refetch()} />
      ) : documents.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line py-20 text-center">
          <Folder size={48} className="text-ink-subtle" />
          <h3 className="text-lg font-bold text-ink">No documents found</h3>
          <p className="text-sm text-ink-muted">
            {search ? 'No documents match your search criteria.' : 'The company library is currently empty.'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pageItems.map((document) => (
              <DocumentCard key={document.id} document={document} canManage={canManage} onDelete={setPendingDelete} />
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
            Are you sure you want to delete <strong className="text-ink">{pendingDelete?.file_name}</strong>?
          </>
        }
      />
    </>
  );
}
