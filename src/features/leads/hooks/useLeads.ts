import { useState, useEffect, useMemo, useRef } from 'react';
import { Lead } from '../LeadTable';
import { leadService } from '../../../api/leadService';
import { useToast } from '../../../context/ToastContext';
import { mapApiLeadToFrontendLead, normalizeAssignee } from '../utils';
import { getCurrentUser, isSuperAdmin, getUserId } from '../../../utils/authUtils';

export const useLeads = () => {
  const { showToast } = useToast();
  const currentUser = getCurrentUser();
  const superAdmin = isSuperAdmin(currentUser);
  const currentUserId = getUserId(currentUser);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [assignableUsers, setAssignableUsers] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadToAssign, setLeadToAssign] = useState<Lead | null>(null);
  
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isDeletingLead, setIsDeletingLead] = useState(false);
  const [isConvertingLead, setIsConvertingLead] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState(() => localStorage.getItem('globalSearchQuery') || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filterDate, setFilterDate] = useState('');
  const [filterAssignees, setFilterAssignees] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);

  const [hasFetchedAllLeads, setHasFetchedAllLeads] = useState(false);
  const [isInitializingFromUrl, setIsInitializingFromUrl] = useState(() => {
    return new URL(window.location.href).searchParams.has('leadId');
  });

  const isMounted = useRef(false);

  // Helper: check if a lead is assigned to a specific user
  const isLeadAssignedTo = (lead: Lead, userId: string): boolean => {
    if (!userId) return false;
    if (typeof lead.assigned_to === 'string' && lead.assigned_to) {
      const ids = lead.assigned_to.split(',').map(s => s.trim());
      if (ids.includes(userId)) return true;
    } else if (Array.isArray(lead.assigned_to)) {
      if (lead.assigned_to.map(String).includes(userId)) return true;
    }
    const assignees = lead.assigned_users || lead.assignees || (lead.assignee ? [lead.assignee] : []);
    if (assignees.some(a => String(a.id) === userId)) return true;

    return false;
  };

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

  // Read leadId from URL on mount and check role permissions
  useEffect(() => {
    if (isInitializingFromUrl && hasFetchedAllLeads) {
      const url = new URL(window.location.href);
      const leadId = url.searchParams.get('leadId');
      if (leadId) {
        const lead = allLeads.find(l => String(l.id) === leadId);
        if (lead) {
          if (superAdmin || isLeadAssignedTo(lead, currentUserId)) {
            setViewingLead(lead);
          } else {
            showToast('Access restricted: You can only view leads assigned to you.', 'error');
            url.searchParams.delete('leadId');
            window.history.pushState({}, '', url.toString());
            setViewingLead(null);
          }
        }
      }
      setIsInitializingFromUrl(false);
    }
  }, [allLeads, hasFetchedAllLeads, isInitializingFromUrl, superAdmin, currentUserId]);

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

  // Filter leads according to role (Superadmin sees all company leads, regular users only see assigned leads)
  const roleFilteredLeads = useMemo(() => {
    if (superAdmin) {
      return leads;
    }
    return leads.filter(lead => isLeadAssignedTo(lead, currentUserId));
  }, [leads, superAdmin, currentUserId]);

  const roleFilteredAllLeads = useMemo(() => {
    if (superAdmin) {
      return allLeads;
    }
    return allLeads.filter(lead => isLeadAssignedTo(lead, currentUserId));
  }, [allLeads, superAdmin, currentUserId]);

  // Secondary Filters (Date & Assignees)
  const filteredLeads = useMemo(() => {
    let result = roleFilteredLeads;
    if (filterDate) {
      result = result.filter(lead => {
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
    }
    if (filterAssignees.length > 0) {
      result = result.filter(lead => {
        return filterAssignees.some(id => isLeadAssignedTo(lead, id));
      });
    }
    return result;
  }, [roleFilteredLeads, filterDate, filterAssignees]);

  const filteredAllLeads = useMemo(() => {
    let result = roleFilteredAllLeads;
    if (filterDate) {
      result = result.filter(lead => {
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
    }
    if (filterAssignees.length > 0) {
      result = result.filter(lead => {
        return filterAssignees.some(id => isLeadAssignedTo(lead, id));
      });
    }
    return result;
  }, [roleFilteredAllLeads, filterDate, filterAssignees]);

  // Fetch assignable users from API
  const fetchAssignableUsers = async () => {
    try {
      const res = await leadService.getAssignableUsers() as any;
      if (res && res.success) {
        const users = res.data?.users || res.users || res.data || [];
        if (Array.isArray(users)) {
          setAssignableUsers(users);
        }
      }
    } catch (err) {
      console.error('Error fetching assignable users:', err);
    }
  };

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
          const mapped = apiLeads.map(mapApiLeadToFrontendLead);
          setLeads(mapped);
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
          const mapped = apiLeads.map(mapApiLeadToFrontendLead);
          setAllLeads(mapped);
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
    fetchAssignableUsers();
  }, [currentPage, searchQuery]);

  useEffect(() => {
    const handleLeadsUpdated = () => {
      fetchLeads(currentPage, searchQuery);
      fetchAllLeads();
      fetchAssignableUsers();
    };
    window.addEventListener('leadsUpdated', handleLeadsUpdated);
    return () => window.removeEventListener('leadsUpdated', handleLeadsUpdated);
  }, [currentPage, searchQuery]);

  const handleSaveLead = async (leadData: Lead) => {
    try {
      setError(null);
      const assignedIdsArray = typeof leadData.assigned_to === 'string' && leadData.assigned_to
        ? leadData.assigned_to.split(',').map(s => s.trim()).filter(Boolean)
        : Array.isArray(leadData.assigned_to)
          ? leadData.assigned_to.map(String)
          : [];

      if (selectedLead) {
        const payload: any = {
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
          // If superadmin assigned users upon update, call assignLead
          if (superAdmin && assignedIdsArray.length >= 0) {
            try {
              const assignRes = await leadService.assignLead(selectedLead.id, assignedIdsArray.map(Number).filter(n => !isNaN(n)).length > 0 ? assignedIdsArray.map(Number) : assignedIdsArray) as any;
              if (assignRes && assignRes.success === false) {
                showToast(assignRes.message || 'Lead updated, but failed to assign users', 'warning');
              }
            } catch (assignErr) {
              console.warn('Assign on update:', assignErr);
              showToast('Lead updated, but failed to assign users', 'warning');
            }
          }

          if (viewingLead && viewingLead.id === selectedLead.id) {
            setViewingLead({ ...viewingLead, ...payload, assigned_to: leadData.assigned_to });
          }
          window.dispatchEvent(new CustomEvent('leadsUpdated'));
          showToast('Lead updated successfully', 'success');
        } else {
          showToast(res.message || 'Failed to update lead', 'error');
        }
      } else {
        const payload: any = {
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
        const res = await leadService.store(payload) as any;
        if (res.success) {
          const newLeadId = res.data?.id || res.data?.lead?.id || res.lead?.id || res.id;
          if (newLeadId && superAdmin && assignedIdsArray.length > 0) {
            try {
              const assignRes = await leadService.assignLead(newLeadId, assignedIdsArray.map(Number).filter(n => !isNaN(n)).length > 0 ? assignedIdsArray.map(Number) : assignedIdsArray) as any;
              if (assignRes && assignRes.success === false) {
                showToast(assignRes.message || 'Lead created, but failed to assign users', 'warning');
              }
            } catch (assignErr) {
              console.warn('Assign on create:', assignErr);
              showToast('Lead created, but failed to assign users', 'warning');
            }
          } else if (!newLeadId && superAdmin && assignedIdsArray.length > 0) {
            showToast('Lead created, but could not determine ID for assignment', 'warning');
          }
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

  // Assign or reassign users to a lead (Superadmin only)
  const handleAssignLead = async (lead: Lead, userIds: (string | number)[]) => {
    try {
      const formattedUserIds = userIds.map(id => {
        const n = Number(id);
        return isNaN(n) ? id : n;
      });
      const newAssignedStr = userIds.join(',');

      // Map assigned users from assignableUsers list
      const updatedAssignees = assignableUsers
        .map(normalizeAssignee)
        .filter((u): u is any => u !== null && userIds.map(String).includes(String(u.id)));

      // Optimistically update local state
      const updateLeadInState = (l: Lead) => {
        if (String(l.id) === String(lead.id)) {
          return {
            ...l,
            assigned_to: newAssignedStr,
            assigned_users: updatedAssignees,
            assignees: updatedAssignees,
            assignee: updatedAssignees[0] || null
          };
        }
        return l;
      };

      setAllLeads(prev => prev.map(updateLeadInState));
      setLeads(prev => prev.map(updateLeadInState));
      if (viewingLead && String(viewingLead.id) === String(lead.id)) {
        setViewingLead(prev => prev ? updateLeadInState(prev) : null);
      }

      const res = await leadService.assignLead(lead.id, formattedUserIds) as any;
      if (res.success) {
        showToast('Lead assigned successfully', 'success');
        window.dispatchEvent(new CustomEvent('leadsUpdated'));
      } else {
        showToast(res.message || 'Failed to assign lead', 'error');
        window.dispatchEvent(new CustomEvent('leadsUpdated'));
      }
    } catch (err: any) {
      console.error('Error assigning lead:', err);
      showToast(err.message || 'Error assigning lead', 'error');
      window.dispatchEvent(new CustomEvent('leadsUpdated'));
    }
  };

  const openAssignModal = (lead: Lead) => {
    setLeadToAssign(lead);
    setIsAssignModalOpen(true);
  };

  return {
    isSuperAdmin: superAdmin,
    currentUser,
    leads: filteredLeads,
    allLeads: filteredAllLeads,
    assignableUsers,
    selectedLead,
    setSelectedLead,
    leadToAssign,
    setLeadToAssign,
    isLeadModalOpen,
    setIsLeadModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isConvertModalOpen,
    setIsConvertModalOpen,
    isDetailsModalOpen,
    setIsDetailsModalOpen,
    isAssignModalOpen,
    setIsAssignModalOpen,
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
    filterAssignees,
    setFilterAssignees,
    viewMode,
    setViewMode,
    viewingLead,
    setViewingLead,
    isInitializingFromUrl,
    fetchLeads,
    handleSaveLead,
    handleDeleteLead,
    handleConvertLead,
    handleAssignLead,
    openAssignModal
  };
};
