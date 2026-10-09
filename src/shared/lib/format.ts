const CURRENCY = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const DATE = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const DATE_TIME = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

export function formatDateTime(value: string | Date | undefined | null): string {
  if (!value) return '-';
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? '-' : DATE_TIME.format(date);
}

export function formatCurrency(value: number | undefined | null): string {
  return CURRENCY.format(value ?? 0);
}

export function formatDate(value: string | Date | undefined | null): string {
  if (!value) return '-';
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? '-' : DATE.format(date);
}

/** True when both moments fall on the same calendar day. */
export function isSameDay(a: string | Date | undefined | null, b: string): boolean {
  if (!a || !b) return false;
  const left = a instanceof Date ? a : new Date(a);
  const right = new Date(b);
  if (Number.isNaN(left.getTime()) || Number.isNaN(right.getTime())) return false;
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

/** Today as YYYY-MM-DD in the local timezone, for date input minimums. */
export function todayInputValue(): string {
  return toDateInputValue(new Date());
}

/** Normalise a date to the YYYY-MM-DD a native date input expects. */
export function toDateInputValue(value: string | Date | undefined): string {
  if (!value) return '';
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}
