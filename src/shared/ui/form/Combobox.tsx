import { useMemo, useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { CONTROL_BASE, CONTROL_INVALID } from './Field';

export interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  clearable?: boolean;
  id?: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
}

/** Single-select dropdown with type-to-filter, replacing the hand-rolled SearchableSelect. */
export function Combobox({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No matches found.',
  disabled,
  clearable = false,
  ...a11y
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selected = options.find((option) => option.value === value);
  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return needle ? options.filter((option) => option.label.toLowerCase().includes(needle)) : options;
  }, [options, search]);

  const select = (next: string) => {
    onChange(next);
    setOpen(false);
    setSearch('');
  };

  return (
    <Popover.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setSearch('');
      }}
    >
      <Popover.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          role="combobox"
          aria-expanded={open}
          {...a11y}
          className={cn(
            CONTROL_BASE,
            'flex items-center justify-between gap-2 text-left',
            open && 'border-brand bg-surface',
            a11y['aria-invalid'] && CONTROL_INVALID,
            selected ? 'text-ink' : 'text-ink-subtle',
          )}
        >
          <span className="truncate">{selected?.label ?? placeholder}</span>
          <span className="flex shrink-0 items-center gap-1">
            {clearable && selected && (
              <span
                role="button"
                tabIndex={-1}
                aria-label="Clear selection"
                onClick={(event) => {
                  event.stopPropagation();
                  onChange('');
                }}
                className="text-ink-subtle hover:text-ink"
              >
                <X size={15} />
              </span>
            )}
            <ChevronDown size={16} className={cn('text-ink-muted transition-transform', open && 'rotate-180')} />
          </span>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          className="z-2100 w-(--radix-popover-trigger-width) overflow-hidden rounded-2xl border border-line bg-surface shadow-panel"
        >
          <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
            <Search size={15} className="shrink-0 text-ink-subtle" />
            <input
              autoFocus
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-sm outline-none placeholder:text-ink-subtle"
            />
          </div>

          <ul className="scrollbar-thin max-h-60 overflow-y-auto p-1.5" role="listbox">
            {filtered.length === 0 ? (
              <li className="px-3 py-6 text-center text-sm text-ink-subtle">{emptyMessage}</li>
            ) : (
              filtered.map((option) => (
                <li key={option.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={option.value === value}
                    onClick={() => select(option.value)}
                    className={cn(
                      'flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-brand-50',
                      option.value === value ? 'font-semibold text-brand' : 'text-ink',
                    )}
                  >
                    <span className="truncate">{option.label}</span>
                    {option.value === value && <Check size={15} className="shrink-0" />}
                  </button>
                </li>
              ))
            )}
          </ul>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
