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
    <div className="mt-6 flex flex-wrap items-center gap-3">
      {query && (
        <button
          onClick={onClearQuery}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-glass-border)] bg-[var(--color-surface)] px-4 py-2 text-sm transition hover:border-[var(--color-primary)]"
        >
          "{query}"
          <X size={14} />
        </button>
      )}

      {category !== "All" && (
        <button
          onClick={onClearCategory}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-glass-border)] bg-[var(--color-surface)] px-4 py-2 text-sm transition hover:border-[var(--color-primary)]"
        >
          {category}
          <X size={14} />
        </button>
      )}

      {sort !== "newest" && (
        <span className="rounded-full border border-[var(--color-glass-border)] bg-[var(--color-surface)] px-4 py-2 text-sm">
          Sort: {sort}
        </span>
      )}

      <button
        onClick={onReset}
        className="text-sm font-medium text-[var(--color-primary)] transition hover:underline"
      >
        Clear All
      </button>
    </div>
  );
}