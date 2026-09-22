import React, { useState, useEffect } from 'react';
import { X, FileText, Search, Loader2, CheckCircle } from 'lucide-react';
import { CompanyDocument } from '../../api/types';
import { companyDocumentService } from '../../api/companyDocumentService';
import { useToast } from '../../context/ToastContext';
import './SelectCompanyDocumentModal.css';

interface SelectCompanyDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDocuments: (documents: CompanyDocument[]) => void;
  maxSelections?: number;
}

const SelectCompanyDocumentModal: React.FC<SelectCompanyDocumentModalProps> = ({ 
  isOpen, 
  onClose, 
  onSelectDocuments,
  maxSelections = 5
}) => {
  const [documents, setDocuments] = useState<CompanyDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocs, setSelectedDocs] = useState<Set<string | number>>(new Set());
  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchDocuments();
      setSelectedDocs(new Set()); // Reset selections on open
    }
  }, [isOpen]);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const res = await companyDocumentService.listDocuments();
      if (res.success || Array.isArray(res.data) || Array.isArray(res)) {
        let items = res.data || res;
        setDocuments(Array.isArray(items) ? items : []);
      } else {
        showToast('Failed to load company documents', 'error');
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
      // Fallback empty array
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const filteredDocs = documents.filter(doc => 
    doc.file_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelection = (docId: string | number) => {
    const newSelections = new Set(selectedDocs);
    if (newSelections.has(docId)) {
      newSelections.delete(docId);
    } else {
      if (newSelections.size >= maxSelections) {
        showToast(`You can select up to ${maxSelections} documents.`, 'error');
        return;
      }
      newSelections.add(docId);
    }
    setSelectedDocs(newSelections);
  };

  const handleConfirm = () => {
    const selectedDocumentsArray = documents.filter(d => selectedDocs.has(d.id));
    onSelectDocuments(selectedDocumentsArray);
    onClose();
  };

  return (
    <div className="proposal-modal-overlay select-doc-modal-overlay">
      <div className="proposal-modal-container select-doc-modal-container">
        <div className="proposal-modal-header">
          <h2><FileText size={20} className="header-icon" /> Select Company Documents</h2>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        
        <div className="proposal-modal-body">
          <div className="select-doc-toolbar">
            <div className="search-box">
              <Search size={16} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search library..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="selection-count">
              {selectedDocs.size} / {maxSelections} selected
            </div>
          </div>

          <div className="select-doc-list">
            {isLoading ? (
              <div className="loading-state">
                <Loader2 className="lucide-spin" size={24} />
                <p>Loading library...</p>
              </div>
            ) : filteredDocs.length > 0 ? (
              filteredDocs.map(doc => {
                const isSelected = selectedDocs.has(doc.id);
                return (
                  <div 
                    key={doc.id} 
                    className={`select-doc-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleSelection(doc.id)}
                  >
                    <div className="doc-item-icon">
                      <FileText size={24} />
                    </div>
                    <div className="doc-item-info">
                      <h4 title={doc.file_name}>{doc.file_name}</h4>
                      <p>{doc.file_size ? (doc.file_size / 1024).toFixed(1) + ' KB' : 'Unknown size'}</p>
                    </div>
                    <div className="doc-item-check">
                      <div className={`checkbox-circle ${isSelected ? 'active' : ''}`}>
                        {isSelected && <CheckCircle size={16} />}
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="empty-state">
                <p>No documents found.</p>
              </div>
            )}
          </div>
        </div>

        <div className="proposal-modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button 
            className="btn btn-primary" 
            onClick={handleConfirm}
            disabled={selectedDocs.size === 0}
          >
            Attach Selected ({selectedDocs.size})
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectCompanyDocumentModal;
