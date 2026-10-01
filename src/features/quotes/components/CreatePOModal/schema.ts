import { z } from 'zod';
import { DELIVERY_REQUIRES_ADDRESS, PO_DELIVERY_OPTIONS } from '../../constants';

const termCondition = z.object({
  title: z.string().trim().min(1, 'Condition title is required.').max(150),
  description: z.string().trim().min(1, 'Condition detail is required.').max(1000),
});

export const createPOSchema = z
  .object({
    po_number: z.string().trim().min(1, 'PO number is required.').max(60),
    invoice_number: z.string().trim().max(60).optional(),
    po_owner: z.string().trim().min(1, 'PO owner is required.').max(150),
    site: z.string().trim().min(1, 'Site is required.').max(150),
    delivery_option: z.enum(PO_DELIVERY_OPTIONS),
    delivery_address: z.string().trim().max(500).optional(),
    project_description: z.string().trim().max(2000).optional(),
    terms_conditions: z.array(termCondition).default([]),
  })
  .refine((values) => values.delivery_option !== DELIVERY_REQUIRES_ADDRESS || Boolean(values.delivery_address), {
    path: ['delivery_address'],
    message: 'Delivery address is required for delivery.',
  });

export type CreatePOValues = z.input<typeof createPOSchema>;
export type CreatePOOutput = z.output<typeof createPOSchema>;

export const EMPTY_CONDITION = { title: '', description: '' };

export const EMPTY_PO_FORM: CreatePOValues = {
  po_number: '',
  invoice_number: '',
  po_owner: '',
  site: '',
  delivery_option: 'Delivery',
  delivery_address: '',
  project_description: '',
  terms_conditions: [],
};
