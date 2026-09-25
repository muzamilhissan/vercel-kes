import { Lead, LeadAssignee } from './LeadTable';

export const getLocalDateString = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const getAssigneeAvatar = (name: string, bg: string = '70309f') => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=${bg}&color=fff&bold=true`;
};

export const normalizeAssignee = (raw: any): LeadAssignee | null => {
  if (!raw) return null;
  if (typeof raw === 'number' || typeof raw === 'string') {
    return {
      id: String(raw),
      name: `User #${raw}`,
      avatar: getAssigneeAvatar(`User ${raw}`)
    };
  }
  const id = String(raw.id || raw.userId || raw.user_id || '');
  const name = raw.fullName || raw.name || raw.email || (id ? `User #${id}` : 'Assigned User');
  return {
    id,
    name,
    fullName: raw.fullName || raw.name || '',
    email: raw.email || '',
    designation: raw.designation || (raw.roles && raw.roles[0]?.name) || '',
    avatar: raw.avatar || getAssigneeAvatar(name)
  };
};

export const mapApiLeadToFrontendLead = (apiLead: any): Lead => {
  // Normalize status to match LeadTable status type
  let normalizedStatus: 'New' | 'Contacted' | 'Proposed' | 'Qualified' | 'Disqualified' | 'Converted' = 'New';
  if (apiLead.status) {
    const statusLower = String(apiLead.status).toLowerCase();
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

  // Parse assigned users/assignees
  let assignedUsersList: LeadAssignee[] = [];
  let assignedIds: string[] = [];

  const rawUsers = apiLead.assigned_users || apiLead.assignees || apiLead.users || (apiLead.assignee ? [apiLead.assignee] : []);
  if (Array.isArray(rawUsers) && rawUsers.length > 0) {
    assignedUsersList = rawUsers.map(normalizeAssignee).filter(Boolean) as LeadAssignee[];
    assignedIds = assignedUsersList.map(u => String(u.id));
  }

  if (apiLead.assigned_to !== undefined && apiLead.assigned_to !== null) {
    if (Array.isArray(apiLead.assigned_to)) {
      apiLead.assigned_to.forEach((item: any) => {
        if (typeof item === 'object' && item !== null) {
          const u = normalizeAssignee(item);
          if (u) {
            if (!assignedIds.includes(String(u.id))) {
              assignedUsersList.push(u);
              assignedIds.push(String(u.id));
            }
          }
        } else {
          const strId = String(item);
          if (strId && !assignedIds.includes(strId)) {
            assignedIds.push(strId);
          }
        }
      });
    } else if (typeof apiLead.assigned_to === 'string') {
      const parts = apiLead.assigned_to.split(',').map((s: string) => s.trim()).filter(Boolean);
      parts.forEach((p: string) => {
        if (!assignedIds.includes(p)) {
          assignedIds.push(p);
        }
      });
    } else if (typeof apiLead.assigned_to === 'number') {
      const strId = String(apiLead.assigned_to);
      if (!assignedIds.includes(strId)) {
        assignedIds.push(strId);
      }
    }
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
    representative_position: apiLead.representative_position || '',
    expected_revenue: apiLead.expected_revenue !== undefined && apiLead.expected_revenue !== null ? Number(apiLead.expected_revenue) : undefined,
    probability: apiLead.probability !== undefined && apiLead.probability !== null ? Number(apiLead.probability) : undefined,
    notes: apiLead.notes || '',
    assigned_to: assignedIds.length > 0 ? assignedIds.join(',') : '',
    assigned_users: assignedUsersList,
    assignees: assignedUsersList,
    assignee: assignedUsersList[0] || null
  };
};
