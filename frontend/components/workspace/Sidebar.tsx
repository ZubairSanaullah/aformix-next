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
  user?: {
    role?: string;
  };
}

export default function Sidebar({
  isOpen,
  isCollapsed,
  onClose,
  user,
}: SidebarProps) {
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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

  const isItemActive = (href: string) => {
    if (href === "/workspace") {
      return pathname === href;
    }

    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`
                    fixed
                    inset-0
                    z-40
                    bg-slate-950/40
                    backdrop-blur-[2px]
                    transition-opacity
                    duration-200
                    lg:hidden
                    ${isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
          }
                `}
      />

      <aside
        id="workspace-sidebar"
        className={`
                    fixed
                    inset-y-0
                    left-0
                    z-50
                    flex
                    flex-col
                    border-r
                    border-[var(--workspace-border)]
                    bg-[var(--workspace-surface)]
                    transition-[width,transform]
                    duration-200
                    ease-out

                    ${isOpen
            ? "translate-x-0"
            : "-translate-x-full"
          }

                    lg:static
                    lg:translate-x-0

                    ${isCollapsed
            ? "lg:w-[72px]"
            : "lg:w-[248px]"
          }

                    w-[248px]
                `}
      >
        {/* Brand */}
        <div
          className={`
                        flex
                        h-[68px]
                        shrink-0
                        items-center
                        border-b
                        border-[var(--workspace-border)]
                        ${isCollapsed
              ? "justify-center px-3"
              : "justify-between px-4"
            }
                    `}
        >
          {isCollapsed ? (
            <div
              className="
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-lg
                                bg-[var(--workspace-primary)]
                                text-sm
                                font-bold
                                text-white
                                shadow-sm
                            "
            >
              A
            </div>
          ) : (
            <div className="min-w-0">
              <p className="truncate text-sm font-bold tracking-[-0.02em] text-[var(--workspace-text)]">
                Aformix
              </p>

              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--workspace-text-subtle)]">
                Workspace
              </p>
            </div>
          )}

          {/* Mobile close */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="
                            rounded-md
                            p-1.5
                            text-[var(--workspace-text-muted)]
                            transition-colors
                            hover:bg-[var(--workspace-background)]
                            hover:text-[var(--workspace-text)]
                            lg:hidden
                        "
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="workspace-scrollbar flex-1 overflow-y-auto px-2.5 py-4">
            {workspaceNavigation.map((group) => {
              const visibleItems = group.items.filter(
                (item) => !("adminOnly" in item && item.adminOnly) || user?.role === "ADMIN"
              );

              if (visibleItems.length === 0) return null;

              return (
                <div key={group.title}>
                  {!isCollapsed && (
                    <p className="mb-2 px-2.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--workspace-text-subtle)]">
                      {group.title}
                    </p>
                  )}

                  <ul className="space-y-0.5">
                    {visibleItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = isItemActive(
                      item.href
                    );

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          title={
                            isCollapsed
                              ? item.title
                              : undefined
                          }
                          onClick={onClose}
                          className={`
                                                        group
                                                        relative
                                                        flex
                                                        h-9
                                                        items-center
                                                        rounded-lg
                                                        text-xs
                                                        font-medium
                                                        transition-all
                                                        duration-150

                                                        ${isCollapsed
                              ? "justify-center"
                              : "gap-2.5 px-2.5"
                            }

                                                        ${isActive
                              ? "bg-[var(--workspace-primary-soft)] text-[var(--workspace-primary)]"
                              : "text-[var(--workspace-text-muted)] hover:bg-[var(--workspace-background)] hover:text-[var(--workspace-text)]"
                            }
                                                    `}
                        >
                          {/* Active indicator */}
                          {isActive && (
                            <span
                              className="
                                                                absolute
                                                                left-0
                                                                h-4
                                                                w-0.5
                                                                rounded-r-full
                                                                bg-[var(--workspace-primary)]
                                                            "
                            />
                          )}

                          <Icon
                            className={`
                                                            h-[16px]
                                                            w-[16px]
                                                            shrink-0
                                                            transition-transform
                                                            duration-150
                                                            ${!isActive
                                ? "group-hover:scale-105"
                                : ""
                              }
                                                        `}
                            strokeWidth={
                              isActive
                                ? 2
                                : 1.8
                            }
                          />

                          {!isCollapsed && (
                            <span className="truncate">
                              {item.title}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          className={`
                        shrink-0
                        border-t
                        border-[var(--workspace-border)]
                        p-2.5
                        ${isCollapsed
              ? "flex justify-center"
              : ""
            }
                    `}
        >
          <div
            className={`
                            flex
                            items-center
                            rounded-lg
                            bg-[var(--workspace-background)]
                            ${isCollapsed
                ? "h-9 w-9 justify-center"
                : "gap-2.5 px-2.5 py-2"
              }
                        `}
          >
            <div
              className="
                                flex
                                h-6
                                w-6
                                shrink-0
                                items-center
                                justify-center
                                rounded-md
                                bg-[var(--workspace-primary)]
                                text-[9px]
                                font-bold
                                text-white
                            "
            >
              A
            </div>

            {!isCollapsed && (
              <div className="min-w-0">
                <p className="truncate text-[10px] font-semibold text-[var(--workspace-text)]">
                  Aformix Workspace
                </p>

                <p className="truncate text-[9px] text-[var(--workspace-text-subtle)]">
                  Business OS
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}