import { Button } from '../Button';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="my-6 flex h-[18.75rem] flex-col items-center justify-center gap-4 rounded-2xl border border-red-200 bg-red-50/60 p-6">
      <p role="alert" className="text-center font-semibold text-red-600">
        {message}
      </p>
      {onRetry && <Button onClick={onRetry}>Try Again</Button>}
    </div>
  );
}
