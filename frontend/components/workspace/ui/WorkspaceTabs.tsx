"use client";

import { cn } from "@/lib/utils";

interface WorkspaceTab {
    id: string;
    label: string;
    count?: number;
}

interface WorkspaceTabsProps {
    tabs: WorkspaceTab[];
    activeTab: string;
    onChange: (id: string) => void;
    className?: string;
}

export default function WorkspaceTabs({
    tabs,
    activeTab,
    onChange,
    className,
}: WorkspaceTabsProps) {
    return (
        <div
            className={cn(
                "flex items-center gap-1 border-b border-[var(--workspace-border)]",
                className
            )}
        >
            {tabs.map((tab) => {
                const active = tab.id === activeTab;

                return (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => onChange(tab.id)}
                        className={cn(
                            "relative flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors",
                            "after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:transition-opacity",
                            active
                                ? "text-[var(--workspace-primary)] after:bg-[var(--workspace-primary)] after:opacity-100"
                                : "text-[var(--workspace-text-muted)] hover:text-[var(--workspace-text)] after:opacity-0"
                        )}
                    >
                        {tab.label}

                        {tab.count !== undefined && (
                            <span
                                className={cn(
                                    "rounded-full px-1.5 py-0.5 text-[9px] font-semibold",
                                    active
                                        ? "bg-[var(--workspace-primary-soft)] text-[var(--workspace-primary)]"
                                        : "bg-[var(--workspace-background)] text-[var(--workspace-text-muted)]"
                                )}
                            >
                                {tab.count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}