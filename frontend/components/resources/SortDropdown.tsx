interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
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
}: SortDropdownProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-2xl border border-[var(--color-glass-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] outline-none transition-all focus:border-[var(--color-primary)] sm:w-56"
    >
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
        >
          Sort by {option.label}
        </option>
      ))}
    </select>
  );
}