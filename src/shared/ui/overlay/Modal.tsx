import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

const WIDTHS = {
  sm: 'max-w-[28.75rem]',
  md: 'max-w-[36.25rem]',
  lg: 'max-w-[47.5rem]',
  xl: 'max-w-[60rem]',
} as const;

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  size?: keyof typeof WIDTHS;
  /** Hide the header close button while a submit is in flight. */
  dismissible?: boolean;
  /**
   * Drops the brand header band for a plain white card, used by the short
   * confirm dialogs where a full title bar overwhelms one line of text.
   */
  plain?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  size = 'md',
  dismissible = true,
  plain = false,
  children,
  footer,
  className,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(next) => (dismissible || next) && onOpenChange(next)}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-2000 bg-slate-900/50 backdrop-blur-md data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content
          onInteractOutside={(e) => !dismissible && e.preventDefault()}
          onEscapeKeyDown={(e) => !dismissible && e.preventDefault()}
          className={cn(
            'fixed left-1/2 top-1/2 z-2000 flex max-h-[calc(100vh-40px)] w-[calc(100%-40px)] -translate-x-1/2 -translate-y-1/2 flex-col',
            'overflow-hidden rounded-3xl border border-black/5 bg-surface shadow-[0_40px_120px_-20px_rgb(112_48_159_/_0.2)]',
            WIDTHS[size],
            className,
          )}
        >
          {plain ? (
            <>
              <Dialog.Title className="sr-only">{title}</Dialog.Title>
              <Dialog.Description className="sr-only">{description ?? title}</Dialog.Description>
              {dismissible && (
                <Dialog.Close
                  aria-label="Close dialog"
                  className="absolute right-4 top-4 grid size-9 place-items-center rounded-xl border border-line bg-surface text-ink-muted transition-colors hover:bg-field hover:text-ink"
                >
                  <X size={17} />
                </Dialog.Close>
              )}
            </>
          ) : (
          <header className="relative flex shrink-0 items-center justify-between gap-4 bg-linear-135 from-brand to-brand-600 px-6 py-4 text-white sm:px-7">
            <div className="min-w-0">
              <Dialog.Title className="truncate font-serif text-lg font-extrabold tracking-tight sm:text-xl">
                {title}
              </Dialog.Title>
              {description ? (
                <Dialog.Description className="mt-0.5 truncate text-label text-white/70">{description}</Dialog.Description>
              ) : (
                <Dialog.Description className="sr-only">{title}</Dialog.Description>
              )}
            </div>
            {dismissible && (
              <Dialog.Close
                aria-label="Close dialog"
                className="grid size-9 shrink-0 place-items-center rounded-xl border border-white/20 bg-white/15 text-white transition-all duration-300 ease-control hover:rotate-90 hover:scale-110 hover:bg-white/25"
              >
                <X size={17} />
              </Dialog.Close>
            )}
            <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
          </header>
          )}

          <div
            className={cn(
              'scrollbar-thin flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-5 sm:px-7',
              plain && 'pt-8',
            )}
          >
            {children}
          </div>

          {footer && (
            <footer
              className={cn(
                'flex shrink-0 flex-wrap justify-end gap-3 bg-surface px-6 py-3.5 sm:px-7',
                plain ? 'pb-6 pt-1' : 'border-t border-line',
              )}
            >
              {footer}
            </footer>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/** Two-column form grid that stacks on small screens. */
export function ModalGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('grid gap-4 sm:grid-cols-2 sm:gap-5', className)}>{children}</div>;
}
