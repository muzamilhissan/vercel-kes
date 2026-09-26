import { Sparkles } from 'lucide-react';

interface GeneratingStateProps {
  title: string;
  /** The lead's company or name, shown so the user sees what is being drafted. */
  target: string;
  documentNoun: string;
}

export function GeneratingState({ title, target, documentNoun }: GeneratingStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-14 text-center">
      <span className="grid size-20 animate-pulse place-items-center rounded-full bg-brand-50 text-brand">
        <Sparkles size={38} />
      </span>
      <h3 className="text-lg font-bold text-ink">{title}</h3>
      <p className="max-w-md text-sm text-ink-muted">
        Analyzing your requirements for <strong className="text-ink">{target}</strong> and synthesizing a customized{' '}
        {documentNoun} letter and documentation.
      </p>
      <div className="h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-field">
        <span className="block h-full w-1/3 animate-[progress-slide_1.6s_ease-in-out_infinite] rounded-full bg-brand" />
      </div>
      <span className="text-xs text-ink-subtle">This usually takes about 10–15 seconds...</span>
    </div>
  );
}
