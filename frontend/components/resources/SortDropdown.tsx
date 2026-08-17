interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const options = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "title", label: "A–Z" },
  { value: "readingTime", label: "Reading Time" },
  { value: "pages", label: "Pages" },
];

export default function SortDropdown({
  value,
  onChange,
  className = "",
}: SortDropdownProps) {
  return (
    <div className={`relative w-full sm:w-56 ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-full border border-[var(--color-glass-border)] bg-[var(--color-surface)] px-4 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm text-[var(--color-text)] outline-none transition-all focus:border-[var(--color-primary)] pr-10 cursor-pointer shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-[var(--color-surface)] text-[var(--color-text)]"
          >
            Sort by {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}