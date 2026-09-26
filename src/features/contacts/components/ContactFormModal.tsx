import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Combobox, Field, Input, Modal, ModalGrid, PhoneField, isValidPhoneNumber } from '@/shared/ui';
import { useAccountOptions } from '@/features/accounts/hooks/useAccountOptions';
import type { Contact, CreateContactInput } from '../types';

const schema = z.object({
  name: z.string().trim().min(1, 'Full name is required.').max(150),
  job_title: z.string().trim().min(1, 'Job title is required.').max(150),
  account_id: z.string().min(1, 'Account is required.'),
  email: z.string().trim().min(1, 'Email is required.').email('Enter a valid email address.'),
  phone: z
    .string()
    .min(1, 'Phone number is required.')
    .refine(isValidPhoneNumber, 'Please enter a valid phone number.'),
});

type ContactFormValues = z.infer<typeof schema>;

const EMPTY: ContactFormValues = { name: '', job_title: '', account_id: '', email: '', phone: '' };

interface ContactFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: Contact | null;
  onSubmit: (input: CreateContactInput) => Promise<unknown>;
}

export function ContactFormModal({ open, onOpenChange, contact, onSubmit }: ContactFormModalProps) {
  const { options } = useAccountOptions();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({ resolver: zodResolver(schema), defaultValues: EMPTY });

  useEffect(() => {
    if (!open) return;
    reset(
      contact
        ? {
            name: contact.name,
            job_title: contact.job_title ?? '',
            account_id: contact.account_id ? String(contact.account_id) : '',
            email: contact.email,
            phone: contact.phone ?? '',
          }
        : EMPTY,
    );
  }, [open, contact, reset]);

  const submit = handleSubmit(async (values) => {
    await onSubmit(values);
    onOpenChange(false);
  });

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={contact ? 'Edit Contact' : 'Create New'}
      dismissible={!isSubmitting}
      footer={
        <>
          <Button variant="subtle" disabled={isSubmitting} onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button form="contact-form" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </>
      }
    >
      <form id="contact-form" onSubmit={submit} className="flex flex-col gap-4 sm:gap-5" noValidate>
        <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
          <Field label="Full Name" required error={errors.name?.message}>
            {(field) => <Input {...field} {...register('name')} placeholder="Enter full name" disabled={isSubmitting} />}
          </Field>
          <Field label="Job Title" required error={errors.job_title?.message}>
            {(field) => (
              <Input {...field} {...register('job_title')} placeholder="Enter job title" disabled={isSubmitting} />
            )}
          </Field>
          <Field label="Account" required error={errors.account_id?.message}>
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
                    placeholder="Select Account"
                    searchPlaceholder="Search accounts..."
                    disabled={isSubmitting}
                  />
                )}
              />
            )}
          </Field>
        </div>

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
              <Input
                {...field}
                {...register('email')}
                type="email"
                placeholder="Enter email address"
                disabled={isSubmitting}
              />
            )}
          </Field>
        </ModalGrid>
      </form>
    </Modal>
  );
}
