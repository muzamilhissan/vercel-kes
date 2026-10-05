import { Download, Eye, FileText, Trash2 } from 'lucide-react';
import { Badge, IconButton } from '@/shared/ui';
import { formatFileSize } from '@/shared/lib/file';
import { documentUrl } from '../hooks/useDocuments';
import type { CompanyDocument } from '../types';

interface DocumentCardProps {
  document: CompanyDocument;
  canDelete: boolean;
  onDelete: (document: CompanyDocument) => void;
}

export function DocumentCard({ document, canDelete, onDelete }: DocumentCardProps) {
  const url = documentUrl(document);
  const typeName = document.document_type?.name;

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5 transition-shadow hover:shadow-panel">
      <div className="flex items-start justify-between gap-3">
        <span className="grid size-14 place-items-center rounded-2xl bg-brand-50 text-brand">
          <FileText size={32} />
        </span>
        {typeName && <Badge tone="brand">{typeName}</Badge>}
      </div>

      <div className="min-w-0 flex-1">
        <h4 title={document.original_filename} className="truncate text-sm font-bold text-ink">
          {document.original_filename}
        </h4>
        <p className="mt-0.5 text-xs text-ink-muted">
          {document.file_size_formatted || formatFileSize(document.file_size ?? 0)}
        </p>
        {document.description && (
          <p className="mt-1.5 line-clamp-2 text-xs text-ink-muted" title={document.description}>
            {document.description}
          </p>
        )}
        {document.uploader?.name && (
          <p className="mt-1.5 text-2xs text-ink-subtle">Uploaded by {document.uploader.name}</p>
        )}
      </div>

      <div className="flex gap-2">
        {url && (
          <>
            <IconButton asChild label={`View ${document.original_filename}`}>
              <a href={url} target="_blank" rel="noopener noreferrer">
                <Eye size={16} />
              </a>
            </IconButton>
            <IconButton asChild label={`Download ${document.original_filename}`}>
              <a href={url} download={document.original_filename}>
                <Download size={16} />
              </a>
            </IconButton>
          </>
        )}
        {canDelete && (
          <IconButton
            label={`Delete ${document.original_filename}`}
            className="text-red-500"
            onClick={() => onDelete(document)}
          >
            <Trash2 size={16} />
          </IconButton>
        )}
      </div>
    </article>
  );
}
