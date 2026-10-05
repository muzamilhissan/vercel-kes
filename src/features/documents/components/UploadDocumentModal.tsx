import { useEffect, useMemo, useRef, useState } from 'react';
import { FileText, UploadCloud, X } from 'lucide-react';
import { Button, Combobox, Field, Modal, Textarea } from '@/shared/ui';
import { cn } from '@/shared/lib/cn';
import { formatFileSize } from '@/shared/lib/file';
import { useDocumentTypeList } from '@/features/document-types/hooks/useDocumentTypes';
import { MAX_UPLOAD_BYTES } from '../hooks/useDocuments';
import type { UploadDocumentInput } from '../types';

interface UploadDocumentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: UploadDocumentInput) => Promise<unknown>;
}

export function UploadDocumentModal({ open, onOpenChange, onSubmit }: UploadDocumentModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [documentTypeId, setDocumentTypeId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const typesQuery = useDocumentTypeList({ page: 1, perPage: 100 });
  const typeOptions = useMemo(
    () => (typesQuery.data?.items ?? []).map((type) => ({ value: String(type.id), label: type.name })),
    [typesQuery.data?.items],
  );

  useEffect(() => {
    if (!open) return;
    setDocumentTypeId('');
    setFile(null);
    setDescription('');
    setError('');
  }, [open]);

  const pickFile = (next: File | undefined) => {
    if (!next) return;
    if (next.size > MAX_UPLOAD_BYTES) {
      setError('File exceeds the 10MB limit.');
      return;
    }
    setError('');
    setFile(next);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!documentTypeId) return setError('Select a document type first.');
    if (!file) return setError('Choose a file to upload.');

    setIsSubmitting(true);
    try {
      await onSubmit({ document_type_id: documentTypeId, file, description: description.trim() || undefined });
      onOpenChange(false);
    } catch {
      // The mutation reports the failure; keep the form open so the selection is not lost.
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Upload Document"
      description="Pick the document type, then choose the file."
      dismissible={!isSubmitting}
      footer={
        <>
          <Button variant="subtle" disabled={isSubmitting} onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button form="upload-document-form" type="submit" disabled={isSubmitting || !documentTypeId || !file}>
            {isSubmitting ? 'Uploading...' : 'Upload'}
          </Button>
        </>
      }
    >
      <form id="upload-document-form" onSubmit={submit} className="flex flex-col gap-4 sm:gap-5" noValidate>
        <Field
          label="Document Type"
          required
          error={!documentTypeId && error ? error : undefined}
          hint={typeOptions.length === 0 && !typesQuery.isPending ? 'No document types configured yet.' : undefined}
        >
          {(field) => (
            <Combobox
              {...field}
              options={typeOptions}
              value={documentTypeId}
              onChange={(next) => {
                setDocumentTypeId(next);
                setError('');
              }}
              placeholder={typesQuery.isPending ? 'Loading types...' : 'Select document type'}
              disabled={isSubmitting || typesQuery.isPending || typeOptions.length === 0}
            />
          )}
        </Field>

        <Field label="File" required error={documentTypeId && error ? error : undefined}>
          {() => (
            <>
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                disabled={!documentTypeId || isSubmitting}
                onChange={(event) => {
                  pickFile(event.target.files?.[0]);
                  event.target.value = '';
                }}
              />
              {file ? (
                <div className="flex items-center gap-3 rounded-xl border border-line bg-surface-muted px-3.5 py-2.5">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand">
                    <FileText size={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ink">{file.name}</span>
                    <span className="block text-xs text-ink-muted">{formatFileSize(file.size)}</span>
                  </span>
                  <button
                    type="button"
                    aria-label="Remove selected file"
                    disabled={isSubmitting}
                    onClick={() => setFile(null)}
                    className="grid size-8 place-items-center rounded-lg text-ink-muted transition-colors hover:bg-field hover:text-ink"
                  >
                    <X size={15} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={!documentTypeId || isSubmitting}
                  onClick={() => inputRef.current?.click()}
                  className={cn(
                    'flex flex-col items-center gap-1.5 rounded-xl border border-dashed border-line px-4 py-6 text-center transition-colors',
                    documentTypeId && !isSubmitting
                      ? 'cursor-pointer hover:border-brand hover:bg-brand-50/40'
                      : 'cursor-not-allowed opacity-60',
                  )}
                >
                  <UploadCloud size={22} className="text-brand" />
                  <span className="text-sm font-semibold text-ink">
                    {documentTypeId ? 'Choose a file' : 'Select a document type first'}
                  </span>
                  <span className="text-xs text-ink-muted">Up to 10MB</span>
                </button>
              )}
            </>
          )}
        </Field>

        <Field label="Description">
          {(field) => (
            <Textarea
              {...field}
              rows={2}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What this document is for..."
              disabled={isSubmitting}
            />
          )}
        </Field>
      </form>
    </Modal>
  );
}
