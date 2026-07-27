import { Lead } from './LeadTable';

export const getLocalDateString = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const MOCK_ASSIGNEES = [
  { id: '1', name: 'Alice Smith', avatar: 'https://ui-avatars.com/api/?name=Alice+Smith&background=random' },
  { id: '2', name: 'Bob Johnson', avatar: 'https://ui-avatars.com/api/?name=Bob+Johnson&background=random' },
  { id: '3', name: 'Charlie Davis', avatar: 'https://ui-avatars.com/api/?name=Charlie+Davis&background=random' },
];

export const mapApiLeadToFrontendLead = (apiLead: any): Lead => {
  // Normalize status to match LeadTable status type
  let normalizedStatus: 'New' | 'Contacted' | 'Proposed' | 'Qualified' | 'Disqualified' | 'Converted' = 'New';
  if (apiLead.status) {
    const statusLower = apiLead.status.toLowerCase();
    if (statusLower === 'contacted') normalizedStatus = 'Contacted';
    else if (statusLower === 'proposed') normalizedStatus = 'Proposed';
    else if (statusLower === 'qualified') normalizedStatus = 'Qualified';
    else if (statusLower === 'disqualified') normalizedStatus = 'Disqualified';
    else if (statusLower === 'converted') normalizedStatus = 'Converted';
  }

  // Format dateAdded using created_at or fallback
  let dateStr = '';
  if (apiLead.created_at) {
    try {
      dateStr = new Date(apiLead.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      dateStr = String(apiLead.created_at);
    }
  } else if (apiLead.dateAdded) {
    dateStr = apiLead.dateAdded;
  } else {
    dateStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  return {
    id: String(apiLead.id),
    name: apiLead.name || '',
    company: apiLead.company || '',
    email: apiLead.email || '',
    phone: apiLead.phone || '',
    status: normalizedStatus,
    dateAdded: dateStr,
    industry: apiLead.industry || '',
    province: apiLead.province || '',
    website: apiLead.website || '',
    source: apiLead.source || '',
    expected_revenue: apiLead.expected_revenue !== undefined ? Number(apiLead.expected_revenue) : undefined,
    probability: apiLead.probability !== undefined ? Number(apiLead.probability) : undefined,
    notes: apiLead.notes || '',
  };
};
