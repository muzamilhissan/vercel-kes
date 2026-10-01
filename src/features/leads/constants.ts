export const LEAD_STATUSES = [
  'New',
  'Contacted',
  'Proposed',
  'Qualified',
  'Disqualified',
  'Converted',
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

/** Badge classes per status, matching the palette the table shipped with. */
export const STATUS_CLASSES: Record<LeadStatus, string> = {
  New: 'bg-blue-100 text-blue-800',
  Contacted: 'bg-amber-100 text-amber-800',
  Proposed: 'bg-sky-100 text-sky-700',
  Qualified: 'bg-green-100 text-green-800',
  Disqualified: 'bg-red-100 text-red-700',
  Converted: 'bg-purple-100 text-purple-800',
};

/** Columns of the kanban board, in pipeline order. */
export const KANBAN_STATUSES: LeadStatus[] = [
  'New',
  'Contacted',
  'Proposed',
  'Qualified',
  'Disqualified',
];

export function toLeadStatus(value: unknown): LeadStatus {
  const normalized = String(value ?? '').toLowerCase();
  return LEAD_STATUSES.find((status) => status.toLowerCase() === normalized) ?? 'New';
}
