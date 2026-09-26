import type { User } from '@/shared/types/api';
import type { Lead } from '../types';


export interface LeadAssignee {
  id: string;
  name: string;
  fullName?: string;
  email?: string;
  designation?: string;
  avatar: string;
}

export function assigneeAvatar(name: string, background = '70309f'): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=${background}&color=fff&bold=true`;
}

type RawAssignee = Partial<User> & {
  userId?: number | string;
  user_id?: number | string;
  avatar?: string;
};

/** Assignees arrive as ids, partial users, or full users depending on the endpoint. */
export function normalizeAssignee(raw: RawAssignee | number | string | null | undefined): LeadAssignee | null {
  if (raw == null || raw === '') return null;

  if (typeof raw === 'number' || typeof raw === 'string') {
    return { id: String(raw), name: `User #${raw}`, avatar: assigneeAvatar(`User ${raw}`) };
  }

  const id = String(raw.id ?? raw.userId ?? raw.user_id ?? '');
  const name = raw.fullName || raw.name || raw.email || (id ? `User #${id}` : 'Assigned User');

  return {
    id,
    name,
    fullName: raw.fullName || raw.name || '',
    email: raw.email || '',
    designation: raw.designation || raw.roles?.[0]?.name || '',
    avatar: raw.avatar || assigneeAvatar(name),
  };
}

/** Every assignee on a lead, de-duplicated across the several fields the API uses. */
export function assigneesOf(lead: Lead): LeadAssignee[] {
  const byId = new Map<string, LeadAssignee>();

  const add = (raw: RawAssignee | number | string | null | undefined) => {
    const assignee = normalizeAssignee(raw);
    if (assignee?.id && !byId.has(assignee.id)) byId.set(assignee.id, assignee);
  };

  for (const raw of lead.assigned_users ?? lead.assignees ?? (lead.assignee ? [lead.assignee] : [])) add(raw);

  if (Array.isArray(lead.assigned_to)) {
    for (const entry of lead.assigned_to) add(entry);
  } else if (typeof lead.assigned_to === 'string') {
    for (const id of lead.assigned_to.split(',').map((part) => part.trim())) add(id);
  } else if (typeof lead.assigned_to === 'number') {
    add(lead.assigned_to);
  }

  return [...byId.values()];
}

export function isAssignedTo(lead: Lead, userId: string): boolean {
  if (!userId) return false;
  return assigneesOf(lead).some((assignee) => assignee.id === userId);
}
