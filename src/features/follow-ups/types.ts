/** Follow-ups hang off a lead but own their endpoints, hooks and screens. */
export type FollowUpStatus = 'Scheduled' | 'Completed' | 'Cancelled';

export interface LeadFollowUp {
  id: string | number;
  lead_id: string | number;
  /** The list endpoint returns `date`/`time`; older payloads used the `follow_up_*` pair. */
  date?: string;
  time?: string;
  follow_up_date?: string;
  follow_up_time?: string;
  scheduled_at?: string;
  notes: string;
  status: FollowUpStatus | string;
  created_at?: string;
  updated_at?: string;
}

/** Scheduled date as YYYY-MM-DD, whichever field the API used. */
export const followUpDate = (followUp: LeadFollowUp): string =>
  followUp.date || followUp.follow_up_date || '';

/** Scheduled time as HH:MM, whichever field the API used. */
export const followUpTime = (followUp: LeadFollowUp): string =>
  followUp.time || followUp.follow_up_time || '';

export interface CreateFollowUpInput {
  date: string;
  time: string;
  notes?: string;
}

export interface UpdateFollowUpInput extends Partial<CreateFollowUpInput> {
  status?: string;
}
