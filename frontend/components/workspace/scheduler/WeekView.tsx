"use client";

import { cn } from "@/lib/utils";
import {
    addDays,
    hourLabels,
    isToday,
    startOfWeek,
} from "@/lib/scheduler/date-utils";
import { HOUR_ROW_HEIGHT } from "@/lib/scheduler/grid-constants";
import type { CalendarEvent as CalendarEventType } from "@/lib/types/scheduler";
import CalendarEvent from "./CalendarEvent";
import DroppableCell from "./DroppableCell";
import TimeGridEventBlock from "./TimeGridEventBlock";

interface WeekViewProps {
    currentDate: Date;
    events: CalendarEventType[];
    onSelectEvent: (event: CalendarEventType) => void;
    onSelectSlot: (date: Date) => void;
    onResizeEvent: (event: CalendarEventType, newEndAt: Date) => void;
}

export default function WeekView({
    currentDate,
    events,
    onSelectEvent,
    onSelectSlot,
    onResizeEvent,
}: WeekViewProps) {
    const weekStart = startOfWeek(currentDate);
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    const hours = hourLabels();

    const allDayEvents = events.filter((e) => e.allDay);
    const timedEvents = events.filter((e) => !e.allDay);

    function eventsForDay(day: Date) {
        return timedEvents.filter((event) => {
            const start = new Date(event.startAt);
            return (
                start.getFullYear() === day.getFullYear() &&
                start.getMonth() === day.getMonth() &&
                start.getDate() === day.getDate()
            );
        });
    }

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
            {/* Day headers */}
            <div className="grid grid-cols-[56px_repeat(7,1fr)] border-b border-[var(--workspace-border)] bg-[var(--workspace-background)]">
                <div />
                {days.map((day) => (
                    <div
                        key={day.toISOString()}
                        className="border-l border-[var(--workspace-border)] px-2 py-2 text-center"
                    >
                        <div className="text-[10px] uppercase tracking-wider text-[var(--workspace-text-muted)]">
                            {new Intl.DateTimeFormat("en-US", {
                                weekday: "short",
                            }).format(day)}
                        </div>
                        <div
                            className={cn(
                                "mx-auto mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                                isToday(day)
                                    ? "bg-[var(--workspace-primary)] text-white"
                                    : "text-[var(--workspace-text)]"
                            )}
                        >
                            {day.getDate()}
                        </div>
                    </div>
                ))}
            </div>

            {/* All-day row */}
            {allDayEvents.length > 0 && (
                <div className="grid grid-cols-[56px_repeat(7,1fr)] border-b border-[var(--workspace-border)]">
                    <div className="px-2 py-1.5 text-[9px] text-[var(--workspace-text-subtle)]">
                        All day
                    </div>
                    {days.map((day) => (
                        <div
                            key={day.toISOString()}
                            className="space-y-0.5 border-l border-[var(--workspace-border)] p-1"
                        >
                            {allDayEvents
                                .filter((event) => {
                                    const start = new Date(event.startAt);
                                    return (
                                        start.getFullYear() === day.getFullYear() &&
                                        start.getMonth() === day.getMonth() &&
                                        start.getDate() === day.getDate()
                                    );
                                })
                                .map((event) => (
                                    <CalendarEvent
                                        key={event.id}
                                        event={event}
                                        compact
                                        onClick={() => onSelectEvent(event)}
                                    />
                                ))}
                        </div>
                    ))}
                </div>
            )}

            {/* Time grid: hour label rail + 7 day columns of absolutely-positioned blocks */}
            <div className="flex max-h-[640px] overflow-y-auto workspace-scrollbar">
                <div className="w-14 shrink-0">
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

                <div className="grid flex-1 grid-cols-7">
                    {days.map((day) => (
                        <div
                            key={day.toISOString()}
                            className="relative border-l border-[var(--workspace-border)]"
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
                                        aria-label={`Create event at ${hourLabel} on ${day.toDateString()}`}
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

                            {eventsForDay(day).map((event) => {
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
                    ))}
                </div>
            </div>
        </div>
    );
}
