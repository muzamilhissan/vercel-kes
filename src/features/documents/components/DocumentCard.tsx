import { Download, Eye, Trash2 } from 'lucide-react';
import { FileText } from 'lucide-react';
import { IconButton } from '@/shared/ui';
import { formatFileSize } from '@/shared/lib/file';
import { documentUrl } from '../hooks/useDocuments';
import type { CompanyDocument } from '../types';

interface DocumentCardProps {
  document: CompanyDocument;
  canManage: boolean;
  onDelete: (document: CompanyDocument) => void;
}

export function DocumentCard({ document, canManage, onDelete }: DocumentCardProps) {
  const url = documentUrl(document);

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5 transition-shadow hover:shadow-panel">
      <span className="grid size-14 place-items-center rounded-2xl bg-brand-50 text-brand">
        <FileText size={32} />
      </span>

      <div className="min-w-0 flex-1">
        <h4 title={document.file_name} className="truncate text-sm font-bold text-ink">
          {document.file_name}
        </h4>
        <p className="mt-0.5 text-xs text-ink-muted">{formatFileSize(document.file_size)}</p>
      </div>

      <div className="flex gap-2">
        {url && (
          <>
            <IconButton asChild label="View document">
              <a href={url} target="_blank" rel="noopener noreferrer">
                <Eye size={16} />
              </a>
            </IconButton>
            <IconButton asChild label="Download document">
              <a href={url} download={document.file_name}>
                <Download size={16} />
              </a>
            </IconButton>
          </>
        )}
        {canManage && (
          <IconButton label="Delete document" className="text-red-500" onClick={() => onDelete(document)}>
            <Trash2 size={16} />
          </IconButton>
        )}
      </div>
    </article>
  );
}
