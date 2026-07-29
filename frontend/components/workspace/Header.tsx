export default function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-[var(--color-glass-border)] bg-[var(--color-card)] px-8">
      <div>
        <h1 className="text-xl font-semibold">
          Dashboard
        </h1>

        <p className="text-sm text-[var(--color-text-muted)]">
          Welcome back 👋
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)] text-white font-semibold">
          Z
        </div>
      </div>
    </header>
  );
}