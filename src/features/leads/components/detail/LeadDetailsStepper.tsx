import { Fragment } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

const QUALIFIED_STATUSES = ['Qualified', 'Converted'];

function stepsFor(status: string): string[] {
  const head = ['New', 'Contacted', 'Proposed'];
  if (status === 'Disqualified') return [...head, 'Disqualified'];
  return [...head, QUALIFIED_STATUSES.includes(status) ? status : 'Qualified', 'Create Quote'];
}

function stepperProgress(status: string): { activeIndex: number; completedCount: number } {
  if (status === 'Disqualified') return { activeIndex: 3, completedCount: 4 };
  if (QUALIFIED_STATUSES.includes(status)) return { activeIndex: 4, completedCount: 4 };
  if (status === 'Proposed') return { activeIndex: 3, completedCount: 3 };
  if (status === 'Contacted') return { activeIndex: 2, completedCount: 2 };
  return { activeIndex: 0, completedCount: 0 };
}

interface LeadDetailsStepperProps {
  currentStatus?: string;
}

export function LeadDetailsStepper({ currentStatus = 'New' }: LeadDetailsStepperProps) {
  const stages = stepsFor(currentStatus);
  const { activeIndex, completedCount } = stepperProgress(currentStatus);

  return (
    <ol className="mb-4 flex items-center justify-between rounded-2xl border border-field bg-surface px-4 py-3 shadow-[0_4px_20px_rgb(0_0_0_/_0.03)]">
      {stages.map((stage, index) => {
        const isCompleted = index < completedCount;
        const isActive = index === activeIndex && !isCompleted;

        return (
          <Fragment key={stage}>
            <li className={cn('z-2 flex items-center gap-3', isCompleted || isActive ? 'text-ink' : 'text-ink-subtle')}>
              <span
                className={cn(
                  'grid size-7 place-items-center rounded-full border-2 border-transparent text-sm font-semibold transition-all duration-400 ease-control',
                  isCompleted && 'bg-linear-135 from-violet-500 to-indigo-500 text-white shadow-[0_4px_12px_rgb(139_92_246_/_0.25)]',
                  isActive && 'border-violet-500 bg-surface text-violet-500 shadow-[0_0_0_6px_rgb(139_92_246_/_0.1)]',
                  !isCompleted && !isActive && 'bg-field text-ink-muted',
                )}
              >
                {isCompleted ? <Check size={18} strokeWidth={3} /> : index + 1}
              </span>
              <span className="text-sm font-semibold max-sm:hidden">{stage}</span>
            </li>

            {index < stages.length - 1 && (
              <li aria-hidden className="mx-5 h-1 flex-1 overflow-hidden rounded-sm bg-field">
                <span
                  className={cn(
                    'block h-full rounded-sm bg-linear-to-r from-violet-500 to-indigo-500 transition-[width] duration-600 ease-control',
                    isCompleted ? 'w-full' : 'w-0',
                  )}
                />
              </li>
            )}
          </Fragment>
        );
      })}
    </ol>
  );
}
