import React from 'react';
import { Upload, Loader2 } from 'lucide-react';

interface UploadZoneProps {
  uploading: boolean;
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadZone: React.FC<UploadZoneProps> = ({
  uploading,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onClick,
  fileInputRef,
  onFileSelect
}) => {
  return (
    <div 
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
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
      onClick={onClick}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={onFileSelect} 
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
  );
};

export default UploadZone;
