import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Field, Input, Modal, ModalGrid, Textarea } from '@/shared/ui';
import { capitalize, toAbsoluteUrl } from '@/shared/lib/text';
import type { Account, CreateAccountInput } from '../types';

const DESCRIPTION_LIMIT = 1000;

const schema = z.object({
  name: z.string().trim().min(1, 'Company name is required.').max(150),
  industry: z.string().trim().min(1, 'Industry is required.').max(150),
  website: z
    .string()
    .trim()
    .min(1, 'Website is required.')
    .regex(/^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/, 'Enter a valid website URL (e.g. example.com).'),
  description: z.string().max(DESCRIPTION_LIMIT).optional(),
});

type AccountFormValues = z.infer<typeof schema>;

const EMPTY: AccountFormValues = { name: '', industry: '', website: '', description: '' };

/** The stored website carries a protocol; the field shows the bare domain. */
const stripProtocol = (url: string | undefined) => (url ?? '').replace(/^https?:\/\//i, '');

interface AccountFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: Account | null;
  onSubmit: (input: CreateAccountInput) => Promise<unknown>;
}

export function AccountFormModal({ open, onOpenChange, account, onSubmit }: AccountFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AccountFormValues>({ resolver: zodResolver(schema), defaultValues: EMPTY });

  useEffect(() => {
    if (!open) return;
    reset(
      account
        ? {
            name: account.name,
            industry: account.industry,
            website: stripProtocol(account.website),
            description: account.description ?? '',
          }
        : EMPTY,
    );
  }, [open, account, reset]);

  const descriptionLength = watch('description')?.length ?? 0;

  const submit = handleSubmit(async (values) => {
    await onSubmit({
      name: capitalize(values.name),
      industry: capitalize(values.industry),
      website: toAbsoluteUrl(values.website),
      description: values.description ?? '',
    });
    onOpenChange(false);
  });

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={account ? 'Edit Account' : 'New Account'}
      dismissible={!isSubmitting}
      footer={
        <>
          <Button variant="subtle" disabled={isSubmitting} onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button form="account-form" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </>
      }
    >
      <form id="account-form" onSubmit={submit} className="flex flex-col gap-4 sm:gap-5" noValidate>
        <ModalGrid>
          <Field label="Company Name" required error={errors.name?.message}>
            {(field) => <Input {...field} {...register('name')} placeholder="Enter name" disabled={isSubmitting} />}
          </Field>
          <Field label="Industry" required error={errors.industry?.message}>
            {(field) => (
              <Input {...field} {...register('industry')} placeholder="e.g. Technology" disabled={isSubmitting} />
            )}
          </Field>
        </ModalGrid>

        <Field label="Website" required error={errors.website?.message}>
          {(field) => (
            <div className="flex items-center rounded-xl border border-line bg-surface-muted pl-3.5 transition-all focus-within:border-brand focus-within:bg-surface focus-within:shadow-[0_0_0_3px_rgb(112_48_159_/_0.1)]">
              <span className="shrink-0 text-sm font-medium text-ink-subtle">https://</span>
              <Input
                {...field}
                {...register('website')}
                placeholder="e.g. google.com"
                disabled={isSubmitting}
                className="border-0 bg-transparent pl-0 focus:shadow-none"
              />
            </div>
          )}
        </Field>

        <Field label="Description" error={errors.description?.message}>
          {(field) => (
            <>
              <Textarea
                {...field}
                {...register('description')}
                rows={3}
                maxLength={DESCRIPTION_LIMIT}
                placeholder="Enter description..."
                disabled={isSubmitting}
              />
              <p className="mt-1 text-right text-xs text-ink-muted">
                {descriptionLength}/{DESCRIPTION_LIMIT}
              </p>
            </>
          )}
        </Field>
      </form>
    </Modal>
  );
}
