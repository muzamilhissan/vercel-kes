import { useMemo } from 'react';
import { isSuperAdmin, getUserId } from '@/shared/auth/permissions';
import { session } from '@/shared/auth/session';
import { isAssignedTo } from '../lib/assignees';
import type { Lead } from '../types';

export interface LeadFilters {
  date: string;
  assignees: string[];
}

/** Parse "Oct 28, 2026" or an ISO string into a comparable date. */
function sameDay(lead: Lead, isoDate: string): boolean {
  if (!lead.dateAdded) return false;
  const leadDate = new Date(lead.dateAdded);
  const target = new Date(isoDate);
  if (Number.isNaN(leadDate.getTime()) || Number.isNaN(target.getTime())) return false;
  return (
    leadDate.getFullYear() === target.getFullYear() &&
    leadDate.getMonth() === target.getMonth() &&
    leadDate.getDate() === target.getDate()
  );
}

/**
 * Applies the role rule (admins see every lead, everyone else only their own)
 * and then the header's date and assignee filters.
 */
export function useVisibleLeads(leads: Lead[], filters: LeadFilters) {
  const user = useMemo(() => session.getUser(), []);
  const superAdmin = isSuperAdmin(user);
  const currentUserId = getUserId(user);

  const visible = useMemo(() => {
    let result = superAdmin ? leads : leads.filter((lead) => isAssignedTo(lead, currentUserId));

    if (filters.date) result = result.filter((lead) => sameDay(lead, filters.date));
    if (filters.assignees.length > 0) {
      result = result.filter((lead) => filters.assignees.some((id) => isAssignedTo(lead, id)));
    }
    return result;
  }, [leads, superAdmin, currentUserId, filters.date, filters.assignees]);

  return { visible, isSuperAdmin: superAdmin, currentUserId, user };
}
