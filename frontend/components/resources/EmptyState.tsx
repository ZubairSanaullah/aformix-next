interface EmptyStateProps {
  title: string;
  description: string;
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-[2rem] border border-dashed border-[var(--color-glass-border)] bg-[var(--color-surface)]/60 p-12 text-center">
      <h2 className="text-2xl font-semibold text-[var(--color-text)]">{title}</h2>
      <p className="mt-3 text-[var(--color-text-muted)]">{description}</p>
    </div>
  );
}
