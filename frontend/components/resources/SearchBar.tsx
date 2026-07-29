interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <label className="flex items-center gap-3 rounded-full border border-[var(--color-glass-border)] bg-[var(--color-surface)]/80 px-5 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="11" cy="11" r="6" />
        <path d="m20 20-4.2-4.2" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search resources"
        aria-label="Search resources"
        className="w-full border-none bg-transparent text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)]"
      />
    </label>
  );
}
