import { CheckCircle2, ExternalLink, FileText, Info } from 'lucide-react';
import { Field, Input, Textarea } from '@/shared/ui';
import type { CompanyDocument } from '@/features/documents/types';
import { ProposalAttachments } from './ProposalAttachments';

export const CONTENT_LIMIT = 2000;

export interface ProposalDraft {
  subject: string;
  content: string;
  files: File[];
  libraryDocs: CompanyDocument[];
}

interface ProposalReviewStepProps {
  draft: ProposalDraft;
  onChange: (next: ProposalDraft) => void;
  isSubmitting: boolean;
  generatedPdfUrl: string | null;
  proposalLabel: string;
  onBrowseLibrary: () => void;
}

export function ProposalReviewStep({
  draft,
  onChange,
  isSubmitting,
  generatedPdfUrl,
  proposalLabel,
  onBrowseLibrary,
}: ProposalReviewStepProps) {
  const atLimit = draft.content.length >= CONTENT_LIMIT;
  const patch = (changes: Partial<ProposalDraft>) => onChange({ ...draft, ...changes });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" />
        <div className="text-sm">
          <strong className="block text-emerald-900">{proposalLabel} generated successfully!</strong>
          <span className="text-emerald-700">
            Review and tailor the subject line and content below. You can also attach supporting files before sending.
          </span>
        </div>
      </div>

      <Field label="Subject" required>
        {(field) => (
          <Input
            {...field}
            value={draft.subject}
            onChange={(event) => patch({ subject: event.target.value })}
            placeholder="Enter proposal subject..."
            disabled={isSubmitting}
          />
        )}
      </Field>

      <Field label="Proposal Content" required>
        {(field) => (
          <>
            <Textarea
              {...field}
              value={draft.content}
              onChange={(event) => patch({ content: event.target.value })}
              rows={10}
              maxLength={CONTENT_LIMIT}
              placeholder="Write your proposal content here..."
              disabled={isSubmitting}
            />
            <div className="mt-1 flex items-center justify-between text-2xs font-medium">
              <span className="flex items-center gap-1 text-emerald-600">
                <CheckCircle2 size={14} /> Ready to send.
              </span>
              <span className={atLimit ? 'text-red-500' : 'text-ink-muted'}>
                {atLimit ? `Maximum character limit reached — ` : ''}
                {draft.content.length}/{CONTENT_LIMIT}
              </span>
            </div>
          </>
        )}
      </Field>

      {generatedPdfUrl && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface-muted p-4">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-brand-50 text-brand">
              <FileText size={20} />
            </span>
            <div>
              <p className="text-sm font-bold text-ink">Generated Proposal Document (PDF)</p>
              <p className="text-xs text-ink-muted">Automated proposal synthesized from requirements</p>
            </div>
          </div>
          <a
            href={generatedPdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
          >
            <ExternalLink size={14} /> View / Download PDF
          </a>
        </div>
      )}

      <ProposalAttachments
        files={draft.files}
        libraryDocs={draft.libraryDocs}
        disabled={isSubmitting}
        onAddFiles={(added) => patch({ files: [...draft.files, ...added] })}
        onRemoveFile={(index) => patch({ files: draft.files.filter((_, i) => i !== index) })}
        onRemoveLibraryDoc={(id) => patch({ libraryDocs: draft.libraryDocs.filter((doc) => doc.id !== id) })}
        onBrowseLibrary={onBrowseLibrary}
      />

      <p className="flex items-center gap-2 rounded-xl bg-sky-50 p-3 text-label text-sky-800">
        <Info size={16} className="shrink-0" />
        This email will be tracked. Lead will automatically move to Proposed stage.
      </p>
    </div>
  );
}
