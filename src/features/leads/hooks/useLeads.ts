import { useState, useEffect, useMemo, useRef } from 'react';
import { Lead } from '../LeadTable';
import { leadService } from '../../../api/leadService';
import { useToast } from '../../../context/ToastContext';
import { mapApiLeadToFrontendLead } from '../utils';

export const useLeads = () => {
  const { showToast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isDeletingLead, setIsDeletingLead] = useState(false);
  const [isConvertingLead, setIsConvertingLead] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState(() => localStorage.getItem('globalSearchQuery') || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filterDate, setFilterDate] = useState('');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);

  const [hasFetchedAllLeads, setHasFetchedAllLeads] = useState(false);
  const [isInitializingFromUrl, setIsInitializingFromUrl] = useState(() => {
    return new URL(window.location.href).searchParams.has('leadId');
  });

  const isMounted = useRef(false);

  // Sync viewingLead to URL
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    const url = new URL(window.location.href);
    if (viewingLead) {
      if (url.searchParams.get('leadId') !== String(viewingLead.id)) {
        url.searchParams.set('leadId', String(viewingLead.id));
        window.history.pushState({}, '', url.toString());
      }
    } else {
      if (url.searchParams.has('leadId')) {
        url.searchParams.delete('leadId');
        window.history.pushState({}, '', url.toString());
      }
    }
  }, [viewingLead]);

  // Read leadId from URL on mount and when allLeads is fetched
  useEffect(() => {
    if (isInitializingFromUrl && hasFetchedAllLeads) {
      const url = new URL(window.location.href);
      const leadId = url.searchParams.get('leadId');
      if (leadId) {
        const lead = allLeads.find(l => String(l.id) === leadId);
        if (lead) {
          setViewingLead(lead);
        }
      }
      setIsInitializingFromUrl(false);
    }
  }, [allLeads, hasFetchedAllLeads, isInitializingFromUrl]);

  useEffect(() => {
    const handleGlobalSearch = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && typeof customEvent.detail.query === 'string') {
        setSearchQuery(customEvent.detail.query);
        setCurrentPage(1);
      }
    };

    window.addEventListener('globalSearch', handleGlobalSearch);
    return () => {
      window.removeEventListener('globalSearch', handleGlobalSearch);
    };
  }, []);

  const filteredLeads = useMemo(() => {
    if (!filterDate) return leads;
    return leads.filter(lead => {
      try {
        const leadDate = new Date(lead.dateAdded);
        const selectedDate = new Date(filterDate);
        return leadDate.getFullYear() === selectedDate.getFullYear() &&
               leadDate.getMonth() === selectedDate.getMonth() &&
               leadDate.getDate() === selectedDate.getDate();
      } catch {
        return false;
      }
    });
  }, [leads, filterDate]);

  const filteredAllLeads = useMemo(() => {
    if (!filterDate) return allLeads;
    return allLeads.filter(lead => {
      try {
        const leadDate = new Date(lead.dateAdded);
        const selectedDate = new Date(filterDate);
        return leadDate.getFullYear() === selectedDate.getFullYear() &&
               leadDate.getMonth() === selectedDate.getMonth() &&
               leadDate.getDate() === selectedDate.getDate();
      } catch {
        return false;
      }
    });
  }, [allLeads, filterDate]);

  const fetchLeads = async (page?: number | any, query?: string) => {
    const pageNum = typeof page === 'number' ? page : currentPage;
    const queryStr = typeof query === 'string' ? query : searchQuery;
    try {
      setLoading(true);
      setError(null);
      const res = await leadService.list(pageNum, 10, queryStr) as any;
      if (res.success) {
        const apiLeads = res.leads || res.data?.leads || res.data;
        if (Array.isArray(apiLeads)) {
          setLeads(apiLeads.map(mapApiLeadToFrontendLead));
          if (res.meta) {
            setTotalPages(res.meta.last_page || 1);
            setTotalItems(res.meta.total || 0);
          } else {
            setTotalPages(1);
            setTotalItems(apiLeads.length);
          }
        } else {
          setLeads([]);
          setTotalPages(1);
          setTotalItems(0);
        }
      } else {
        setError(res.message || 'Failed to fetch leads');
      }
    } catch (err: any) {
      console.error('Error fetching leads:', err);
      setError(err.message || 'Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllLeads = async () => {
    try {
      const res = await leadService.list(1, 10000, searchQuery) as any;
      if (res.success) {
        const apiLeads = res.leads || res.data?.leads || res.data;
        if (Array.isArray(apiLeads)) {
          setAllLeads(apiLeads.map(mapApiLeadToFrontendLead));
        }
      }
    } catch (err) {
      console.error('Error fetching all leads for board/stats:', err);
    } finally {
      setHasFetchedAllLeads(true);
    }
  };

  useEffect(() => {
    fetchLeads(currentPage, searchQuery);
    fetchAllLeads();
  }, [currentPage, searchQuery]);

  useEffect(() => {
    const handleLeadsUpdated = () => {
      fetchLeads(currentPage, searchQuery);
      fetchAllLeads();
    };
    window.addEventListener('leadsUpdated', handleLeadsUpdated);
    return () => window.removeEventListener('leadsUpdated', handleLeadsUpdated);
  }, [currentPage, searchQuery]);

  const handleSaveLead = async (leadData: Lead) => {
    try {
      setError(null);
      if (selectedLead) {
        const payload = {
          name: leadData.name,
          company: leadData.company,
          email: leadData.email,
          phone: leadData.phone,
          status: leadData.status,
          industry: leadData.industry,
          province: leadData.province,
          website: leadData.website,
          source: leadData.source,
          expected_revenue: leadData.expected_revenue,
          probability: leadData.probability,
          notes: leadData.notes,
        };
        const res = await leadService.update(selectedLead.id, payload);
        if (res.success) {
          if (viewingLead && viewingLead.id === selectedLead.id) {
            setViewingLead({ ...viewingLead, ...payload });
          }
          window.dispatchEvent(new CustomEvent('leadsUpdated'));
          showToast('Lead updated successfully', 'success');
        } else {
          showToast(res.message || 'Failed to update lead', 'error');
        }
      } else {
        const payload = {
          name: leadData.name,
          company: leadData.company,
          email: leadData.email,
          phone: leadData.phone,
          industry: leadData.industry,
          province: leadData.province,
          website: leadData.website,
          source: leadData.source,
          expected_revenue: leadData.expected_revenue,
          probability: leadData.probability,
          notes: leadData.notes,
        };
        const res = await leadService.store(payload);
        if (res.success) {
          window.dispatchEvent(new CustomEvent('leadsUpdated'));
          showToast('Lead created successfully', 'success');
        } else {
          showToast(res.message || 'Failed to create lead', 'error');
        }
      }
      setIsLeadModalOpen(false);
    } catch (err: any) {
      console.error('Error saving lead:', err);
      showToast(err.message || 'Error saving lead', 'error');
    }
  };

  const handleDeleteLead = async () => {
    if (!selectedLead) return;
    try {
      setIsDeletingLead(true);
      setError(null);
      const res = await leadService.delete(selectedLead.id);
      if (res.success) {
        if (viewingLead && viewingLead.id === selectedLead.id) {
          setViewingLead(null);
        }
        window.dispatchEvent(new CustomEvent('leadsUpdated'));
        showToast('Lead deleted successfully', 'success');
      } else {
        showToast(res.message || 'Failed to delete lead', 'error');
      }
      setIsDeleteModalOpen(false);
    } catch (err: any) {
      console.error('Error deleting lead:', err);
      showToast(err.message || 'Error deleting lead', 'error');
    } finally {
      setIsDeletingLead(false);
    }
  };

  const handleConvertLead = async () => {
    if (!selectedLead) return;
    try {
      setIsConvertingLead(true);
      setError(null);
      const payload = {
        contact_name: selectedLead.name,
        contact_company: selectedLead.company,
        contact_email: selectedLead.email,
        contact_phone: selectedLead.phone,
      };
      const res = await leadService.convert(selectedLead.id, payload);
      if (res.success) {
        window.dispatchEvent(new CustomEvent('leadsUpdated'));
        showToast('Lead converted successfully', 'success');
      } else {
        showToast(res.message || 'Failed to convert lead', 'error');
      }
      setIsConvertModalOpen(false);
    } catch (err: any) {
      console.error('Error converting lead:', err);
      showToast(err.message || 'Error converting lead', 'error');
    } finally {
      setIsConvertingLead(false);
    }
  };

  const handleAssignLead = async (lead: Lead, userId: string) => {
    try {
      const currentAssigned = typeof lead.assigned_to === 'string' && lead.assigned_to ? lead.assigned_to.split(',') : [];
      let newAssigned: string[];
      if (currentAssigned.includes(userId)) {
        newAssigned = currentAssigned.filter(id => id !== userId);
      } else {
        newAssigned = [...currentAssigned, userId];
      }
      const newAssignedStr = newAssigned.join(',');

      // Optimistically update local state immediately
      setAllLeads(prev => prev.map(l => l.id === lead.id ? { ...l, assigned_to: newAssignedStr } : l));
      setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, assigned_to: newAssignedStr } : l));

      const res = await leadService.update(lead.id, { assigned_to: newAssignedStr });
      if (res.success) {
        showToast('Lead assigned successfully', 'success');
      } else {
        // Revert on failure by refetching
        showToast(res.message || 'Failed to assign lead', 'error');
        window.dispatchEvent(new CustomEvent('leadsUpdated'));
      }
    } catch (err: any) {
      showToast(err.message || 'Error assigning lead', 'error');
      window.dispatchEvent(new CustomEvent('leadsUpdated'));
    }
  };

  return {
    leads: filteredLeads,
    allLeads: filteredAllLeads,
    selectedLead,
    setSelectedLead,
    isLeadModalOpen,
    setIsLeadModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isConvertModalOpen,
    setIsConvertModalOpen,
    isDetailsModalOpen,
    setIsDetailsModalOpen,
    loading,
    error,
    isDeletingLead,
    isConvertingLead,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    filterDate,
    setFilterDate,
    viewMode,
    setViewMode,
    viewingLead,
    setViewingLead,
    isInitializingFromUrl,
    fetchLeads,
    handleSaveLead,
    handleDeleteLead,
    handleConvertLead,
    handleAssignLead
  };
};
