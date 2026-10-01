import { DetailList, Modal } from '@/shared/ui';
import { capitalize } from '@/shared/lib/text';
import type { Contact } from '../types';

interface ContactDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: Contact | null;
  accountName: string;
}

export function ContactDetailsModal({ open, onOpenChange, contact, accountName }: ContactDetailsModalProps) {
  if (!contact) return null;

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Contact Details">
      <DetailList
        columns={2}
        items={[
          { label: 'Full Name', value: capitalize(contact.name) },
          { label: 'Job Title', value: contact.job_title ? capitalize(contact.job_title) : 'N/A' },
          { label: 'Company', value: contact.company ? capitalize(contact.company) : 'N/A' },
          { label: 'Linked Account', value: accountName || 'No Account' },
          { label: 'Email', value: contact.email, breakAll: true },
          { label: 'Phone Number', value: contact.phone },
        ]}
      />
    </Modal>
  );
}
