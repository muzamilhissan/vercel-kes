import { CheckCircle, UserPlus } from 'lucide-react';
import { Button, Modal } from '@/shared/ui';

const OUTCOMES = ['Create Account record', 'Link to active deals', 'Transfer logs'];

interface ConvertLeadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadName: string;
  isPending: boolean;
  onConfirm: () => void;
}

export function ConvertLeadModal({ open, onOpenChange, leadName, isPending, onConfirm }: ConvertLeadModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Elevate to Contact"
      size="sm"
      dismissible={!isPending}
      footer={
        <>
          <Button variant="subtle" disabled={isPending} onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={isPending} onClick={onConfirm}>
            {isPending ? 'Converting...' : 'Convert'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-brand-50 text-brand">
          <UserPlus size={28} />
        </span>
        <p className="text-sm text-ink-muted">
          You are converting <strong className="text-ink">{leadName}</strong> into a permanent record.
        </p>
      </div>

      <ul className="flex flex-col gap-2 rounded-2xl bg-surface-muted p-4">
        {OUTCOMES.map((outcome) => (
          <li key={outcome} className="flex items-center gap-2 text-sm text-slate-700">
            <CheckCircle size={16} className="shrink-0 text-emerald-500" />
            {outcome}
          </li>
        ))}
      </ul>
    </Modal>
  );
}
