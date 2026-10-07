import { z } from 'zod';
import { isValidPhoneNumber } from '@/shared/ui';
import { WEBSITE_ERROR, isValidWebsite } from '@/shared/lib/text';
import { LEAD_STATUSES } from '../../../constants';

/** Positions offered in the dropdown; anything else is entered as a custom value. */
export const PREDEFINED_POSITIONS = [
  'Procurement',
  'Engineering',
  'Maintenance Manager',
  'Plant Manager',
  'Operations Manager',
] as const;

/** Statuses a user may not switch away from once reached. */
export const LOCKED_STATUSES = ['Converted', 'Qualified'];

const optionalNumber = z
  .union([z.literal(''), z.coerce.number()])
  .optional()
  .transform((value) => (value === '' || value === undefined ? undefined : Number(value)));

export const WEBSITE_PREFIX = 'https://';

export const stripScheme = (value: string) => value.trim().replace(/^https?:\/\//i, '');

export const NOTES_MAX_LENGTH = 500;

export const leadFormSchema = z.object({
  name: z.string().trim().min(1, 'Lead name is required.').max(150),
  company: z.string().trim().min(1, 'Company is required.').max(150),
  status: z.enum(LEAD_STATUSES),
  representative_position: z.string().trim().optional(),
  phone: z
    .string()
    .min(1, 'Phone number is required.')
    .refine(isValidPhoneNumber, 'Please enter a valid phone number.'),
  email: z.string().trim().min(1, 'Email is required.').email('Enter a valid email address.'),
  industry: z.string().trim().min(1, 'Industry is required.'),
  province: z.string().trim().min(1, 'Province is required.'),
  website: z
    .string()
    .optional()
    .transform((value) => stripScheme(value ?? ''))
    .refine((value) => value === '' || isValidWebsite(value), WEBSITE_ERROR)
    .transform((value) => (value ? WEBSITE_PREFIX + value : '')),
  source: z.string().trim().optional(),
  vat_number: z.string().trim().max(50).optional(),
  vendor_number: z.string().trim().max(50).optional(),
  registration_no: z.string().trim().max(50).optional(),
  finance_email: z
    .string()
    .trim()
    .min(1, 'Finance email address is required.')
    .email('Enter a valid email address.'),
  enduser_name: z.string().trim().max(150).optional(),
  billing_statement_email: z
    .string()
    .trim()
    .min(1, 'Billing statement email is required.')
    .email('Enter a valid email address.'),
  address: z.string().trim().min(1, 'Address is required.').max(500),
  expected_revenue: optionalNumber,
  probability: optionalNumber.refine(
    (value) => value === undefined || (value >= 0 && value <= 100),
    'Probability must be between 0 and 100.',
  ),
  notes: z.string().max(NOTES_MAX_LENGTH, `Notes cannot exceed ${NOTES_MAX_LENGTH} characters.`).optional(),
  assigned_to: z.array(z.string()).default([]),
});

export type LeadFormValues = z.input<typeof leadFormSchema>;
export type LeadFormOutput = z.output<typeof leadFormSchema>;

export const EMPTY_LEAD_FORM: LeadFormValues = {
  name: '',
  company: '',
  status: 'New',
  representative_position: '',
  phone: '',
  email: '',
  industry: '',
  province: '',
  website: '',
  source: '',
  vat_number: '',
  vendor_number: '',
  registration_no: '',
  finance_email: '',
  enduser_name: '',
  billing_statement_email: '',
  address: '',
  expected_revenue: '',
  probability: '',
  notes: '',
  assigned_to: [],
};
