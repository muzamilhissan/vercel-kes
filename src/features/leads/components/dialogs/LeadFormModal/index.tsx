import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Combobox, Field, Input, Modal, ModalGrid, PhoneField, Textarea } from '@/shared/ui';
import { cn } from '@/shared/lib/cn';
import { LEAD_STATUSES } from '../../../constants';
import { assigneesOf, normalizeAssignee, type LeadAssignee } from '../../../lib/assignees';
import type { Lead } from '../../../types';
import { AssigneePicker } from './AssigneePicker';
import { PositionField } from './PositionField';
import { WebsiteField } from './WebsiteField';
import {
  EMPTY_LEAD_FORM,
  LOCKED_STATUSES,
  NOTES_MAX_LENGTH,
  leadFormSchema,
  stripScheme,
  type LeadFormOutput,
  type LeadFormValues,
} from './schema';
import type { User } from '@/shared/types/api';

const STATUS_OPTIONS = LEAD_STATUSES.map((status) => ({ value: status, label: status }));

interface LeadFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead | null;
  isSuperAdmin: boolean;
  assignableUsers: User[];
  onSubmit: (values: LeadFormOutput) => Promise<unknown>;
}

export function LeadFormModal({
  open,
  onOpenChange,
  lead,
  isSuperAdmin,
  assignableUsers,
  onSubmit,
}: LeadFormModalProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<LeadFormValues, unknown, LeadFormOutput>({ resolver: zodResolver(leadFormSchema) });

  const notesLength = (watch('notes') ?? '').length;

  const users = useMemo(
    () => assignableUsers.map(normalizeAssignee).filter((user): user is LeadAssignee => user !== null),
    [assignableUsers],
  );

  useEffect(() => {
    if (!open) return;
    reset(
      lead
        ? {
            ...EMPTY_LEAD_FORM,
            name: lead.name,
            company: lead.company,
            status: (lead.status as LeadFormValues['status']) ?? 'New',
            representative_position: lead.representative_position ?? '',
            phone: lead.phone ?? '',
            email: lead.email,
            industry: lead.industry ?? '',
            province: lead.province ?? '',
            website: stripScheme(lead.website ?? ''),
            source: lead.source ?? '',
            vat_number: lead.vat_number ?? '',
            vendor_number: lead.vendor_number ?? '',
            registration_no: lead.registration_no ?? '',
            finance_email: lead.finance_email ?? '',
            enduser_name: lead.enduser_name ?? '',
            billing_statement_email: lead.billing_statement_email ?? '',
            address: lead.address ?? '',
            expected_revenue: lead.expected_revenue ?? '',
            probability: lead.probability ?? '',
            notes: lead.notes ?? '',
            assigned_to: assigneesOf(lead).map((assignee) => assignee.id),
          }
        : EMPTY_LEAD_FORM,
    );
  }, [open, lead, reset]);

  // Status is set by the pipeline on create, and frozen once a lead is qualified or converted.
  const statusDisabled = !lead || LOCKED_STATUSES.includes(lead.status ?? '');

  const submit = handleSubmit(async (values) => {
    await onSubmit(values);
    onOpenChange(false);
  });

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={lead ? 'Edit Lead' : 'New Lead'}
      size="lg"
      dismissible={!isSubmitting}
      footer={
        <>
          <Button variant="subtle" disabled={isSubmitting} onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button form="lead-form" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </>
      }
    >
      <form id="lead-form" onSubmit={submit} className="flex flex-col gap-4 sm:gap-5" noValidate>
        <ModalGrid>
          <Field label="Lead Name" required error={errors.name?.message}>
            {(field) => <Input {...field} {...register('name')} placeholder="Enter name" disabled={isSubmitting} />}
          </Field>
          <Field label="Company" required error={errors.company?.message}>
            {(field) => (
              <Input {...field} {...register('company')} placeholder="Enter company name" disabled={isSubmitting} />
            )}
          </Field>
        </ModalGrid>

        <ModalGrid>
          <Field label="Status" error={errors.status?.message}>
            {(field) => (
              <Controller
                control={control}
                name="status"
                render={({ field: control }) => (
                  <Combobox
                    {...field}
                    options={STATUS_OPTIONS}
                    value={control.value}
                    onChange={control.onChange}
                    disabled={statusDisabled || isSubmitting}
                  />
                )}
              />
            )}
          </Field>
          <Field label="Representative's Position" error={errors.representative_position?.message}>
            {(field) => (
              <Controller
                control={control}
                name="representative_position"
                render={({ field: control }) => (
                  <PositionField
                    id={field.id}
                    value={control.value ?? ''}
                    onChange={control.onChange}
                    disabled={isSubmitting}
                  />
                )}
              />
            )}
          </Field>
        </ModalGrid>

        <ModalGrid>
          <Field label="Phone" required error={errors.phone?.message}>
            {(field) => (
              <Controller
                control={control}
                name="phone"
                render={({ field: control }) => (
                  <PhoneField
                    id={field.id}
                    aria-describedby={field['aria-describedby']}
                    value={control.value}
                    onChange={(value) => control.onChange(value ?? '')}
                    onBlur={control.onBlur}
                    invalid={field['aria-invalid']}
                    disabled={isSubmitting}
                  />
                )}
              />
            )}
          </Field>
          <Field label="Email" required error={errors.email?.message}>
            {(field) => (
              <Input {...field} {...register('email')} type="email" placeholder="Enter email address" disabled={isSubmitting} />
            )}
          </Field>
        </ModalGrid>

        <ModalGrid>
          <Field label="Industry" required error={errors.industry?.message}>
            {(field) => <Input {...field} {...register('industry')} placeholder="Enter industry" disabled={isSubmitting} />}
          </Field>
          <Field label="Province" required error={errors.province?.message}>
            {(field) => <Input {...field} {...register('province')} placeholder="Enter province" disabled={isSubmitting} />}
          </Field>
        </ModalGrid>

        <ModalGrid>
          <Field label="Website" error={errors.website?.message}>
            {(field) => (
              <Controller
                control={control}
                name="website"
                render={({ field: control }) => (
                  <WebsiteField
                    id={field.id}
                    aria-describedby={field['aria-describedby']}
                    invalid={field['aria-invalid']}
                    value={control.value ?? ''}
                    onChange={control.onChange}
                    onBlur={control.onBlur}
                    disabled={isSubmitting}
                  />
                )}
              />
            )}
          </Field>
          <Field label="Source" error={errors.source?.message}>
            {(field) => (
              <Input {...field} {...register('source')} placeholder="e.g. Referral, Website" disabled={isSubmitting} />
            )}
          </Field>
        </ModalGrid>

        <ModalGrid>
          <Field label="Expected Revenue" error={errors.expected_revenue?.message}>
            {(field) => (
              <Input {...field} {...register('expected_revenue')} type="number" min={0} placeholder="Enter expected revenue" disabled={isSubmitting} />
            )}
          </Field>
          <Field label="Probability (%)" error={errors.probability?.message}>
            {(field) => (
              <Input {...field} {...register('probability')} type="number" min={0} max={100} step="any" placeholder="Enter probability" disabled={isSubmitting} />
            )}
          </Field>
        </ModalGrid>

        <ModalGrid>
          <Field label="VAT Number" error={errors.vat_number?.message}>
            {(field) => (
              <Input {...field} {...register('vat_number')} placeholder="Enter VAT number" disabled={isSubmitting} />
            )}
          </Field>
          <Field label="Vendor Number" error={errors.vendor_number?.message}>
            {(field) => (
              <Input {...field} {...register('vendor_number')} placeholder="Enter vendor number" disabled={isSubmitting} />
            )}
          </Field>
        </ModalGrid>

        <ModalGrid>
          <Field label="Registration No." error={errors.registration_no?.message}>
            {(field) => (
              <Input {...field} {...register('registration_no')} placeholder="Enter registration number" disabled={isSubmitting} />
            )}
          </Field>
          <Field label="Enduser Name" error={errors.enduser_name?.message}>
            {(field) => (
              <Input {...field} {...register('enduser_name')} placeholder="Enter enduser name" disabled={isSubmitting} />
            )}
          </Field>
        </ModalGrid>

        <ModalGrid>
          <Field label="Finance Email Address" required error={errors.finance_email?.message}>
            {(field) => (
              <Input {...field} {...register('finance_email')} type="email" placeholder="Enter finance email address" disabled={isSubmitting} />
            )}
          </Field>
          <Field label="Billing Statement Email" required error={errors.billing_statement_email?.message}>
            {(field) => (
              <Input {...field} {...register('billing_statement_email')} type="email" placeholder="Enter billing statement email" disabled={isSubmitting} />
            )}
          </Field>
        </ModalGrid>

        <Field label="Address" required error={errors.address?.message}>
          {(field) => (
            <Textarea
              {...field}
              {...register('address')}
              rows={2}
              placeholder="Head office address or PO Box"
              disabled={isSubmitting}
            />
          )}
        </Field>

        {isSuperAdmin && users.length > 0 && (
          <Controller
            control={control}
            name="assigned_to"
            render={({ field }) => (
              <AssigneePicker
                users={users}
                selectedIds={field.value ?? []}
                onChange={field.onChange}
                disabled={isSubmitting}
              />
            )}
          />
        )}

        <Field label="Notes" error={errors.notes?.message}>
          {(field) => (
            <>
              <Textarea
                {...field}
                {...register('notes')}
                maxLength={NOTES_MAX_LENGTH}
                placeholder="Enter notes..."
                disabled={isSubmitting}
              />
              <span
                aria-live="polite"
                className={cn(
                  'mt-1.5 text-right text-xs tabular-nums',
                  notesLength >= NOTES_MAX_LENGTH ? 'font-semibold text-red-600' : 'text-ink-muted',
                )}
              >
                {notesLength}/{NOTES_MAX_LENGTH}
              </span>
            </>
          )}
        </Field>
      </form>
    </Modal>
  );
}
