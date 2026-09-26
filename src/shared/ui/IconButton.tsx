import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/shared/lib/cn';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required: icon-only controls need an accessible name. */
  label: string;
  /** Render the child element (e.g. an anchor) instead of a <button>. */
  asChild?: boolean;
}

/** The small square action control used in table rows and card footers. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ label, className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : 'button'}
        title={label}
        aria-label={label}
        className={cn(
          'grid size-[2.125rem] shrink-0 place-items-center rounded-[0.625rem] border border-field bg-surface text-ink-muted transition-all',
          'hover:-translate-y-0.5 hover:border-brand hover:bg-brand-50 hover:text-brand',
          'disabled:pointer-events-none disabled:opacity-50',
          className,
        )}
        {...props}
      />
    );
  },
);
IconButton.displayName = 'IconButton';
