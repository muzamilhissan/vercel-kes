import { useRef } from 'react';
import { FileText, Paperclip, X } from 'lucide-react';
import { Button } from '@/shared/ui';
import { toast } from '@/shared/toast';
import { formatFileSize } from '@/shared/lib/file';
import type { CompanyDocument } from '@/features/documents/types';

const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;

interface ProposalAttachmentsProps {
  files: File[];
  libraryDocs: CompanyDocument[];
  disabled: boolean;
  onAddFiles: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
  onRemoveLibraryDoc: (id: string | number) => void;
  onBrowseLibrary: () => void;
}

function AttachmentRow({ icon, name, size, disabled, onRemove }: {
  icon: React.ReactNode;
  name: string;
  size?: string;
  disabled: boolean;
  onRemove: () => void;
}) {
  return (
    <li className="flex items-center gap-2 rounded-lg bg-surface-muted px-3 py-2 text-label">
      {icon}
      <span className="min-w-0 flex-1 truncate text-ink">{name}</span>
      {size && <span className="shrink-0 text-ink-muted">{size}</span>}
      <button
        type="button"
        aria-label={`Remove ${name}`}
        disabled={disabled}
        onClick={onRemove}
        className="shrink-0 text-ink-subtle hover:text-red-500 disabled:opacity-50"
      >
        <X size={14} />
      </button>
    </li>
  );
}

export function ProposalAttachments({
  files,
  libraryDocs,
  disabled,
  onAddFiles,
  onRemoveFile,
  onRemoveLibraryDoc,
  onBrowseLibrary,
}: ProposalAttachmentsProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptFiles = (picked: File[]) => {
    const valid = picked.filter((file) => file.size <= MAX_ATTACHMENT_BYTES);
    if (valid.length !== picked.length) toast.error('Some files exceed the 10MB limit and were removed.');
    if (valid.length > 0) onAddFiles(valid);
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-label font-bold uppercase tracking-wide text-slate-600">
        Attach additional documents (optional)
      </label>

      <div className="flex items-stretch gap-3">
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(event) => {
            acceptFiles(Array.from(event.target.files ?? []));
            event.target.value = '';
          }}
        />
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="flex flex-1 items-center gap-3 rounded-xl border border-line bg-surface-muted p-2 text-left text-sm disabled:opacity-60"
        >
          <span className="rounded-lg bg-field px-3 py-1.5 font-semibold text-slate-700">Choose Files</span>
          <span className="truncate text-ink-muted">
            {files.length > 0 ? `${files.length} file(s) selected` : 'No file chosen'}
          </span>
        </button>

        <Button variant="secondary" disabled={disabled} onClick={onBrowseLibrary}>
          <FileText size={16} />
          Browse Library
        </Button>
      </div>

      {(files.length > 0 || libraryDocs.length > 0) && (
        <ul className="flex flex-col gap-1.5">
          {files.map((file, index) => (
            <AttachmentRow
              key={`${file.name}-${index}`}
              icon={<Paperclip size={14} className="shrink-0 text-ink-muted" />}
              name={file.name}
              size={formatFileSize(file.size)}
              disabled={disabled}
              onRemove={() => onRemoveFile(index)}
            />
          ))}
          {libraryDocs.map((doc) => (
            <AttachmentRow
              key={`library-${doc.id}`}
              icon={<FileText size={14} className="shrink-0 text-brand" />}
              name={`${doc.original_filename} (Library)`}
              size={doc.file_size ? formatFileSize(doc.file_size) : undefined}
              disabled={disabled}
              onRemove={() => onRemoveLibraryDoc(doc.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
