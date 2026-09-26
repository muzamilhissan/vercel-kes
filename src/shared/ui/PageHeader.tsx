export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <header className="mb-6 flex flex-col items-start justify-between gap-4 sm:mb-8 sm:flex-row sm:items-center sm:gap-5">
      <div>
        <h2 className="text-[1.625rem] font-bold text-ink">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex w-full items-center gap-3 max-sm:flex-wrap sm:w-auto">{actions}</div>}
    </header>
  );
}
