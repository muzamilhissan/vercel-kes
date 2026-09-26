import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { ConfirmDialog, Loader, Pagination, useClientPagination } from '@/shared/ui';
import { useDealFiles } from '../hooks/useDealFiles';
import { AttachmentItem } from './AttachmentItem';
import { UploadZone } from './UploadZone';
import type { DealFile } from '../types';

function EmptyHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-xl border-[1.5px] border-dashed border-field py-6 text-center text-label italic text-ink-subtle">
      {children}
    </p>
  );
}

export function DealAttachments({ dealId }: { dealId: string | number }) {
  const { query, upload, remove, download } = useDealFiles(dealId);
  const [search, setSearch] = useState('');
  const [pendingDelete, setPendingDelete] = useState<DealFile | null>(null);

  const files = query.data ?? [];
  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return needle ? files.filter((file) => (file.file_name ?? '').toLowerCase().includes(needle)) : files;
  }, [files, search]);

  // Only surfaces once a deal accumulates more files than fit comfortably.
  const { page, setPage, totalPages, totalItems, perPage, pageItems } = useClientPagination(filtered);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    await remove.mutateAsync(pendingDelete);
    setPendingDelete(null);
  };

  return (
    <section className="flex flex-col gap-3 border-t border-field pt-4">
      <div className="flex items-center gap-2">
        <h4 className="text-2xs font-bold uppercase tracking-wide text-ink-muted">Attachments</h4>
        <span className="rounded-xl bg-field px-2 py-0.5 text-2xs font-bold text-slate-600">{files.length}</span>
      </div>

      {files.length > 0 && (
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-subtle" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search attachments..."
            className="w-full rounded-[0.625rem] border-[1.5px] border-line bg-surface-muted py-2.5 pl-10 pr-9 text-label outline-none transition-all focus:border-brand focus:bg-surface focus:shadow-[0_0_0_4px_rgb(112_48_159_/_0.06)]"
          />
          {search && (
            <button
              type="button"
              aria-label="Clear attachment search"
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink"
            >
              <X size={15} />
            </button>
          )}
        </div>
      )}

      <UploadZone isUploading={upload.isPending} onUpload={(file) => upload.mutate(file)} />

      {query.isPending ? (
        <Loader className="h-[7.5rem]" />
      ) : query.isError ? (
        <p className="rounded-lg bg-red-50 p-3 text-center text-label text-red-500">
          {query.error.message || 'Failed to load files'}
        </p>
      ) : files.length === 0 ? (
        <EmptyHint>No attachments uploaded yet.</EmptyHint>
      ) : filtered.length === 0 ? (
        <EmptyHint>No matching attachments found.</EmptyHint>
      ) : (
        <ul className="flex flex-col gap-2">
          {pageItems.map((file) => (
            <AttachmentItem
              key={file.id}
              file={file}
              isDownloading={download.isPending && download.variables?.id === file.id}
              isDeleting={remove.isPending && remove.variables?.id === file.id}
              onDownload={(target) => download.mutate(target)}
              onDelete={setPendingDelete}
            />
          ))}
        </ul>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        perPage={perPage}
        onPageChange={setPage}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete Attachment"
        destructive
        confirmLabel="Delete"
        isPending={remove.isPending}
        onConfirm={confirmDelete}
        message={
          <>
            Are you sure you want to delete{' '}
            <strong className="text-ink">{pendingDelete?.file_name || 'this file'}</strong>? This action cannot be
            undone.
          </>
        }
      />
    </section>
  );
}
