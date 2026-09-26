import { Download, Loader2, Trash2 } from 'lucide-react';
import { IconButton } from '@/shared/ui';
import { fileIconFor, formatFileSize } from '@/shared/lib/file';
import { formatDate } from '@/shared/lib/format';
import type { DealFile } from '../types';

interface AttachmentItemProps {
  file: DealFile;
  isDownloading: boolean;
  isDeleting: boolean;
  onDownload: (file: DealFile) => void;
  onDelete: (file: DealFile) => void;
}

export function AttachmentItem({ file, isDownloading, isDeleting, onDownload, onDelete }: AttachmentItemProps) {
  const { icon: Icon, className } = fileIconFor(file.file_name);
  const busy = isDownloading || isDeleting;

  return (
    <li className="flex items-center gap-3 rounded-xl border border-line bg-surface-muted px-3 py-2.5">
      <Icon size={18} className={`shrink-0 ${className}`} />

      <div className="min-w-0 flex-1">
        <p className="truncate text-label font-semibold text-ink">{file.file_name || 'Unnamed file'}</p>
        <p className="text-2xs text-ink-muted">
          {formatFileSize(file.file_size)}
          {file.created_at && ` • ${formatDate(file.created_at)}`}
        </p>
      </div>

      <div className="flex shrink-0 gap-1.5">
        <IconButton label="Download attachment" disabled={busy} onClick={() => onDownload(file)}>
          {isDownloading ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
        </IconButton>
        <IconButton label="Delete attachment" className="text-red-500" disabled={busy} onClick={() => onDelete(file)}>
          {isDeleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
        </IconButton>
      </div>
    </li>
  );
}
