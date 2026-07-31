"use client";

import { Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-[var(--color-glass-border)] bg-[var(--color-card)] px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-md p-2 transition hover:bg-[var(--color-surface)] lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>

          <p className="text-sm text-[var(--color-text-muted)]">
            Welcome back 👋
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)] font-semibold text-white">
          Z
        </div>
      </div>
    </header>
  );
}