import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Field, Input, Modal, ModalGrid, Textarea } from '@/shared/ui';
import { todayInputValue } from '@/shared/lib/format';
import { followUpDate, followUpTime, type CreateFollowUpInput, type LeadFollowUp } from '../types';

const NOTES_LIMIT = 500;

const schema = z.object({
  date: z.string().min(1, 'Date is required.'),
  time: z.string().min(1, 'Time is required.'),
  notes: z.string().max(NOTES_LIMIT).optional(),
});

type FollowUpFormValues = z.infer<typeof schema>;

const EMPTY: FollowUpFormValues = { date: '', time: '', notes: '' };

interface FollowUpFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  followUp: LeadFollowUp | null;
  onSubmit: (input: CreateFollowUpInput) => Promise<unknown>;
}

export function FollowUpFormModal({ open, onOpenChange, followUp, onSubmit }: FollowUpFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FollowUpFormValues>({ resolver: zodResolver(schema), defaultValues: EMPTY });

  useEffect(() => {
    if (!open) return;
    reset(
      followUp
        ? { date: followUpDate(followUp), time: followUpTime(followUp), notes: followUp.notes ?? '' }
        : EMPTY,
    );
  }, [open, followUp, reset]);

  const notesLength = watch('notes')?.length ?? 0;
  const atLimit = notesLength >= NOTES_LIMIT;

  const submit = handleSubmit(async (values) => {
    await onSubmit(values);
    onOpenChange(false);
  });

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={followUp ? 'Edit Follow-up' : 'Schedule Follow-up'}
      size="sm"
      dismissible={!isSubmitting}
      footer={
        <>
          <Button variant="subtle" disabled={isSubmitting} onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button form="follow-up-form" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </>
      }
    >
      <form id="follow-up-form" onSubmit={submit} className="flex flex-col gap-5" noValidate>
        <ModalGrid>
          <Field label="Date" required error={errors.date?.message}>
            {(field) => <Input {...field} {...register('date')} type="date" min={todayInputValue()} disabled={isSubmitting} />}
          </Field>
          <Field label="Time" required error={errors.time?.message}>
            {(field) => <Input {...field} {...register('time')} type="time" disabled={isSubmitting} />}
          </Field>
        </ModalGrid>

        <Field label="Notes" error={errors.notes?.message}>
          {(field) => (
            <>
              <Textarea
                {...field}
                {...register('notes')}
                rows={5}
                maxLength={NOTES_LIMIT}
                placeholder="Add details about this follow-up..."
                disabled={isSubmitting}
              />
              <p className={`mt-1 text-right text-2xs font-medium ${atLimit ? 'text-red-500' : 'text-ink-muted'}`}>
                {atLimit ? 'Maximum character limit reached — ' : ''}
                {notesLength}/{NOTES_LIMIT}
              </p>
            </>
          )}
        </Field>
      </form>
    </Modal>
  );
}
