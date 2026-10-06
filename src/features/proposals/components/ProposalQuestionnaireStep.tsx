import { useCallback, useEffect, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button, Loader } from '@/shared/ui';
import { cn } from '@/shared/lib/cn';
import type { ProposalOptionItem, ProposalOptionsData } from '../types';

const OPTION =
  'flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm transition-all hover:border-brand';
const SELECTED = 'border-brand bg-brand-50 font-semibold text-brand';
const UNSELECTED = 'border-line bg-surface text-slate-700';

function QuestionColumn({ heading, hint, action, children }: {
  heading: string;
  hint?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const [hasMoreBelow, setHasMoreBelow] = useState(false);

  const syncOverflow = useCallback(() => {
    const node = listRef.current;
    if (!node) return;
    setHasMoreBelow(node.scrollHeight - node.scrollTop - node.clientHeight > 4);
  }, []);

  useEffect(() => {
    syncOverflow();
    const node = listRef.current;
    if (!node || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(syncOverflow);
    observer.observe(node);
    return () => observer.disconnect();
  }, [syncOverflow, children]);

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="flex min-h-[2.5rem] flex-col gap-0.5">
        <div className="flex items-center justify-between gap-2">
          <h4 className="min-w-0 text-sm font-bold text-ink">{heading}</h4>
          {action}
        </div>
        {hint && <p className="text-xs font-normal text-ink-muted">{hint}</p>}
      </div>
      <div className="relative min-h-0">
        <div
          ref={listRef}
          onScroll={syncOverflow}
          className="scrollbar-thin flex max-h-[20rem] flex-col gap-2 overflow-y-auto pr-1"
        >
          {children}
        </div>
        {hasMoreBelow && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-linear-to-t from-surface to-transparent"
          />
        )}
      </div>
    </div>
  );
}

export interface QuestionnaireValue {
  serviceIds: number[];
  mainPurposeId: number | null;
  commercialApproachId: number | null;
}

interface ProposalQuestionnaireStepProps {
  options: ProposalOptionsData | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  value: QuestionnaireValue;
  onChange: (next: QuestionnaireValue) => void;
}

export function ProposalQuestionnaireStep({
  options,
  isLoading,
  isError,
  onRetry,
  value,
  onChange,
}: ProposalQuestionnaireStepProps) {
  if (isLoading) return <Loader message="Loading proposal options..." />;

  if (isError || !options) {
    return (
      <div className="flex flex-col items-center gap-3 py-16">
        <p className="text-sm text-ink-muted">Unable to load options.</p>
        <Button variant="secondary" onClick={onRetry}>
          <RotateCcw size={14} /> Retry
        </Button>
      </div>
    );
  }

  const allSelected = value.serviceIds.length === options.services.length;

  const toggleService = (id: number) =>
    onChange({
      ...value,
      serviceIds: value.serviceIds.includes(id)
        ? value.serviceIds.filter((entry) => entry !== id)
        : [...value.serviceIds, id],
    });

  const radioColumn = (items: ProposalOptionItem[], name: keyof QuestionnaireValue, selected: number | null) =>
    items.map((item) => (
      <label key={item.id} className={cn(OPTION, selected === item.id ? SELECTED : UNSELECTED)}>
        <input
          type="radio"
          name={name}
          checked={selected === item.id}
          onChange={() => onChange({ ...value, [name]: item.id })}
          className="size-4 accent-brand"
        />
        {item.name}
      </label>
    ));

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <QuestionColumn
        heading="1. Which services?"
        hint={`Select all that apply · ${value.serviceIds.length} of ${options.services.length} selected`}
        action={
          <button
            type="button"
            onClick={() => onChange({ ...value, serviceIds: allSelected ? [] : options.services.map((s) => s.id) })}
            className="shrink-0 text-xs font-semibold text-brand hover:underline"
          >
            {allSelected ? 'Clear all' : 'Select all'}
          </button>
        }
      >
        {options.services.map((service) => (
          <label
            key={service.id}
            className={cn(OPTION, value.serviceIds.includes(service.id) ? SELECTED : UNSELECTED)}
          >
            <input
              type="checkbox"
              checked={value.serviceIds.includes(service.id)}
              onChange={() => toggleService(service.id)}
              className="size-4 accent-brand"
            />
            {service.name}
          </label>
        ))}
      </QuestionColumn>

      <QuestionColumn heading="2. What is the main purpose?" hint="Choose one">
        {radioColumn(options.main_purposes, 'mainPurposeId', value.mainPurposeId)}
      </QuestionColumn>

      <QuestionColumn heading="3. Which commercial approach?" hint="Choose one">
        {radioColumn(options.commercial_approaches, 'commercialApproachId', value.commercialApproachId)}
      </QuestionColumn>
    </div>
  );
}
