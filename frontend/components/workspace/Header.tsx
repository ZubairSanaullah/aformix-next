"use client";

import {
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

interface HeaderProps {
  onMenuClick?: () => void;
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

export default function Header({
  onMenuClick,
  onToggleSidebar,
  isSidebarCollapsed,
}: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-[var(--color-glass-border)] bg-[var(--color-card)] px-8">
      <div className="flex items-center gap-3">
        {/* Mobile Menu */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="rounded-md p-2 transition hover:bg-[var(--color-surface)] lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Desktop Collapse */}
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={
            isSidebarCollapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
          className="hidden items-center justify-center rounded-md p-2 transition-all duration-200 hover:bg-[var(--color-surface)] hover:scale-105 active:scale-95 lg:flex"
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </button>

        <div>
          <h1 className="text-xl font-semibold">
            Dashboard
          </h1>

          <p className="text-sm text-[var(--color-text-muted)]">
            Welcome back 👋
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)] font-semibold text-white transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          Z
        </button>
      </div>
    </header>
  );
}