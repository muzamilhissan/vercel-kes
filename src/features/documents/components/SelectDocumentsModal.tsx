import { useEffect, useMemo, useState } from 'react';
import { CheckCircle, FileText, Search } from 'lucide-react';
import { Button, CONTROL_BASE, Loader, Modal } from '@/shared/ui';
import { cn } from '@/shared/lib/cn';
import { formatFileSize } from '@/shared/lib/file';
import { toast } from '@/shared/toast';
import { useDocuments } from '../hooks/useDocuments';
import type { CompanyDocument } from '../types';

interface SelectDocumentsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (documents: CompanyDocument[]) => void;
  maxSelections?: number;
}

/** Pick documents from the company library to attach to a proposal. */
export function SelectDocumentsModal({
  open,
  onOpenChange,
  onSelect,
  maxSelections = 5,
}: SelectDocumentsModalProps) {
  const { query, isLoading } = useDocuments(open);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());

  useEffect(() => {
    if (open) {
      setSelectedIds(new Set());
      setSearch('');
    }
  }, [open]);

  const documents = query.data ?? [];
  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return needle ? documents.filter((doc) => doc.file_name.toLowerCase().includes(needle)) : documents;
  }, [documents, search]);

  const toggle = (id: string | number) =>
    setSelectedIds((previous) => {
      const next = new Set(previous);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size >= maxSelections) {
        toast.error(`You can select up to ${maxSelections} documents.`);
        return previous;
      } else {
        next.add(id);
      }
      return next;
    });

  const confirm = () => {
    onSelect(documents.filter((doc) => selectedIds.has(doc.id)));
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Select Company Documents"
      size="lg"
      footer={
        <>
          <Button variant="subtle" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={selectedIds.size === 0} onClick={confirm}>
            Attach Selected ({selectedIds.size})
          </Button>
        </>
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative min-w-[15rem] flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-subtle" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search library..."
            className={cn(CONTROL_BASE, 'pl-10')}
          />
        </div>
        <span className="text-label font-semibold text-ink-muted">
          {selectedIds.size} / {maxSelections} selected
        </span>
      </div>

      {isLoading ? (
        <Loader message="Loading library..." className="h-[12.5rem]" />
      ) : filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-ink-muted">No documents found.</p>
      ) : (
        <ul className="scrollbar-thin flex max-h-[22.5rem] flex-col gap-2 overflow-y-auto">
          {filtered.map((doc) => {
            const isSelected = selectedIds.has(doc.id);
            return (
              <li key={doc.id}>
                <button
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => toggle(doc.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all',
                    isSelected ? 'border-brand bg-brand-50' : 'border-line bg-surface hover:border-brand/40',
                  )}
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-field text-brand">
                    <FileText size={24} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-ink" title={doc.file_name}>
                      {doc.file_name}
                    </span>
                    <span className="block text-xs text-ink-muted">{formatFileSize(doc.file_size)}</span>
                  </span>
                  <span
                    className={cn(
                      'grid size-6 shrink-0 place-items-center rounded-full border-2',
                      isSelected ? 'border-brand bg-brand text-white' : 'border-line',
                    )}
                  >
                    {isSelected && <CheckCircle size={16} />}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Modal>
  );
}
