import React, { useState, useEffect, useRef } from 'react';
import { 
  Paperclip, Upload, Download, Trash2, ExternalLink, 
  File, FileText, Image, Video, FileArchive, Loader2 
} from 'lucide-react';
import { dealService } from '../../api/dealService';
import { DealFile } from '../../api/types';
import { useToast } from '../../context/ToastContext';
import DeleteModal from '../leads/DeleteModal';

interface DealAttachmentsProps {
  dealId: string | number;
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

const DealAttachments: React.FC<DealAttachmentsProps> = ({ dealId }) => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [files, setFiles] = useState<DealFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [errorFiles, setErrorFiles] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // Operation indicators for files
  const [downloadingId, setDownloadingId] = useState<string | number | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [loadingSignedUrlId, setLoadingSignedUrlId] = useState<string | number | null>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  
  const [fileToDelete, setFileToDelete] = useState<DealFile | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchFiles = async () => {
    try {
      setLoadingFiles(true);
      setErrorFiles(null);
      const res = await dealService.listFiles(dealId);
      if (res.success) {
        const fileList = (res as any).files || (res.data as any)?.files || res.data || [];
        const validFiles = Array.isArray(fileList) ? fileList.filter((f: any) => f && typeof f === 'object') : [];
        setFiles(validFiles);
      } else {
        setErrorFiles(res.message || 'Failed to load files');
      }
    } catch (err: any) {
      console.error(err);
      setErrorFiles(err.message || 'Failed to load files');
    } finally {
      setLoadingFiles(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [dealId]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    await uploadFile(selectedFile);
  };

  const uploadFile = async (file: File) => {
    try {
      setUploading(true);
      const res = await dealService.uploadFile(dealId, file);
      if (res.success) {
        showToast('File uploaded successfully', 'success');
        await fetchFiles();
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        let errorMsg = res.message || 'Failed to upload file';
        if (errorMsg.toLowerCase().includes('unsupported file type')) {
          errorMsg = 'File type not supported';
        }
        showToast(errorMsg, 'error');
      }
    } catch (err: any) {
      console.error(err);
      let errorMsg = err.message || 'Error uploading file';
      if (errorMsg.toLowerCase().includes('unsupported file type')) {
        errorMsg = 'File type not supported';
      }
      showToast(errorMsg, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      await uploadFile(droppedFile);
    }
  };

  const handleDownload = async (file: DealFile) => {
    try {
      setDownloadingId(file.id);
      const blob = await dealService.downloadFile(dealId, file.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.file_name || (file as any).original_name || 'download';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to download file', 'error');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleOpenSignedUrl = async (file: DealFile) => {
    try {
      setLoadingSignedUrlId(file.id);
      const res = await dealService.getSignedUrl(dealId, file.id);
      const url = (res as any).signed_url || res.data?.url || (res.data as any)?.signed_url;
      if (res.success && url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        showToast(res.message || 'Failed to get signed URL', 'error');
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to get signed URL', 'error');
    } finally {
      setLoadingSignedUrlId(null);
    }
  };

  const handleDeleteClick = (file: DealFile) => {
    setFileToDelete(file);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!fileToDelete) return;
    try {
      setDeletingId(fileToDelete.id);
      setIsDeleteModalOpen(false);
      const res = await dealService.deleteFile(dealId, fileToDelete.id);
      if (res.success) {
        showToast('File deleted successfully', 'success');
        await fetchFiles();
      } else {
        showToast(res.message || 'Failed to delete file', 'error');
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to delete file', 'error');
    } finally {
      setDeletingId(null);
      setFileToDelete(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Attachments</span>
          <span style={{ 
            background: '#f1f5f9', 
            color: '#475569', 
            fontSize: '11px', 
            fontWeight: 700, 
            padding: '2px 8px', 
            borderRadius: '12px' 
          }}>
            {files.length}
          </span>
        </div>
      </div>

      {/* Drag and drop upload zone */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: isDragging ? '2px dashed #70309f' : '2px dashed #cbd5e1',
          borderRadius: '12px',
          padding: '20px 16px',
          textAlign: 'center',
          background: isDragging ? 'rgba(112, 48, 159, 0.04)' : '#f8fafc',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          position: 'relative'
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          style={{ display: 'none' }} 
        />
        {uploading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
            <Loader2 size={24} style={{ color: '#70309f', animation: 'spin 1s linear infinite' }} />
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#70309f' }}>Uploading attachment...</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
            <Upload size={24} style={{ color: isDragging ? '#70309f' : '#64748b', transition: 'color 0.2s' }} />
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
              {isDragging ? 'Drop file here' : 'Drag & drop file or click to browse'}
            </span>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Supports PDF, PNG, JPG, Docx, etc.</span>
          </div>
        )}
      </div>

      {/* File List */}
      {loadingFiles ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '24px 0', gap: '10px' }}>
          <Loader2 size={18} style={{ color: '#70309f', animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Loading attachments...</span>
        </div>
      ) : errorFiles ? (
        <div style={{ color: '#ef4444', fontSize: '13px', textAlign: 'center', padding: '12px', background: '#fff5f5', borderRadius: '8px' }}>
          {errorFiles}
        </div>
      ) : files.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '24px 0', color: '#94a3b8', fontSize: '13px', fontStyle: 'italic', border: '1.5px dashed #f1f5f9', borderRadius: '12px' }}>
          No attachments uploaded yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {files.map(file => {
            const fileName = file.file_name || (file as any).original_name || 'Unnamed File';
            const fileSize = file.file_size !== undefined ? file.file_size : (file as any).size;
            
            return (
              <div 
                key={file.id} 
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
                    onClick={() => handleOpenSignedUrl(file)}
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
                    onClick={() => handleDownload(file)}
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
                    onClick={() => handleDeleteClick(file)}
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
          })}
        </div>
      )}
      
      {/* Local spinner animation style */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => !deletingId && setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={fileToDelete ? (fileToDelete.file_name || (fileToDelete as any).original_name || 'Unnamed file') : ''}
        isDeleting={deletingId !== null && fileToDelete && deletingId === fileToDelete.id}
      />
    </div>
  );
};

export default DealAttachments;
