import { X } from "lucide-react";

interface ActiveFiltersProps {
  query: string;
  category: string;
  sort: string;
  onClearQuery: () => void;
  onClearCategory: () => void;
  onReset: () => void;
}

export default function ActiveFilters({
  query,
  category,
  sort,
  onClearQuery,
  onClearCategory,
  onReset,
}: ActiveFiltersProps) {
  const hasFilters =
    query || category !== "All" || sort !== "newest";

  if (!hasFilters) return null;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-6 sm:gap-3">
      {query && (
        <button
          onClick={onClearQuery}
          className="inline-flex max-w-[200px] items-center gap-1.5 rounded-full border border-[var(--color-glass-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs transition hover:border-[var(--color-primary)] sm:max-w-xs sm:px-4 sm:py-2 sm:text-sm cursor-pointer"
        >
          <span className="truncate">"{query}"</span>
          <X size={13} className="shrink-0 text-[var(--color-text-muted)]" />
        </button>
      )}

      {category !== "All" && (
        <button
          onClick={onClearCategory}
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-glass-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs transition hover:border-[var(--color-primary)] sm:px-4 sm:py-2 sm:text-sm cursor-pointer"
        >
          <span>{category}</span>
          <X size={13} className="shrink-0 text-[var(--color-text-muted)]" />
        </button>
      )}

      {sort !== "newest" && (
        <span className="rounded-full border border-[var(--color-glass-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm">
          Sort: {sort}
        </span>
      )}

      <button
        onClick={onReset}
        className="text-xs font-semibold text-[var(--color-primary)] transition hover:underline sm:text-sm cursor-pointer ml-1"
      >
        Clear All
      </button>
    </div>
  );
}