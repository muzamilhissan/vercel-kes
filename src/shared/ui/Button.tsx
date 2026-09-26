import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/cn';

const button = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all duration-200 ease-control disabled:pointer-events-none disabled:opacity-60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/15',
  {
    variants: {
      variant: {
        primary:
          'bg-brand text-white shadow-brand hover:-translate-y-0.5 hover:bg-brand-600 hover:shadow-brand-lg active:translate-y-0',
        secondary: 'border-[1.5px] border-line bg-surface text-ink-muted hover:border-brand hover:text-brand',
        ghost: 'text-ink-muted hover:bg-field hover:text-ink',
        danger: 'bg-red-500 text-white hover:bg-red-600',
        subtle: 'bg-field text-ink hover:bg-line',
      },
      size: {
        sm: 'h-9 rounded-field px-3 text-label',
        md: 'h-10 rounded-control px-5 text-sm',
        lg: 'h-11 rounded-control px-6 text-sm',
        icon: 'size-10 rounded-field',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {
  /** Render the child element instead of a <button>, keeping the styles. */
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, type = 'button', ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp ref={ref} type={asChild ? undefined : type} className={cn(button({ variant, size }), className)} {...props} />
    );
  },
);
Button.displayName = 'Button';
