import { Calendar, X } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

interface DateFilterProps {
  value: string;
  onChange: (value: string) => void;
}

/** Compact calendar control that expands once a date is picked. */
export function DateFilter({ value, onChange }: DateFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          'relative flex h-10 shrink-0 items-center overflow-hidden rounded-field border-[1.5px] border-line bg-surface transition-all duration-250 ease-control',
          'focus-within:border-brand focus-within:shadow-[0_0_0_4px_rgb(112_48_159_/_0.06)]',
          value ? 'w-[8.4375rem] justify-start px-3' : 'w-10 justify-center',
        )}
      >
        <Calendar size={16} className="pointer-events-none z-1 shrink-0 text-brand" />
        <input
          type="date"
          value={value}
          aria-label="Filter by date"
          onChange={(event) => onChange(event.target.value)}
          className={cn(
            'absolute inset-0 size-full cursor-pointer border-none bg-transparent py-0 pl-9 pr-3 text-label font-medium outline-none',
            // This control is a compact pill, so the whole field acts as the picker
            // trigger. The input is positioned, which keeps the overlay scoped to it.
            '[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0',
            '[&::-webkit-calendar-picker-indicator]:size-full [&::-webkit-calendar-picker-indicator]:cursor-pointer',
            '[&::-webkit-calendar-picker-indicator]:opacity-0',
            value ? 'text-slate-600' : 'text-transparent',
          )}
        />
      </div>

      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          title="Clear filter"
          aria-label="Clear date filter"
          className="grid size-10 shrink-0 place-items-center rounded-field border-[1.5px] border-line bg-surface text-ink-muted transition-all hover:border-red-500 hover:bg-red-50 hover:text-red-500"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
