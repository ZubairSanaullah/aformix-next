"use client";

import {
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import LogoutButton from "@/components/auth/LogoutButton";

interface HeaderProps {
  onMenuClick?: () => void;
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function Header({
  onMenuClick,
  onToggleSidebar,
  isSidebarCollapsed,
  user,
}: HeaderProps) {
  return (<header className="flex h-16 items-center justify-between border-b border-[var(--color-glass-border)] bg-[var(--color-card)] px-8"> <div className="flex items-center gap-3">
    {/* Mobile Menu */} <button
      type="button"
      onClick={onMenuClick}
      aria-label="Open navigation menu"
      className="rounded-md p-2 transition hover:bg-[var(--color-surface)] lg:hidden"
    > <Menu className="h-5 w-5" /> </button>

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

    <div className="flex items-center gap-3">
      <div className="hidden text-right sm:block">
        <p className="text-sm font-medium">
          {user?.name || "User"}
        </p>

        <p className="text-xs text-[var(--color-text-muted)]">
          {user?.email}
        </p>
      </div>

      <button
        type="button"
        aria-label="User profile"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)] font-semibold text-white transition-transform duration-200 hover:scale-105 active:scale-95"
      >
        {user?.name?.charAt(0).toUpperCase() || "U"}
      </button>

      <LogoutButton />
    </div>
  </header>
  );
}