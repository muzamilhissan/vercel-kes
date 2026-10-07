import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Combobox, Field, Input, Modal, ModalGrid, Textarea } from '@/shared/ui';
import { DELIVERY_OPTION_MANUAL, PO_DELIVERY_OPTIONS, PO_OWNERS } from '../../constants';
import type { CreatePurchaseOrderInput } from '../../types';
import { useSites } from '../../hooks/useSites';
import { ClientField } from './ClientField';
import { TermsConditionsTable } from './TermsConditionsTable';
import { EMPTY_PO_FORM, createPOSchema, type CreatePOOutput, type CreatePOValues } from './schema';

const OWNER_OPTIONS = PO_OWNERS.map((owner) => ({ value: owner, label: owner }));
const DELIVERY_OPTIONS = PO_DELIVERY_OPTIONS.map((option) => ({
  value: String(option.id),
  label: option.label,
}));

interface CreatePOModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientName: string;
  clientCompany?: string;
  clientId?: number | string | null;
  onSubmit: (input: CreatePurchaseOrderInput) => Promise<unknown>;
}

export function CreatePOModal({
  open,
  onOpenChange,
  clientName,
  clientCompany,
  clientId,
  onSubmit,
}: CreatePOModalProps) {
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

  const addressRequired = Number(watch('delivery_option')) === DELIVERY_OPTION_MANUAL;

  const { sites, isLoading: isLoadingSites } = useSites(clientId, open);
  const siteOptions = useMemo(
    () => sites.map((site) => ({ value: String(site.id), label: site.name })),
    [sites],
  );

  const submit = handleSubmit(async (values) => {
    try {
      await onSubmit({
        ...values,
        client_id: clientId ?? undefined,
        site_id: values.site_id ? Number(values.site_id) : undefined,
      });
      onOpenChange(false);
    } catch {
      // The mutation reports the failure; keep the form open so nothing typed is lost.
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
              <Controller
                control={control}
                name="po_owner"
                render={({ field: control }) => (
                  <Combobox
                    {...field}
                    options={OWNER_OPTIONS}
                    value={control.value}
                    onChange={control.onChange}
                    disabled={isSubmitting}
                  />
                )}
              />
            )}
          </Field>
        </ModalGrid>

        <ModalGrid>
          <Field label="PO Number" error={errors.po_no?.message}>
            {(field) => (
              <Input {...field} {...register('po_no')} placeholder="e.g. PO-W-9001" disabled={isSubmitting} />
            )}
          </Field>
          <Field label="Invoice Number" error={errors.invoice_no?.message}>
            {(field) => (
              <Input {...field} {...register('invoice_no')} placeholder="e.g. POW-9001" disabled={isSubmitting} />
            )}
          </Field>
        </ModalGrid>

        <ModalGrid>
          <Field
            label="Site"
            error={errors.site_id?.message}
            hint={
              !clientId
                ? 'Available once the lead is linked to a client.'
                : !isLoadingSites && siteOptions.length === 0
                  ? 'No sites recorded for this client.'
                  : undefined
            }
          >
            {(field) => (
              <Controller
                control={control}
                name="site_id"
                render={({ field: control }) => (
                  <Combobox
                    {...field}
                    options={siteOptions}
                    value={control.value ?? ''}
                    onChange={control.onChange}
                    clearable
                    placeholder={isLoadingSites ? 'Loading sites...' : 'Select site'}
                    disabled={isSubmitting || isLoadingSites || siteOptions.length === 0}
                  />
                )}
              />
            )}
          </Field>
          <Field label="Delivery Option" required error={errors.delivery_option?.message}>
            {(field) => (
              <Controller
                control={control}
                name="delivery_option"
                render={({ field: control }) => (
                  <Combobox
                    {...field}
                    options={DELIVERY_OPTIONS}
                    value={String(control.value ?? '')}
                    onChange={(next) => control.onChange(Number(next))}
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
          hint={addressRequired ? undefined : 'Only captured when the delivery option is "Input manually".'}
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

        <Field label="Project Description" required error={errors.project_description?.message}>
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
          errors={errors.conditions}
          register={register}
          disabled={isSubmitting}
        />
      </form>
    </Modal>
  );
}
