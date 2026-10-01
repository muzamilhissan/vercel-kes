import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Combobox, Field, Input, Modal, ModalGrid, Textarea } from '@/shared/ui';
import { DELIVERY_REQUIRES_ADDRESS, PO_DELIVERY_OPTIONS } from '../../constants';
import type { CreatePurchaseOrderInput } from '../../types';
import { ClientField } from './ClientField';
import { TermsConditionsTable } from './TermsConditionsTable';
import { EMPTY_PO_FORM, createPOSchema, type CreatePOOutput, type CreatePOValues } from './schema';

const DELIVERY_OPTIONS = PO_DELIVERY_OPTIONS.map((option) => ({ value: option, label: option }));

interface CreatePOModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientName: string;
  clientCompany?: string;
  onSubmit: (input: CreatePurchaseOrderInput) => Promise<unknown>;
}

export function CreatePOModal({ open, onOpenChange, clientName, clientCompany, onSubmit }: CreatePOModalProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreatePOValues, unknown, CreatePOOutput>({
    resolver: zodResolver(createPOSchema),
    defaultValues: EMPTY_PO_FORM,
  });

  useEffect(() => {
    if (open) reset(EMPTY_PO_FORM);
  }, [open, reset]);

  const addressRequired = watch('delivery_option') === DELIVERY_REQUIRES_ADDRESS;

  const submit = handleSubmit(async (values) => {
    try {
      await onSubmit({ ...values, client_name: clientName, client_company: clientCompany });
      onOpenChange(false);
    } catch {
    }
  });

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Create a New PO"
      description={`Purchase order for ${clientCompany || clientName}`}
      size="xl"
      dismissible={!isSubmitting}
      footer={
        <>
          <Button variant="subtle" disabled={isSubmitting} onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button form="create-po-form" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create PO'}
          </Button>
        </>
      }
    >
      <form id="create-po-form" onSubmit={submit} className="flex flex-col gap-4 sm:gap-5" noValidate>
        <ModalGrid>
          <ClientField name={clientName} company={clientCompany} />
          <Field label="PO Owner" required error={errors.po_owner?.message}>
            {(field) => (
              <Input {...field} {...register('po_owner')} placeholder="Who owns this PO" disabled={isSubmitting} />
            )}
          </Field>
        </ModalGrid>

        <ModalGrid>
          <Field label="PO Number" required error={errors.po_number?.message}>
            {(field) => (
              <Input {...field} {...register('po_number')} placeholder="e.g. PO-2026-0142" disabled={isSubmitting} />
            )}
          </Field>
          <Field label="Invoice Number" error={errors.invoice_number?.message}>
            {(field) => (
              <Input {...field} {...register('invoice_number')} placeholder="e.g. INV-00871" disabled={isSubmitting} />
            )}
          </Field>
        </ModalGrid>

        <ModalGrid>
          <Field label="Site" required error={errors.site?.message}>
            {(field) => <Input {...field} {...register('site')} placeholder="Enter site" disabled={isSubmitting} />}
          </Field>
          <Field label="Delivery Option" error={errors.delivery_option?.message}>
            {(field) => (
              <Controller
                control={control}
                name="delivery_option"
                render={({ field: control }) => (
                  <Combobox
                    {...field}
                    options={DELIVERY_OPTIONS}
                    value={control.value}
                    onChange={control.onChange}
                    disabled={isSubmitting}
                  />
                )}
              />
            )}
          </Field>
        </ModalGrid>

        <Field
          label="Delivery Address"
          required={addressRequired}
          error={errors.delivery_address?.message}
          hint={addressRequired ? undefined : 'Not needed for collection from site.'}
        >
          {(field) => (
            <Textarea
              {...field}
              {...register('delivery_address')}
              rows={2}
              placeholder="Where the order is delivered"
              disabled={isSubmitting || !addressRequired}
            />
          )}
        </Field>

        <Field label="Project Description" error={errors.project_description?.message}>
          {(field) => (
            <Textarea
              {...field}
              {...register('project_description')}
              rows={3}
              placeholder="What this PO covers..."
              disabled={isSubmitting}
            />
          )}
        </Field>

        <TermsConditionsTable
          control={control}
          errors={errors.terms_conditions}
          register={register}
          disabled={isSubmitting}
        />
      </form>
    </Modal>
  );
}
