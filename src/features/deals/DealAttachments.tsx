import React, { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { dealService } from '../../api/dealService';
import { DealFile } from '../../api/types';
import { useToast } from '../../context/ToastContext';
import DeleteModal from '../leads/DeleteModal';
import UploadZone from './UploadZone';
import AttachmentItem from './AttachmentItem';

interface DealAttachmentsProps {
  dealId: string | number;
}

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
      <UploadZone
        uploading={uploading}
        isDragging={isDragging}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        fileInputRef={fileInputRef}
        onFileSelect={handleFileSelect}
      />

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
          {files.map(file => (
            <AttachmentItem
              key={file.id}
              file={file}
              loadingSignedUrlId={loadingSignedUrlId}
              downloadingId={downloadingId}
              deletingId={deletingId}
              onOpenSignedUrl={handleOpenSignedUrl}
              onDownload={handleDownload}
              onDeleteClick={handleDeleteClick}
            />
          ))}
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
        isDeleting={!!(deletingId && fileToDelete && deletingId === fileToDelete.id)}
      />
    </div>
  );
};

export default DealAttachments;
