import { Button, Modal } from '@/shared/ui';
import { DealAttachments } from './DealAttachments';
import type { Deal } from '../types';

interface DealAttachmentsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deal: Deal | null;
}

export function DealAttachmentsModal({ open, onOpenChange, deal }: DealAttachmentsModalProps) {
  if (!deal) return null;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Attachments"
      description={deal.name}
      footer={<Button onClick={() => onOpenChange(false)}>Close</Button>}
    >
      <DealAttachments dealId={deal.id} />
    </Modal>
  );
}
