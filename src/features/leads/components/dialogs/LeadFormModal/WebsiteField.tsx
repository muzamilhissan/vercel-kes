import { cn } from '@/shared/lib/cn';
import { WEBSITE_PREFIX, stripScheme } from './schema';

interface WebsiteFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  id?: string;
  invalid?: boolean;
  'aria-describedby'?: string;
}

export function WebsiteField({
  value,
  onChange,
  onBlur,
  disabled,
  id,
  invalid,
  'aria-describedby': describedBy,
}: WebsiteFieldProps) {
  return (
    <div
      className={cn(
        'flex w-full items-center overflow-hidden rounded-xl border border-line bg-surface-muted text-sm font-medium text-ink transition-all',
        'focus-within:border-brand focus-within:bg-surface focus-within:shadow-[0_0_0_3px_rgb(112_48_159_/_0.1)]',
        invalid && 'border-red-300 focus-within:border-red-500 focus-within:shadow-[0_0_0_3px_rgb(239_68_68_/_0.1)]',
        disabled && 'cursor-not-allowed opacity-60',
      )}
    >
      <span
        aria-hidden
        className="shrink-0 select-none border-r border-line px-3 py-2.5 text-ink-subtle"
      >
        {WEBSITE_PREFIX}
      </span>
      <input
        id={id}
        type="text"
        inputMode="url"
        autoComplete="url"
        value={value}
        onChange={(event) => onChange(stripScheme(event.target.value))}
        onBlur={onBlur}
        disabled={disabled}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        placeholder="example.com"
        className="min-w-0 flex-1 bg-transparent px-3 py-2.5 placeholder:text-ink-subtle focus:outline-none disabled:cursor-not-allowed"
      />
    </div>
  );
}
