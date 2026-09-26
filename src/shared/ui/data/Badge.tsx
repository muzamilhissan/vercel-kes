import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/cn';

const badge = cva('inline-block rounded-[0.625rem] px-3 py-1.5 text-xs font-bold', {
  variants: {
    tone: {
      neutral: 'bg-field text-slate-600',
      info: 'bg-sky-100 text-sky-700',
      warning: 'bg-amber-100 text-amber-700',
      success: 'bg-green-100 text-green-700',
      brand: 'bg-brand-50 text-brand',
      danger: 'bg-red-100 text-red-700',
    },
  },
  defaultVariants: { tone: 'neutral' },
});

export type BadgeTone = NonNullable<VariantProps<typeof badge>['tone']>;

export function Badge({ tone, className, children }: VariantProps<typeof badge> & { className?: string; children: React.ReactNode }) {
  return <span className={cn(badge({ tone }), className)}>{children}</span>;
}
