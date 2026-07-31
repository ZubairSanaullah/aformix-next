"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

import { workspaceNavigation } from "@/constants/workspace-navigation";

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
}

export default function Sidebar({
  isOpen,
  isCollapsed,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  /**
   * Lock body scroll while mobile drawer is open.
   */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  /**
   * Close drawer with Escape key.
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  /**
   * Reset mobile drawer when resizing to desktop.
   */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        onClose();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [onClose]);

  /**
   * Determine active navigation item.
   */
  const isItemActive = (href: string) => {
    if (href === "/workspace") {
      return pathname === href;
    }

    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden ${isOpen
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
          }`}
      />

      {/* Sidebar */}
      <aside
        id="workspace-sidebar"
        className={`
          fixed
          left-0
          top-0
          z-50
          flex
          h-screen
          flex-col
          border-r
          border-[var(--color-glass-border)]
          bg-[var(--color-card)]
          transition-all
          duration-300
          ease-in-out

          ${isOpen ? "translate-x-0" : "-translate-x-full"}

          lg:static
          lg:translate-x-0

          ${isCollapsed ? "lg:w-28" : "lg:w-72"}

          w-72
        `}
      >
        {/* Header */}
        <div
          className={`border-b border-[var(--color-glass-border)] transition-all duration-300 ${isCollapsed ? "flex justify-center items-center p-4" : "p-6"
            }`}
        >
          <div className="overflow-hidden">
            {isCollapsed ? (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)] font-bold text-white">
                A
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold">
                  Aformix
                </h2>

                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  Workspace
                </p>
              </>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-8">
            {workspaceNavigation.map((group) => (
              <div key={group.title}>
                {!isCollapsed && (
                  <h3 className="mb-3 px-4 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    {group.title}
                  </h3>
                )}

                <ul className="space-y-2">
                  {group.items.map((item) => {
                    const Icon = item.icon;

                    const isActive = isItemActive(item.href);

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          title={isCollapsed ? item.title : undefined}
                          onClick={onClose}
                          className={`
                            flex
                            items-center
                            rounded-xl
                            py-2.5
                            transition-all
                            duration-200

                            ${isCollapsed
                              ? "justify-center px-3"
                              : "gap-3 px-4"
                            }

                            ${isActive
                              ? "bg-[var(--color-primary)] text-white"
                              : "hover:bg-[var(--color-primary)]/10"
                            }
                          `}
                        >
                          <Icon
                            size={20}
                            className="shrink-0"
                          />

                          <span
                            className={`
                              overflow-hidden
                              whitespace-nowrap
                              transition-all
                              duration-200

                              ${isCollapsed
                                ? "w-0 opacity-0"
                                : "translate-x-0 opacity-100"
                              }
                            `}
                          >
                            {item.title}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </nav>
      </aside>
    </>
  );
}