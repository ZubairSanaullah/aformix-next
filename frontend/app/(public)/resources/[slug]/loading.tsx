export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-36">
      <div className="animate-pulse space-y-8">
        <div className="aspect-[16/9] rounded-[2rem] bg-[var(--color-surface-elevated)]" />

        <div className="h-10 w-2/3 rounded bg-[var(--color-surface-elevated)]" />

        <div className="space-y-3">
          <div className="h-4 rounded bg-[var(--color-surface-elevated)]" />
          <div className="h-4 w-5/6 rounded bg-[var(--color-surface-elevated)]" />
          <div className="h-4 w-3/4 rounded bg-[var(--color-surface-elevated)]" />
        </div>
      </div>
    </div>
  );
}