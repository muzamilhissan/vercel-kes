import { forwardRef, useId } from 'react';
import { cn } from '@/shared/lib/cn';

/**
 * The one form-control style in the app. Combobox and PhoneField build on this so
 * every control in a modal shares the same height, radius and focus treatment.
 */
export const CONTROL_BASE =
  'w-full rounded-xl border border-line bg-surface-muted px-3.5 py-2.5 text-sm font-medium text-ink transition-all placeholder:text-ink-subtle focus:border-brand focus:bg-surface focus:shadow-[0_0_0_3px_rgb(112_48_159_/_0.1)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60';

export const CONTROL_INVALID =
  'border-red-300 focus:border-red-500 focus:shadow-[0_0_0_3px_rgb(239_68_68_/_0.1)]';

export interface FieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: (props: { id: string; 'aria-invalid': boolean; 'aria-describedby'?: string }) => React.ReactNode;
}

/** Label + control + error wrapper. The child renders the control with the wired-up a11y props. */
export function Field({ label, required, error, hint, className, children }: FieldProps) {
  const id = useId();
  const messageId = error || hint ? `${id}-message` : undefined;

  return (
    <div className={cn('flex flex-col', className)}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-label font-semibold text-slate-600">
          {label}
          {required && <span className="ml-[3px] font-bold text-red-600">*</span>}
        </label>
      )}
      {children({ id, 'aria-invalid': Boolean(error), 'aria-describedby': messageId })}
      {(error || hint) && (
        <p id={messageId} className={cn('mt-1.5 text-xs', error ? 'text-red-600' : 'text-ink-muted')}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
}

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(CONTROL_BASE, props['aria-invalid'] && CONTROL_INVALID, className)} {...props} />
  ),
);
Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, rows = 4, ...props }, ref) => (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(CONTROL_BASE, 'resize-y', props['aria-invalid'] && CONTROL_INVALID, className)}
      {...props}
    />
  ),
);
Textarea.displayName = 'Textarea';

export const NativeSelect = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => (
    <select ref={ref} className={cn(CONTROL_BASE, 'cursor-pointer', props['aria-invalid'] && CONTROL_INVALID, className)} {...props} />
  ),
);
NativeSelect.displayName = 'NativeSelect';
