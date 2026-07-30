export default function ResourceCardSkeleton() {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-[var(--color-glass-border)] bg-[var(--color-surface)]/70 animate-pulse">
      <div className="aspect-[4/3] bg-[var(--color-surface-elevated)]" />

      <div className="space-y-4 p-6">
        <div className="h-4 w-28 rounded-full bg-[var(--color-surface-elevated)]" />

        <div className="h-7 w-3/4 rounded bg-[var(--color-surface-elevated)]" />

        <div className="space-y-2">
          <div className="h-4 rounded bg-[var(--color-surface-elevated)]" />
          <div className="h-4 w-5/6 rounded bg-[var(--color-surface-elevated)]" />
          <div className="h-4 w-2/3 rounded bg-[var(--color-surface-elevated)]" />
        </div>

        <div className="flex items-center justify-between pt-4">
          <div className="h-4 w-24 rounded bg-[var(--color-surface-elevated)]" />
          <div className="h-10 w-36 rounded-full bg-[var(--color-surface-elevated)]" />
        </div>
      </div>
    </article>
  );
}