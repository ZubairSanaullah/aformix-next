interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <label className="flex w-full items-center gap-3 rounded-full border border-[var(--color-glass-border)] bg-[var(--color-surface)]/80 px-4 py-2.5 sm:px-5 sm:py-3 shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all focus-within:border-[var(--color-primary)] lg:w-80">
      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-[var(--color-text-muted)] sm:h-5 sm:w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="11" cy="11" r="6" />
        <path d="m20 20-4.2-4.2" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search resources..."
        aria-label="Search resources"
        className="w-full min-w-0 border-none bg-transparent text-xs sm:text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)]"
      />
    </label>
  );
}
