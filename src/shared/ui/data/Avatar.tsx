import { cn } from '@/shared/lib/cn';

/** First letters of the first and last word, e.g. "Ada Lovelace" -> "AL". */
export function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : '';
  return (first + last).toUpperCase();
}

export function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'grid size-8 shrink-0 place-items-center rounded-full border-2 border-white bg-field text-xs font-bold text-slate-600 shadow-[0_2px_4px_rgb(0_0_0_/_0.05)]',
        className,
      )}
    >
      {initialsOf(name)}
    </span>
  );
}
