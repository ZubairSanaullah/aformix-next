"use client";

import { hourLabels, startOfDay } from "@/lib/scheduler/date-utils";
import { HOUR_ROW_HEIGHT } from "@/lib/scheduler/grid-constants";
import type { CalendarEvent as CalendarEventType } from "@/lib/types/scheduler";
import CalendarEvent from "./CalendarEvent";
import DroppableCell from "./DroppableCell";
import TimeGridEventBlock from "./TimeGridEventBlock";

interface DayViewProps {
    currentDate: Date;
    events: CalendarEventType[];
    onSelectEvent: (event: CalendarEventType) => void;
    onSelectSlot: (date: Date) => void;
    onResizeEvent: (event: CalendarEventType, newEndAt: Date) => void;
}

export default function DayView({
    currentDate,
    events,
    onSelectEvent,
    onSelectSlot,
    onResizeEvent,
}: DayViewProps) {
    const hours = hourLabels();
    const day = startOfDay(currentDate);

    const allDayEvents = events.filter((e) => e.allDay);
    const timedEvents = events.filter((e) => !e.allDay);

    function blockPosition(event: CalendarEventType) {
        const start = new Date(event.startAt);
        const end = new Date(event.endAt);
        const startMinutes = start.getHours() * 60 + start.getMinutes();
        const durationMinutes = Math.max(
            15,
            (end.getTime() - start.getTime()) / 60_000
        );

        return {
            top: (startMinutes / 60) * HOUR_ROW_HEIGHT,
            height: (durationMinutes / 60) * HOUR_ROW_HEIGHT,
        };
    }

    return (
        <div className="overflow-hidden rounded-xl border border-[var(--workspace-border)]">
            {allDayEvents.length > 0 && (
                <div className="space-y-1 border-b border-[var(--workspace-border)] bg-[var(--workspace-background)] p-2">
                    <p className="text-[9px] uppercase tracking-wider text-[var(--workspace-text-subtle)]">
                        All day
                    </p>
                    {allDayEvents.map((event) => (
                        <CalendarEvent
                            key={event.id}
                            event={event}
                            onClick={() => onSelectEvent(event)}
                        />
                    ))}
                </div>
            )}

            <div className="flex max-h-[640px] overflow-y-auto workspace-scrollbar">
                <div className="w-16 shrink-0">
                    {hours.map((label, hour) => (
                        <div
                            key={hour}
                            style={{ height: HOUR_ROW_HEIGHT }}
                            className="border-b border-[var(--workspace-border)] px-2 pt-1 text-right text-[9px] text-[var(--workspace-text-subtle)]"
                        >
                            {label}
                        </div>
                    ))}
                </div>

                <div
                    className="relative flex-1 border-l border-[var(--workspace-border)]"
                    style={{ height: HOUR_ROW_HEIGHT * 24 }}
                >
                    {hours.map((hourLabel, hour) => {
                        const slotDate = new Date(day);
                        slotDate.setHours(hour, 0, 0, 0);

                        return (
                            <DroppableCell
                                key={hour}
                                id={`hour|${day.toISOString()}|${hour}`}
                                role="button"
                                tabIndex={0}
                                aria-label={`Create event at ${hourLabel}`}
                                onClick={() => onSelectSlot(slotDate)}
                                onKeyDown={(e: React.KeyboardEvent) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        onSelectSlot(slotDate);
                                    }
                                }}
                                style={{
                                    position: "absolute",
                                    top: hour * HOUR_ROW_HEIGHT,
                                    left: 0,
                                    right: 0,
                                    height: HOUR_ROW_HEIGHT,
                                }}
                                className="cursor-pointer border-b border-[var(--workspace-border)] transition-colors hover:bg-[var(--workspace-background)]/70"
                            />
                        );
                    })}

                    {timedEvents.map((event) => {
                        const { top, height } = blockPosition(event);
                        return (
                            <TimeGridEventBlock
                                key={event.id}
                                event={event}
                                top={top}
                                height={height}
                                onClick={() => onSelectEvent(event)}
                                onResize={(newEndAt) =>
                                    onResizeEvent(event, newEndAt)
                                }
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
