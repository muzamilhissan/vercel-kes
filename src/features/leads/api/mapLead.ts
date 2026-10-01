import { formatDate } from '@/shared/lib/format';
import { assigneesOf } from '../lib/assignees';
import { toLeadStatus } from '../constants';
import type { Lead } from '../types';

const asNumber = (value: unknown): number | undefined =>
  value === undefined || value === null || value === '' ? undefined : Number(value);

/**
 * Normalise a lead from the API: the status casing varies, the created date comes
 * back under different keys, and assignees arrive in several shapes.
 */
export function mapApiLead(raw: Lead): Lead {
  const assignees = assigneesOf(raw);

  return {
    ...raw,
    id: String(raw.id),
    name: raw.name || '',
    company: raw.company || '',
    email: raw.email || '',
    phone: raw.phone || '',
    status: toLeadStatus(raw.status),
    dateAdded: formatDate(raw.created_at ?? raw.dateAdded ?? new Date()),
    industry: raw.industry || '',
    province: raw.province || '',
    website: raw.website || '',
    source: raw.source || '',
    representative_position: raw.representative_position || '',
    vat_number: raw.vat_number || '',
    vendor_number: raw.vendor_number || '',
    registration_no: raw.registration_no || '',
    finance_email: raw.finance_email || '',
    enduser_name: raw.enduser_name || '',
    billing_statement_email: raw.billing_statement_email || '',
    address: raw.address || '',
    expected_revenue: asNumber(raw.expected_revenue),
    probability: asNumber(raw.probability),
    notes: raw.notes || '',
    assigned_to: assignees.map((assignee) => assignee.id).join(','),
    assigned_users: assignees,
    assignees,
    assignee: assignees[0] ?? null,
  };
}
