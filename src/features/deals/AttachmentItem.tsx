import React from 'react';
import { 
  Download, Trash2, ExternalLink, 
  File, FileText, Image, Video, FileArchive, Loader2 
} from 'lucide-react';
import { DealFile } from '../../api/types';

interface AttachmentItemProps {
  file: DealFile;
  loadingSignedUrlId: string | number | null;
  downloadingId: string | number | null;
  deletingId: string | number | null;
  onOpenSignedUrl: (file: DealFile) => void;
  onDownload: (file: DealFile) => void;
  onDeleteClick: (file: DealFile) => void;
}

const formatFileSize = (bytes?: number): string => {
  if (bytes === undefined || bytes === null || isNaN(bytes)) return 'Unknown size';
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const formatDateString = (dateStr?: string): string => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateStr || '';
  }
};

const getFileIcon = (filename?: string) => {
  if (!filename) return <File size={18} style={{ color: '#64748b' }} />;
  const ext = filename.split('.').pop()?.toLowerCase();
  if (!ext) return <File size={18} style={{ color: '#64748b' }} />;
  
  if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext)) {
    return <Image size={18} style={{ color: '#ec4899' }} />;
  }
  if (['pdf'].includes(ext)) {
    return <FileText size={18} style={{ color: '#ef4444' }} />;
  }
  if (['doc', 'docx', 'txt', 'rtf'].includes(ext)) {
    return <FileText size={18} style={{ color: '#3b82f6' }} />;
  }
  if (['zip', 'rar', 'tar', 'gz', '7z'].includes(ext)) {
    return <FileArchive size={18} style={{ color: '#f59e0b' }} />;
  }
  if (['mp4', 'mov', 'avi', 'mkv'].includes(ext)) {
    return <Video size={18} style={{ color: '#10b981' }} />;
  }
  if (['xls', 'xlsx', 'csv'].includes(ext)) {
    return <FileText size={18} style={{ color: '#10b981' }} />;
  }
  return <File size={18} style={{ color: '#64748b' }} />;
};

const AttachmentItem: React.FC<AttachmentItemProps> = ({
  file,
  loadingSignedUrlId,
  downloadingId,
  deletingId,
  onOpenSignedUrl,
  onDownload,
  onDeleteClick
}) => {
  const fileName = file.file_name || (file as any).original_name || 'Unnamed File';
  const fileSize = file.file_size !== undefined ? file.file_size : (file as any).size;

  return (
    <div 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '10px 14px', 
        background: '#ffffff', 
        borderRadius: '10px', 
        border: '1.5px solid #e2e8f0',
        transition: 'border-color 0.2s, box-shadow 0.2s'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = '#70309f';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(112, 48, 159, 0.04)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#e2e8f0';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Left: icon + details */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden', marginRight: '16px' }}>
        <div style={{ display: 'flex', flexShrink: 0 }}>
          {getFileIcon(fileName)}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <span 
            style={{ 
              fontSize: '13px', 
              fontWeight: 600, 
              color: '#334155', 
              whiteSpace: 'nowrap', 
              textOverflow: 'ellipsis', 
              overflow: 'hidden' 
            }}
            title={fileName}
          >
            {fileName}
          </span>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '11px', color: '#64748b' }}>
            <span>{formatFileSize(fileSize)}</span>
            <span>•</span>
            <span>{formatDateString(file.created_at)}</span>
          </div>
        </div>
      </div>

      {/* Right: actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        {/* View Link / Signed URL button */}
        <button 
          onClick={() => onOpenSignedUrl(file)}
          disabled={loadingSignedUrlId !== null || downloadingId !== null || deletingId !== null}
          title="View File Link"
          style={{ 
            width: '28px', 
            height: '28px', 
            borderRadius: '6px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            background: 'transparent', 
            color: '#475569',
            transition: 'background-color 0.2s, color 0.2s'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#f1f5f9';
            e.currentTarget.style.color = '#70309f';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#475569';
          }}
        >
          {loadingSignedUrlId === file.id ? (
            <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
          ) : (
            <ExternalLink size={14} />
          )}
        </button>

        {/* Download button */}
        <button 
          onClick={() => onDownload(file)}
          disabled={loadingSignedUrlId !== null || downloadingId !== null || deletingId !== null}
          title="Download Attachment"
          style={{ 
            width: '28px', 
            height: '28px', 
            borderRadius: '6px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            background: 'transparent', 
            color: '#475569',
            transition: 'background-color 0.2s, color 0.2s'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#f1f5f9';
            e.currentTarget.style.color = '#70309f';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#475569';
          }}
        >
          {downloadingId === file.id ? (
            <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
          ) : (
            <Download size={14} />
          )}
        </button>

        {/* Delete button */}
        <button 
          onClick={() => onDeleteClick(file)}
          disabled={loadingSignedUrlId !== null || downloadingId !== null || deletingId !== null}
          title="Delete Attachment"
          style={{ 
            width: '28px', 
            height: '28px', 
            borderRadius: '6px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            background: 'transparent', 
            color: '#64748b',
            transition: 'background-color 0.2s, color 0.2s'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#fff1f1';
            e.currentTarget.style.color = '#ef4444';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#64748b';
          }}
        >
          {deletingId === file.id ? (
            <Loader2 size={14} style={{ color: '#ef4444', animation: 'spin 1s linear infinite' }} />
          ) : (
            <Trash2 size={14} />
          )}
        </button>
      </div>
    </div>
  );
};

export default AttachmentItem;
