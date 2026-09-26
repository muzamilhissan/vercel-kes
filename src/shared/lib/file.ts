import { File, FileArchive, FileText, Image, Video, type LucideIcon } from 'lucide-react';

const SIZE_UNITS = ['Bytes', 'KB', 'MB', 'GB'];

export function formatFileSize(bytes: number | undefined | null): string {
  if (bytes == null || Number.isNaN(bytes)) return 'Unknown size';
  if (bytes === 0) return '0 Bytes';
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), SIZE_UNITS.length - 1);
  return `${parseFloat((bytes / 1024 ** exponent).toFixed(1))} ${SIZE_UNITS[exponent]}`;
}

const ICONS_BY_EXTENSION: Array<{ extensions: string[]; icon: LucideIcon; className: string }> = [
  { extensions: ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'], icon: Image, className: 'text-pink-500' },
  { extensions: ['pdf'], icon: FileText, className: 'text-red-500' },
  { extensions: ['doc', 'docx', 'txt', 'rtf'], icon: FileText, className: 'text-blue-500' },
  { extensions: ['zip', 'rar', 'tar', 'gz', '7z'], icon: FileArchive, className: 'text-amber-500' },
  { extensions: ['mp4', 'mov', 'avi', 'mkv'], icon: Video, className: 'text-emerald-500' },
  { extensions: ['xls', 'xlsx', 'csv'], icon: FileText, className: 'text-emerald-500' },
];

const FALLBACK = { icon: File, className: 'text-ink-muted' };

/** Icon and colour for a file, chosen from its extension. */
export function fileIconFor(filename: string | undefined) {
  const extension = filename?.split('.').pop()?.toLowerCase();
  if (!extension) return FALLBACK;
  return ICONS_BY_EXTENSION.find((entry) => entry.extensions.includes(extension)) ?? FALLBACK;
}

/** Trigger a browser download for a URL or blob without navigating away. */
export function triggerDownload(href: string, filename: string, revoke = false) {
  const anchor = document.createElement('a');
  anchor.href = href;
  anchor.download = filename;
  anchor.rel = 'noopener noreferrer';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  if (revoke) URL.revokeObjectURL(href);
}
