import { useRef, useState } from 'react';
import { Loader2, Upload } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

interface UploadZoneProps {
  isUploading: boolean;
  onUpload: (file: File) => void;
}

/** Click-or-drop target for a single file upload. */
export function UploadZone({ isUploading, onUpload }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) onUpload(file);
  };

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={cn(
        'cursor-pointer rounded-xl border-2 border-dashed px-4 py-5 text-center transition-all',
        isDragging ? 'border-brand bg-brand/5' : 'border-slate-300 bg-surface-muted',
      )}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onUpload(file);
          event.target.value = '';
        }}
      />

      {isUploading ? (
        <div className="flex flex-col items-center gap-2">
          <Loader2 size={24} className="animate-spin text-brand" />
          <span className="text-label font-semibold text-brand">Uploading attachment...</span>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-1.5">
          <Upload size={24} className={isDragging ? 'text-brand' : 'text-ink-muted'} />
          <span className="text-label font-semibold text-ink">
            {isDragging ? 'Drop file here' : 'Drag & drop file or click to browse'}
          </span>
          <span className="text-2xs text-ink-muted">Supports PDF, PNG, JPG, Docx, etc.</span>
        </div>
      )}
    </div>
  );
}
