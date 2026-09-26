import { cn } from '@/shared/lib/cn';

const DELAYS = ['[animation-delay:0ms]', '[animation-delay:160ms]', '[animation-delay:320ms]'];

interface LoaderProps {
  message?: string;
  showLogo?: boolean;
  className?: string;
}

/** Three bouncing dots, used wherever a section is waiting on data. */
export function Loader({ message, showLogo = false, className }: LoaderProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-5', className ?? 'h-[18.75rem]')}>
      {showLogo && <img src="/nobg-logo.png" alt="" className="mb-2 h-10 w-auto" />}
      <div className="flex h-6 items-center gap-2" role="status" aria-label="Loading">
        {DELAYS.map((delay) => (
          <span key={delay} className={cn('size-2.5 animate-dot-bounce rounded-full bg-brand', delay)} />
        ))}
      </div>
      {message && <p className="text-sm font-semibold text-ink-muted">{message}</p>}
    </div>
  );
}

/** Full-screen variant shown while the workspace boots. */
export function FullScreenLoader({ message }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-surface-muted">
      <Loader message={message} showLogo className="h-auto" />
    </div>
  );
}
