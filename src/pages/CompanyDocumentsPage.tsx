import React, { useState, useEffect, useRef } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useToast } from '../context/ToastContext';
import { companyDocumentService } from '../api/companyDocumentService';
import { CompanyDocument } from '../api/types';
import { hasPermission } from '../utils/authUtils';
import { FileText, Download, Trash2, UploadCloud, Search, Eye, Loader2, Folder } from 'lucide-react';
import ConfirmModal from '../components/ui/ConfirmModal';
import Loader from '../components/ui/Loader';
import './CompanyDocumentsPage.css';

interface CompanyDocumentsPageProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

const CompanyDocumentsPage: React.FC<CompanyDocumentsPageProps> = ({ currentPath, onNavigate }) => {
  const [documents, setDocuments] = useState<CompanyDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(() => localStorage.getItem('globalSearchQuery') || '');
  const [docToDelete, setDocToDelete] = useState<CompanyDocument | null>(null);
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const canManage = hasPermission('Manage Company Documents', user) || hasPermission('admin', user);

  useEffect(() => {
    fetchDocuments();
    
    const handleGlobalSearch = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && typeof customEvent.detail.query === 'string') {
        setSearchQuery(customEvent.detail.query);
      }
    };

    window.addEventListener('globalSearch', handleGlobalSearch);
    return () => {
      window.removeEventListener('globalSearch', handleGlobalSearch);
    };
  }, []);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const res = await companyDocumentService.listDocuments();
      if (res.success || Array.isArray(res.data) || Array.isArray(res)) {
        let items = res.data || res;
        setDocuments(Array.isArray(items) ? items : []);
      } else {
        // Mock data since backend isn't ready
        setTimeout(() => {
          setDocuments([
            { id: 1, file_name: 'Company_Brochure_2024.pdf', file_path: '#', file_size: 2500000, mime_type: 'application/pdf', created_at: new Date().toISOString() },
            { id: 2, file_name: 'Standard_Terms_and_Conditions.pdf', file_path: '#', file_size: 500000, mime_type: 'application/pdf', created_at: new Date().toISOString() },
            { id: 3, file_name: 'Product_Catalog.pdf', file_path: '#', file_size: 4500000, mime_type: 'application/pdf', created_at: new Date().toISOString() }
          ]);
          setIsLoading(false);
        }, 800);
        return;
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
      // Fallback dummy data
      setTimeout(() => {
        setDocuments([
          { id: 1, file_name: 'Company_Brochure_2024.pdf', file_path: '#', file_size: 2500000, mime_type: 'application/pdf', created_at: new Date().toISOString() },
          { id: 2, file_name: 'Standard_Terms_and_Conditions.pdf', file_path: '#', file_size: 500000, mime_type: 'application/pdf', created_at: new Date().toISOString() },
          { id: 3, file_name: 'Product_Catalog.pdf', file_path: '#', file_size: 4500000, mime_type: 'application/pdf', created_at: new Date().toISOString() }
        ]);
        setIsLoading(false);
      }, 800);
      return;
    } 
    setIsLoading(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    if (file.size > 10 * 1024 * 1024) {
      showToast('File exceeds the 10MB limit.', 'error');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('document', file);
    
    try {
      const res = await companyDocumentService.uploadDocument(formData);
      if (res.success || res.data || (res as any).id) {
        showToast('Document uploaded successfully', 'success');
        fetchDocuments();
      } else {
        showToast('Failed to upload document', 'error');
      }
    } catch (err) {
      console.error('Error uploading document:', err);
      showToast('Error uploading document', 'error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const confirmDelete = async () => {
    if (!docToDelete) return;
    try {
      const res = await companyDocumentService.deleteDocument(docToDelete.id);
      if (res.success !== false) {
        showToast('Document deleted successfully', 'success');
        fetchDocuments();
      } else {
        showToast('Failed to delete document', 'error');
      }
    } catch (err) {
      console.error('Error deleting document:', err);
      showToast('Error deleting document', 'error');
    } finally {
      setDocToDelete(null);
    }
  };

  const getDocUrl = (doc: CompanyDocument) => {
    let url = doc.signedUrl || doc.signed_url || doc.file_path;
    if (url && !url.startsWith('http')) {
      const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/api$/, '') || '';
      url = `${baseUrl}/${url.replace(/^\//, '')}`;
    }
    return url;
  };

  const filteredDocs = documents.filter(doc => 
    doc.file_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout currentPath={currentPath} onNavigate={onNavigate}>
      <div className="page-header">
        <div className="page-header-title">
          <h2>Company Documents</h2>
          <p>Browse and manage standard company documents, brochures, and templates.</p>
        </div>
        {canManage && (
          <div className="page-header-actions">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              style={{ display: 'none' }} 
            />
            <button 
              className="btn-primary action-add-btn" 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? <Loader2 className="lucide-spin" size={16} /> : <UploadCloud size={16} />}
              <span className="action-add-btn-text">{isUploading ? 'Uploading...' : 'Upload Document'}</span>
            </button>
          </div>
        )}
      </div>

      <div className="documents-content-wrapper">
        {isLoading ? (
          <Loader message="Loading documents..." />
        ) : filteredDocs.length > 0 ? (
          <div className="documents-grid">
            {filteredDocs.map(doc => (
              <div key={doc.id} className="document-card">
                <div className="document-icon">
                  <FileText size={32} />
                </div>
                <div className="document-info">
                  <h4 title={doc.file_name}>{doc.file_name}</h4>
                  <p>{doc.file_size ? (doc.file_size / 1024).toFixed(1) + ' KB' : 'Unknown size'}</p>
                </div>
                <div className="document-actions">
                  {getDocUrl(doc) && (
                    <>
                      <a href={getDocUrl(doc)} target="_blank" rel="noopener noreferrer" className="action-btn" title="View">
                        <Eye size={16} />
                      </a>
                      <a href={getDocUrl(doc)} download={doc.file_name} className="action-btn" title="Download">
                        <Download size={16} />
                      </a>
                    </>
                  )}
                  {canManage && (
                    <button className="action-btn delete" onClick={() => setDocToDelete(doc)} title="Delete">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Folder className="empty-icon" size={48} />
            <h3>No documents found</h3>
            <p>
              {searchQuery 
                ? "No documents match your search criteria." 
                : "The company library is currently empty."}
            </p>
          </div>
        )}

        <ConfirmModal
          isOpen={!!docToDelete}
          onClose={() => setDocToDelete(null)}
          onConfirm={confirmDelete}
          title="Delete Document"
          message={`Are you sure you want to delete "${docToDelete?.file_name}"?`}
          confirmText="Delete"
          cancelText="Cancel"
          isDestructive={true}
        />
      </div>
    </MainLayout>
  );
};

export default CompanyDocumentsPage;
