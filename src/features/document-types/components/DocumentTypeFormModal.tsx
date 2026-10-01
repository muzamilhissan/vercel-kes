import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Field, Input, Modal } from '@/shared/ui';
import type { CreateDocumentTypeInput, DocumentType } from '../types';

const schema = z.object({
  name: z.string().trim().min(1, 'Name is required.').max(100),
});

type DocumentTypeFormValues = z.infer<typeof schema>;

const EMPTY: DocumentTypeFormValues = { name: '' };

interface DocumentTypeFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentType: DocumentType | null;
  onSubmit: (input: CreateDocumentTypeInput) => Promise<unknown>;
}

export function DocumentTypeFormModal({
  open,
  onOpenChange,
  documentType,
  onSubmit,
}: DocumentTypeFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DocumentTypeFormValues>({ resolver: zodResolver(schema), defaultValues: EMPTY });

  useEffect(() => {
    if (!open) return;
    reset(documentType ? { name: documentType.name } : EMPTY);
  }, [open, documentType, reset]);

  const submit = handleSubmit(async (values) => {
    try {
      await onSubmit(values);
      onOpenChange(false);
    } catch {
    }
  });

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={documentType ? 'Edit Document Type' : 'New Document Type'}
      size="sm"
      dismissible={!isSubmitting}
      footer={
        <>
          <Button variant="subtle" disabled={isSubmitting} onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button form="document-type-form" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </>
      }
    >
      <form id="document-type-form" onSubmit={submit} noValidate>
        <Field label="Name" required error={errors.name?.message}>
          {(field) => (
            <Input
              {...field}
              {...register('name')}
              autoFocus
              placeholder="e.g. Contract, RFQ"
              disabled={isSubmitting}
            />
          )}
        </Field>
      </form>
    </Modal>
  );
}
