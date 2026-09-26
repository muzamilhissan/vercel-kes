import { useEffect, useState } from 'react';
import { Loader2, Paperclip, Save, X } from 'lucide-react';
import { Button, Field, Input, Modal, Textarea } from '@/shared/ui';
import { toast } from '@/shared/toast';
import { formatFileSize } from '@/shared/lib/file';
import { SelectDocumentsModal } from '@/features/documents/components/SelectDocumentsModal';
import type { CompanyDocument } from '@/features/documents/types';
import { useProposals } from '../hooks/useProposals';
import { ProposalAttachments } from './ProposalAttachments';
import { CONTENT_LIMIT } from './ProposalReviewStep';
import type { Proposal, ProposalAttachment } from '../types';

interface EditProposalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proposal: Proposal | null;
  leadId: string | number;
  onSuccess: () => void;
}

export function EditProposalModal({ open, onOpenChange, proposal, leadId, onSuccess }: EditProposalModalProps) {
  const { update } = useProposals(leadId);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [keptAttachments, setKeptAttachments] = useState<ProposalAttachment[]>([]);
  const [removedIds, setRemovedIds] = useState<(string | number)[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [libraryDocs, setLibraryDocs] = useState<CompanyDocument[]>([]);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  useEffect(() => {
    if (!open || !proposal) return;
    setSubject(proposal.subject);
    setContent(proposal.content);
    setKeptAttachments(proposal.attachments ?? []);
    setRemovedIds([]);
    setFiles([]);
    setLibraryDocs([]);
  }, [open, proposal]);

  if (!proposal) return null;

  const removeExisting = (id: string | number) => {
    setKeptAttachments((current) => current.filter((attachment) => attachment.id !== id));
    setRemovedIds((current) => [...current, id]);
  };

  const submit = async () => {
    if (!subject.trim()) return toast.error('Subject is required');
    if (!content.trim()) return toast.error('Proposal Content is required');

    const body = new FormData();
    body.append('subject', subject);
    body.append('content', content);
    body.append('existing_attachments', keptAttachments.map((attachment) => attachment.id).join(','));
    body.append('deleted_attachments', removedIds.join(','));
    files.forEach((file) => body.append('attachments[]', file));
    libraryDocs.forEach((doc) => body.append('company_document_ids[]', String(doc.id)));

    await update.mutateAsync({ id: proposal.id, body });
    onSuccess();
  };

  return (
    <>
      <Modal
        open={open}
        onOpenChange={onOpenChange}
        title="Edit Proposal"
        size="lg"
        dismissible={!update.isPending}
        footer={
          <>
            <Button variant="subtle" disabled={update.isPending} onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button disabled={update.isPending} onClick={submit}>
              {update.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {update.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </>
        }
      >
        <Field label="Subject" required>
          {(field) => (
            <Input
              {...field}
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              disabled={update.isPending}
            />
          )}
        </Field>

        <Field label="Proposal Content" required>
          {(field) => (
            <>
              <Textarea
                {...field}
                value={content}
                rows={10}
                maxLength={CONTENT_LIMIT}
                onChange={(event) => setContent(event.target.value)}
                disabled={update.isPending}
              />
              <p className="mt-1 text-right text-2xs text-ink-muted">
                {content.length}/{CONTENT_LIMIT}
              </p>
            </>
          )}
        </Field>

        {keptAttachments.length > 0 && (
          <div className="flex flex-col gap-2">
            <h4 className="text-label font-bold uppercase tracking-wide text-slate-600">Current attachments</h4>
            <ul className="flex flex-col gap-1.5">
              {keptAttachments.map((attachment) => (
                <li
                  key={attachment.id}
                  className="flex items-center gap-2 rounded-lg bg-surface-muted px-3 py-2 text-label"
                >
                  <Paperclip size={14} className="shrink-0 text-ink-muted" />
                  <span className="min-w-0 flex-1 truncate text-ink">{attachment.file_name}</span>
                  {attachment.file_size && (
                    <span className="shrink-0 text-ink-muted">{formatFileSize(attachment.file_size)}</span>
                  )}
                  <button
                    type="button"
                    aria-label={`Remove ${attachment.file_name}`}
                    disabled={update.isPending}
                    onClick={() => removeExisting(attachment.id)}
                    className="shrink-0 text-ink-subtle hover:text-red-500 disabled:opacity-50"
                  >
                    <X size={14} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <ProposalAttachments
          files={files}
          libraryDocs={libraryDocs}
          disabled={update.isPending}
          onAddFiles={(added) => setFiles((current) => [...current, ...added])}
          onRemoveFile={(index) => setFiles((current) => current.filter((_, i) => i !== index))}
          onRemoveLibraryDoc={(id) => setLibraryDocs((current) => current.filter((doc) => doc.id !== id))}
          onBrowseLibrary={() => setIsLibraryOpen(true)}
        />
      </Modal>

      <SelectDocumentsModal
        open={isLibraryOpen}
        onOpenChange={setIsLibraryOpen}
        onSelect={(documents) =>
          setLibraryDocs((current) => {
            const existing = new Set(current.map((doc) => doc.id));
            return [...current, ...documents.filter((doc) => !existing.has(doc.id))];
          })
        }
      />
    </>
  );
}
