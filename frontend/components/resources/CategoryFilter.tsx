interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onChange: (category: string) => void;
}

export default function CategoryFilter({ categories, activeCategory, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5" aria-label="Resource categories">
      {categories.map((category) => {
        const isActive = category === activeCategory;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-300 active:scale-95 sm:px-4 sm:py-2 sm:text-sm cursor-pointer ${
              isActive
                ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-[0_4px_16px_rgba(39,185,144,0.3)]"
                : "border-[var(--color-glass-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)]/50 hover:text-[var(--color-text)]"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
