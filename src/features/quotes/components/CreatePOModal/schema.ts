import { z } from 'zod';
import { DELIVERY_OPTION_MANUAL, PO_OWNERS } from '../../constants';

const condition = z.object({
  label: z.string().trim().min(1, 'Condition label is required.').max(150),
  description: z.string().trim().min(1, 'Condition detail is required.').max(1000),
});

export const createPOSchema = z
  .object({
    po_no: z.string().trim().max(60).optional(),
    invoice_no: z.string().trim().max(60).optional(),
    po_owner: z.enum(PO_OWNERS, { message: 'PO owner is required.' }),
    delivery_option: z.coerce.number().int().min(1).max(3),
    delivery_address: z.string().trim().max(500).optional(),
    project_description: z.string().trim().min(1, 'Project description is required.').max(2000),
    conditions: z.array(condition).default([]),
  })
  .refine(
    (values) => values.delivery_option !== DELIVERY_OPTION_MANUAL || Boolean(values.delivery_address),
    {
      path: ['delivery_address'],
      message: 'Delivery address is required when the delivery option is "Input manually".',
    },
  );

export type CreatePOValues = z.input<typeof createPOSchema>;
export type CreatePOOutput = z.output<typeof createPOSchema>;

export const EMPTY_CONDITION = { label: '', description: '' };

export const EMPTY_PO_FORM: CreatePOValues = {
  po_no: '',
  invoice_no: '',
  po_owner: 'Kudon',
  delivery_option: 1,
  delivery_address: '',
  project_description: '',
  conditions: [],
};
