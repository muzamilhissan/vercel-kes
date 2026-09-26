import { AlertTriangle, type LucideIcon } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { Modal } from './Modal';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  isPending?: boolean;
  /** Defaults to a warning triangle; pass a verb-specific icon where one reads better. */
  icon?: LucideIcon;
  onConfirm: () => void;
}

const ACTION = 'rounded-xl px-5 py-3 text-sm font-bold transition-all disabled:pointer-events-none disabled:opacity-60';

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  isPending = false,
  icon: Icon = AlertTriangle,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      size="sm"
      plain
      dismissible={!isPending}
      footer={
        <div className="grid w-full grid-cols-2 gap-3">
          <button
            type="button"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
            className={cn(ACTION, 'bg-brand-50 text-brand hover:bg-brand-100')}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={onConfirm}
            className={cn(
              ACTION,
              'text-white',
              destructive ? 'bg-red-500 hover:bg-red-600' : 'bg-brand hover:bg-brand-600',
            )}
          >
            {isPending ? 'Working...' : confirmLabel}
          </button>
        </div>
      }
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <span
          className={cn(
            'grid size-16 place-items-center rounded-2xl',
            destructive ? 'bg-red-50 text-red-500' : 'bg-brand-50 text-brand',
          )}
        >
          <Icon size={28} />
        </span>
        <h2 className="text-xl font-bold text-ink">{title}</h2>
        <p className="text-[0.9375rem] leading-relaxed text-ink-muted">{message}</p>
      </div>
    </Modal>
  );
}
