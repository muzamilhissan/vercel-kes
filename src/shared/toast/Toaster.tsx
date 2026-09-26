import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { toast, useToasts, type ToastType } from './toastStore';

const STYLES: Record<ToastType, { accent: string; icon: typeof Info }> = {
  success: { accent: 'border-l-emerald-500 text-emerald-500', icon: CheckCircle },
  error: { accent: 'border-l-red-500 text-red-500', icon: AlertCircle },
  warning: { accent: 'border-l-amber-500 text-amber-500', icon: AlertTriangle },
  info: { accent: 'border-l-brand text-brand', icon: Info },
};

export function Toaster() {
  const toasts = useToasts();

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed right-6 top-6 z-9999 flex flex-col gap-3"
    >
      {toasts.map(({ id, message, type }) => {
        const { accent, icon: Icon } = STYLES[type];
        return (
          <div
            key={id}
            className={cn(
              'pointer-events-auto flex min-w-[20rem] max-w-[26.25rem] items-center gap-3 rounded-2xl border border-black/5 border-l-4 bg-white/95 px-5 py-4 shadow-[0_10px_30px_rgb(15_23_42_/_0.08)] backdrop-blur-md',
              'motion-safe:animate-in motion-safe:slide-in-from-right-4 motion-safe:fade-in',
              accent,
            )}
          >
            <Icon size={20} className="shrink-0" />
            <span className="flex-1 text-sm font-medium text-ink">{message}</span>
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => toast.dismiss(id)}
              className="shrink-0 text-ink-subtle transition-colors hover:text-ink"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
