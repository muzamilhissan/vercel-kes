import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Combobox, Field, Input, Modal, ModalGrid, Textarea } from '@/shared/ui';
import { useAccountOptions } from '@/features/accounts/hooks/useAccountOptions';
import { toDateInputValue, todayInputValue } from '@/shared/lib/format';
import { STAGE_OPTIONS } from '../constants';
import type { CreateDealInput, Deal } from '../types';

const NOTES_LIMIT = 1000;

const schema = z.object({
  name: z.string().trim().min(1, 'Deal name is required.'),
  value: z.coerce.number().min(0, 'Value must be zero or more.'),
  stage: z.string().min(1, 'Stage is required.'),
  account_id: z.string().min(1, 'Linked account is required.'),
  close_date: z
    .string()
    .min(1, 'Expected close date is required.')
    .refine((value) => value >= todayInputValue(), 'Expected Close Date cannot be in the past.'),
  notes: z.string().max(NOTES_LIMIT).optional(),
});

type DealFormValues = z.input<typeof schema>;
type DealFormOutput = z.output<typeof schema>;

interface DealFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deal: Deal | null;
  onSubmit: (input: CreateDealInput) => Promise<unknown>;
}

export function DealFormModal({ open, onOpenChange, deal, onSubmit }: DealFormModalProps) {
  const { options, isPending: isLoadingAccounts } = useAccountOptions();
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<DealFormValues, unknown, DealFormOutput>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (!open) return;
    reset({
      name: deal?.name ?? '',
      value: deal?.value ?? 0,
      stage: deal?.stage ?? 'New',
      account_id: deal?.account_id ? String(deal.account_id) : '',
      close_date: deal ? toDateInputValue(deal.close_date) : todayInputValue(),
      notes: deal?.notes ?? '',
    });
  }, [open, deal, reset]);

  const notesLength = watch('notes')?.length ?? 0;

  const submit = handleSubmit(async (values) => {
    await onSubmit(values);
    onOpenChange(false);
  });

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={deal ? 'Edit Deal' : 'Create New Deal'}
      dismissible={!isSubmitting}
      footer={
        <>
          <Button variant="subtle" disabled={isSubmitting} onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button form="deal-form" type="submit" disabled={isSubmitting || isLoadingAccounts}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </>
      }
    >
      <form id="deal-form" onSubmit={submit} className="flex flex-col gap-4 sm:gap-5" noValidate>
        <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
          <Field label="Deal Name" required error={errors.name?.message}>
            {(field) => (
              <Input {...field} {...register('name')} placeholder="e.g. HVAC Installation" disabled={isSubmitting} />
            )}
          </Field>
          <Field label="Value ($)" required error={errors.value?.message}>
            {(field) => (
              <Input
                {...field}
                {...register('value')}
                type="number"
                min={0}
                placeholder="Enter deal value"
                disabled={isSubmitting}
              />
            )}
          </Field>
          <Field label="Stage" error={errors.stage?.message}>
            {(field) => (
              <Controller
                control={control}
                name="stage"
                render={({ field: control }) => (
                  <Combobox
                    {...field}
                    options={STAGE_OPTIONS}
                    value={control.value}
                    onChange={control.onChange}
                    disabled={isSubmitting}
                  />
                )}
              />
            )}
          </Field>
        </div>

        <ModalGrid>
          <Field label="Linked Account" required error={errors.account_id?.message}>
            {(field) => (
              <Controller
                control={control}
                name="account_id"
                render={({ field: control }) => (
                  <Combobox
                    {...field}
                    options={options}
                    value={control.value}
                    onChange={control.onChange}
                    placeholder="-- Select Account --"
                    searchPlaceholder="Search accounts..."
                    disabled={isSubmitting || isLoadingAccounts}
                  />
                )}
              />
            )}
          </Field>
          <Field label="Expected Close Date" required error={errors.close_date?.message}>
            {(field) => (
              <Input
                {...field}
                {...register('close_date')}
                type="date"
                min={todayInputValue()}
                disabled={isSubmitting}
              />
            )}
          </Field>
        </ModalGrid>

        <Field label="Notes" error={errors.notes?.message}>
          {(field) => (
            <>
              <Textarea
                {...field}
                {...register('notes')}
                rows={3}
                maxLength={NOTES_LIMIT}
                placeholder="Any optional notes"
                disabled={isSubmitting}
              />
              <p className="mt-1 text-right text-xs text-ink-muted">
                {notesLength}/{NOTES_LIMIT}
              </p>
            </>
          )}
        </Field>
      </form>
    </Modal>
  );
}
