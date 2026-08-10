"use client";

import {
  Bell,
  Menu,
  Moon,
  Monitor,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Sun,
} from "lucide-react";

import LogoutButton from "@/components/auth/LogoutButton";
import { useTheme } from "@/contexts/ThemeContext";

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
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("light");
    else {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(isDark ? "light" : "dark");
    }
  };

  const ThemeIcon =
    theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <header
      className="
                sticky
                top-0
                z-30
                flex
                h-[68px]
                shrink-0
                items-center
                justify-between
                border-b
                border-[var(--workspace-border)]
                bg-[var(--workspace-surface)]/95
                px-4
                backdrop-blur-xl
                sm:px-6
            "
    >
      {/* Left */}
      <div className="flex min-w-0 items-center gap-3">
        {/* Mobile menu */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="
                        rounded-lg
                        p-2
                        text-[var(--workspace-text-muted)]
                        transition-colors
                        hover:bg-[var(--workspace-background)]
                        hover:text-[var(--workspace-text)]
                        lg:hidden
                    "
        >
          <Menu className="h-[18px] w-[18px]" />
        </button>

        {/* Desktop sidebar toggle */}
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={
            isSidebarCollapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
          className="
                        hidden
                        rounded-lg
                        p-2
                        text-[var(--workspace-text-muted)]
                        transition-colors
                        hover:bg-[var(--workspace-background)]
                        hover:text-[var(--workspace-text)]
                        lg:flex
                    "
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen className="h-[17px] w-[17px]" />
          ) : (
            <PanelLeftClose className="h-[17px] w-[17px]" />
          )}
        </button>

        <div className="hidden h-5 w-px bg-[var(--workspace-border)] sm:block" />

        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-[var(--workspace-text)]">
            Workspace
          </p>

          <p className="hidden text-[10px] text-[var(--workspace-text-subtle)] sm:block">
            Aformix business workspace
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Search */}
        <button
          type="button"
          aria-label="Search workspace"
          className="
                        hidden
                        items-center
                        gap-2
                        rounded-lg
                        border
                        border-[var(--workspace-border)]
                        bg-[var(--workspace-background)]
                        px-3
                        py-1.5
                        text-[10px]
                        text-[var(--workspace-text-subtle)]
                        transition-colors
                        hover:border-[var(--workspace-primary)]/30
                        hover:text-[var(--workspace-text-muted)]
                        md:flex
                    "
        >
          <Search className="h-3.5 w-3.5" />

          <span>Search</span>

          <kbd className="ml-3 rounded border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-1.5 py-0.5 text-[9px]">
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="
                        relative
                        rounded-lg
                        p-2
                        text-[var(--workspace-text-muted)]
                        transition-colors
                        hover:bg-[var(--workspace-background)]
                        hover:text-[var(--workspace-text)]
                    "
        >
          <Bell className="h-[16px] w-[16px]" />

          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[var(--workspace-primary)] ring-2 ring-[var(--workspace-surface)]" />
        </button>

        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title={
            theme === "light"
              ? "Switch to dark mode"
              : theme === "dark"
                ? "Switch to light mode"
                : "Toggle theme"
          }
          className="
                        rounded-lg
                        p-2
                        text-[var(--workspace-text-muted)]
                        transition-colors
                        hover:bg-[var(--workspace-background)]
                        hover:text-[var(--workspace-text)]
                    "
        >
          <ThemeIcon className="h-[16px] w-[16px]" />
        </button>

        <div className="mx-1 hidden h-6 w-px bg-[var(--workspace-border)] sm:block" />

        {/* User */}
        <div className="flex items-center gap-2">
          <div className="hidden text-right sm:block">
            <p className="text-[11px] font-semibold text-[var(--workspace-text)]">
              {user?.name || "User"}
            </p>

            <p className="max-w-[160px] truncate text-[9px] text-[var(--workspace-text-subtle)]">
              {user?.email}
            </p>
          </div>

          <button
            type="button"
            aria-label="User profile"
            className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-lg
                            bg-[var(--workspace-primary)]
                            text-[10px]
                            font-bold
                            text-white
                            shadow-sm
                            transition-transform
                            duration-150
                            hover:scale-[1.03]
                            active:scale-95
                        "
          >
            {initials}
          </button>

          <LogoutButton />
        </div>
      </div>
    </header>
  );
}