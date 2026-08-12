"use client";

import { cn } from "@/lib/utils";
import {
    chunkIntoWeeks,
    eachDayOfRange,
    isSameMonth,
    isToday,
    monthGridRange,
} from "@/lib/scheduler/date-utils";
import type { CalendarEvent as CalendarEventType } from "@/lib/types/scheduler";
import DraggableEventChip from "./DraggableEventChip";
import DroppableCell from "./DroppableCell";

const WEEKDAY_LABELS = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
];

const MAX_VISIBLE_PER_CELL = 3;

interface MonthViewProps {
    currentDate: Date;
    events: CalendarEventType[];
    onSelectEvent: (event: CalendarEventType) => void;
    onSelectSlot: (date: Date) => void;
}

export default function MonthView({
    currentDate,
    events,
    onSelectEvent,
    onSelectSlot,
}: MonthViewProps) {
    const { start, end } = monthGridRange(currentDate);
    const weeks = chunkIntoWeeks(eachDayOfRange(start, end));

    function eventsForDay(day: Date) {
        return events.filter((event) => {
            const eventStart = new Date(event.startAt);
            const eventEnd = new Date(event.endAt);
            const dayStart = new Date(day);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(day);
            dayEnd.setHours(23, 59, 59, 999);

            return eventStart <= dayEnd && eventEnd >= dayStart;
        });
    }

    return (
        <div className="overflow-hidden rounded-xl border border-[var(--workspace-border)]">
            <div className="grid grid-cols-7 border-b border-[var(--workspace-border)] bg-[var(--workspace-background)]">
                {WEEKDAY_LABELS.map((label) => (
                    <div
                        key={label}
                        className="px-2 py-2 text-center text-[10px] font-semibold uppercase tracking-wider text-[var(--workspace-text-muted)]"
                    >
                        {label}
                    </div>
                ))}
            </div>

            <div className="grid grid-rows-6">
                {weeks.map((week, weekIndex) => (
                    <div
                        key={weekIndex}
                        className="grid grid-cols-7 divide-x divide-[var(--workspace-border)] border-b border-[var(--workspace-border)] last:border-b-0"
                    >
                        {week.map((day) => {
                            const dayEvents = eventsForDay(day);
                            const visible = dayEvents.slice(
                                0,
                                MAX_VISIBLE_PER_CELL
                            );
                            const overflow =
                                dayEvents.length - visible.length;

                            return (
                                <DroppableCell
                                    key={day.toISOString()}
                                    id={`day|${day.toISOString()}`}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => onSelectSlot(day)}
                                    onKeyDown={(e: React.KeyboardEvent) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            onSelectSlot(day);
                                        }
                                    }}
                                    className={cn(
                                        "flex min-h-24 cursor-pointer flex-col items-stretch gap-1 p-1.5 text-left transition-colors hover:bg-[var(--workspace-background)]/70",
                                        !isSameMonth(day, currentDate) &&
                                            "bg-[var(--workspace-background)]/40"
                                    )}
                                >
                                    <span
                                        className={cn(
                                            "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold",
                                            isToday(day)
                                                ? "bg-[var(--workspace-primary)] text-white"
                                                : isSameMonth(
                                                        day,
                                                        currentDate
                                                    )
                                                  ? "text-[var(--workspace-text)]"
                                                  : "text-[var(--workspace-text-subtle)]"
                                        )}
                                    >
                                        {day.getDate()}
                                    </span>

                                    <div className="space-y-0.5">
                                        {visible.map((event) => (
                                            <div
                                                key={event.id}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <DraggableEventChip
                                                    event={event}
                                                    compact
                                                    onClick={() =>
                                                        onSelectEvent(event)
                                                    }
                                                />
                                            </div>
                                        ))}

                                        {overflow > 0 && (
                                            <p className="px-1.5 text-[10px] text-[var(--workspace-text-subtle)]">
                                                +{overflow} more
                                            </p>
                                        )}
                                    </div>
                                </DroppableCell>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}
