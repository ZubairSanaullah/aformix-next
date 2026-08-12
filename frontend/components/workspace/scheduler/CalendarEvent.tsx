"use client";

import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/scheduler/date-utils";
import type { CalendarEvent as CalendarEventType } from "@/lib/types/scheduler";

const TYPE_DOT: Record<CalendarEventType["type"], string> = {
    MEETING: "bg-[var(--workspace-primary)]",
    APPOINTMENT: "bg-sky-500",
    CALL: "bg-amber-500",
    REMINDER: "bg-slate-400",
    OTHER: "bg-slate-300",
};

interface CalendarEventProps {
    event: CalendarEventType;
    onClick?: () => void;
    className?: string;
    /** Compact = dot + title only, for tight month cells. */
    compact?: boolean;
}

export default function CalendarEvent({
    event,
    onClick,
    className,
    compact = false,
}: CalendarEventProps) {
    const cancelled = event.status === "CANCELLED";

    return (
        <button
            type="button"
            onClick={onClick}
            title={event.title}
            className={cn(
                "flex w-full items-center gap-1.5 rounded-md px-1.5 py-1 text-left text-[10px] font-medium transition-colors",
                "hover:bg-[var(--workspace-primary-soft)]",
                cancelled && "opacity-50 line-through",
                className
            )}
        >
            <span
                className={cn(
                    "h-1.5 w-1.5 shrink-0 rounded-full",
                    TYPE_DOT[event.type]
                )}
            />

            {!compact && !event.allDay && (
                <span className="shrink-0 text-[var(--workspace-text-subtle)]">
                    {formatTime(new Date(event.startAt))}
                </span>
            )}

            <span className="truncate text-[var(--workspace-text)]">
                {event.title}
            </span>
        </button>
    );
}
