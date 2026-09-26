import { Check } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

interface Step {
  name: string;
  hint: string;
}

interface ProposalStepperProps {
  steps: [Step, Step];
  currentStep: 1 | 2;
  onStepClick?: (step: 1) => void;
}

export function ProposalStepper({ steps, currentStep, onStepClick }: ProposalStepperProps) {
  return (
    <ol className="flex items-center gap-3 rounded-2xl bg-surface-muted p-3">
      {steps.map((step, index) => {
        const number = index + 1;
        const isDone = currentStep > number;
        const isActive = currentStep === number;
        const canGoBack = number === 1 && currentStep === 2 && onStepClick;

        return (
          <li key={step.name} className="flex flex-1 items-center gap-3">
            <button
              type="button"
              disabled={!canGoBack}
              onClick={canGoBack ? () => onStepClick(1) : undefined}
              className={cn('flex min-w-0 items-center gap-2.5 text-left', canGoBack && 'cursor-pointer')}
            >
              <span
                className={cn(
                  'grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold transition-all',
                  isDone && 'bg-brand text-white',
                  isActive && 'border-2 border-brand bg-surface text-brand',
                  !isDone && !isActive && 'bg-field text-ink-muted',
                )}
              >
                {isDone ? <Check size={13} /> : number}
              </span>
              <span className="min-w-0">
                <span className={cn('block truncate text-label font-bold', isActive || isDone ? 'text-ink' : 'text-ink-muted')}>
                  {step.name}
                </span>
                <span className="block truncate text-2xs text-ink-muted">{step.hint}</span>
              </span>
            </button>

            {index === 0 && (
              <span aria-hidden className="h-1 flex-1 overflow-hidden rounded-sm bg-field">
                <span className={cn('block h-full rounded-sm bg-brand transition-[width] duration-500', isDone ? 'w-full' : 'w-0')} />
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
