"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    DndContext,
    PointerSensor,
    pointerWithin,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";

import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";
import WorkspaceLoading from "@/components/workspace/ui/WorkspaceLoading";
import WorkspaceEmptyState from "@/components/workspace/ui/WorkspaceEmptyState";
import { CalendarPlus, Loader2 } from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";

import CalendarToolbar from "./CalendarToolbar";
import CalendarFilters from "./CalendarFilters";
import CalendarEventModal from "./CalendarEventModal";
import MonthView from "./MonthView";
import WeekView from "./WeekView";
import DayView from "./DayView";
import EventTypeBadge from "./EventTypeBadge";
import EventStatusBadge from "./EventStatusBadge";

import { cn } from "@/lib/utils";
import { fetchEvents, updateEvent, SchedulerApiError } from "@/lib/api/scheduler";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
    addDays,
    addMonths,
    endOfDay,
    monthGridRange,
    startOfDay,
    startOfWeek,
    endOfWeek,
} from "@/lib/scheduler/date-utils";
import type {
    CalendarEvent,
    CalendarViewMode,
    SchedulerEventFilters,
} from "@/lib/types/scheduler";
import { toast } from "sonner";

function rangeForView(
    date: Date,
    view: CalendarViewMode
): { start: Date; end: Date } {
    switch (view) {
        case "month":
            return monthGridRange(date);
        case "week":
            return { start: startOfWeek(date), end: endOfWeek(date) };
        case "day":
            return { start: startOfDay(date), end: endOfDay(date) };
        case "agenda":
            // 30-day forward-looking window for the agenda list.
            return { start: startOfDay(date), end: endOfDay(addDays(date, 30)) };
    }
}

export default function CalendarView() {
    const [currentDate, setCurrentDate] = useState(() => new Date());
    const [view, setView] = useState<CalendarViewMode>("month");
    const [filters, setFilters] = useState<SchedulerEventFilters>({});
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isRefetching, setIsRefetching] = useState(false);
    const hasLoadedOnce = useRef(false);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
        null
    );
    const [modalOpen, setModalOpen] = useState(false);

    const isMobile = useMediaQuery("(max-width: 768px)");

    // Month/Week grids aren't offered on small screens (see
    // CalendarToolbar) — if the viewport shrinks while one of
    // those is active, fall back to Day.
    useEffect(() => {
        if (isMobile && (view === "month" || view === "week")) {
            setView("day");
        }
    }, [isMobile, view]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 6 },
        })
    );

    const { start, end } = useMemo(
        () => rangeForView(currentDate, view),
        [currentDate, view]
    );

    const loadEvents = useCallback(async () => {
        if (hasLoadedOnce.current) {
            setIsRefetching(true);
        } else {
            setIsInitialLoading(true);
        }

        try {
            const result = await fetchEvents({
                ...filters,
                start: start.toISOString(),
                end: end.toISOString(),
            });
            setEvents(result);
        } catch (error) {
            console.error(error);
            const message =
                error instanceof SchedulerApiError
                    ? error.message
                    : "Failed to load events.";
            toast.error(message);
        } finally {
            hasLoadedOnce.current = true;
            setIsInitialLoading(false);
            setIsRefetching(false);
        }
    }, [filters, start, end]);

    useEffect(() => {
        loadEvents();
    }, [loadEvents]);

    function handleNavigate(direction: "prev" | "next" | "today") {
        if (direction === "today") {
            setCurrentDate(new Date());
            return;
        }

        setCurrentDate((prev) => {
            const delta = direction === "next" ? 1 : -1;

            if (view === "month") return addMonths(prev, delta);
            if (view === "week") return addDays(prev, delta * 7);
            return addDays(prev, delta);
        });
    }

    function handleSelectEvent(event: CalendarEvent) {
        setSelectedEvent(event);
        setModalOpen(true);
    }

    function handleSelectSlot(date: Date) {
        // Hands off to Create with the slot pre-filled via query param.
        const iso = date.toISOString();
        window.location.href = `/workspace/scheduler/create?start=${encodeURIComponent(iso)}`;
    }

    async function commitEventTimes(
        eventId: string,
        newStart: Date,
        newEnd: Date
    ) {
        // Optimistic update so the grid doesn't flicker back before the refetch.
        setEvents((prev) =>
            prev.map((e) =>
                e.id === eventId
                    ? {
                          ...e,
                          startAt: newStart.toISOString(),
                          endAt: newEnd.toISOString(),
                      }
                    : e
            )
        );

        try {
            await updateEvent(eventId, {
                startAt: newStart.toISOString(),
                endAt: newEnd.toISOString(),
            });
        } catch (error) {
            console.error(error);
            const message =
                error instanceof SchedulerApiError
                    ? error.message
                    : "Failed to reschedule the event.";
            toast.error(message);
            loadEvents(); // revert the optimistic update
        }
    }

    function handleDragEnd(dragEvent: DragEndEvent) {
        const eventId = dragEvent.active.id as string;
        const overId = dragEvent.over?.id as string | undefined;
        if (!overId) return;

        const original = events.find((e) => e.id === eventId);
        if (!original) return;

        const originalStart = new Date(original.startAt);
        const durationMs =
            new Date(original.endAt).getTime() - originalStart.getTime();

        let newStart: Date;

        if (overId.startsWith("day|")) {
            // Month view: dropped on a day cell — keep the original time,
            // change the date.
            const day = new Date(overId.slice("day|".length));
            newStart = new Date(day);
            newStart.setHours(
                originalStart.getHours(),
                originalStart.getMinutes(),
                0,
                0
            );
        } else if (overId.startsWith("hour|")) {
            // Week/Day view: dropped on an hour cell — change both the
            // date and the hour, keep the original minute offset.
            const [, dayIso, hourStr] = overId.split("|");
            const day = new Date(dayIso);
            newStart = new Date(day);
            newStart.setHours(
                Number(hourStr),
                originalStart.getMinutes(),
                0,
                0
            );
        } else {
            return;
        }

        const newEnd = new Date(newStart.getTime() + durationMs);
        commitEventTimes(eventId, newStart, newEnd);
    }

    function handleResizeEvent(event: CalendarEvent, newEndAt: Date) {
        commitEventTimes(event.id, new Date(event.startAt), newEndAt);
    }

    return (
        <div className="space-y-4">
            <CalendarToolbar
                currentDate={currentDate}
                view={view}
                onViewChange={setView}
                onNavigate={handleNavigate}
                isMobile={isMobile}
            />

            <CalendarFilters filters={filters} onChange={setFilters} />

            <DndContext
                sensors={sensors}
                collisionDetection={pointerWithin}
                onDragEnd={handleDragEnd}
            >
                <WorkspaceCard
                    padding="none"
                    className="relative overflow-hidden"
                >
                    {isRefetching && (
                        <div className="absolute right-3 top-3 z-20 flex items-center gap-1.5 rounded-full border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-2.5 py-1 text-[10px] text-[var(--workspace-text-muted)] shadow-[var(--workspace-shadow-sm)]">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Updating…
                        </div>
                    )}

                    {isInitialLoading ? (
                        <WorkspaceLoading label="Loading events..." />
                    ) : (
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={view}
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                transition={{ duration: 0.15, ease: "easeOut" }}
                            >
                                {view === "month" ? (
                                    <MonthView
                                        currentDate={currentDate}
                                        events={events}
                                        onSelectEvent={handleSelectEvent}
                                        onSelectSlot={handleSelectSlot}
                                    />
                                ) : view === "week" ? (
                                    <WeekView
                                        currentDate={currentDate}
                                        events={events}
                                        onSelectEvent={handleSelectEvent}
                                        onSelectSlot={handleSelectSlot}
                                        onResizeEvent={handleResizeEvent}
                                    />
                                ) : view === "day" ? (
                                    <DayView
                                        currentDate={currentDate}
                                        events={events}
                                        onSelectEvent={handleSelectEvent}
                                        onSelectSlot={handleSelectSlot}
                                        onResizeEvent={handleResizeEvent}
                                    />
                                ) : (
                                    <AgendaList
                                        events={events}
                                        onSelectEvent={handleSelectEvent}
                                    />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    )}
                </WorkspaceCard>
            </DndContext>

            <CalendarEventModal
                event={selectedEvent}
                open={modalOpen}
                onOpenChange={setModalOpen}
                onChanged={loadEvents}
            />
        </div>
    );
}

function AgendaList({
    events,
    onSelectEvent,
}: {
    events: CalendarEvent[];
    onSelectEvent: (event: CalendarEvent) => void;
}) {
    const sorted = [...events].sort(
        (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
    );

    if (sorted.length === 0) {
        return (
            <WorkspaceEmptyState
                icon={CalendarPlus}
                title="No events in the next 30 days"
                description="Create a new event to get started."
                actionLabel="New Event"
                onAction={() => {
                    window.location.href = "/workspace/scheduler/create";
                }}
            />
        );
    }

    const groups = new Map<string, CalendarEvent[]>();
    for (const event of sorted) {
        const key = new Date(event.startAt).toDateString();
        const bucket = groups.get(key) ?? [];
        bucket.push(event);
        groups.set(key, bucket);
    }

    return (
        <div className="divide-y divide-[var(--workspace-border)]">
            {Array.from(groups.entries()).map(([dayKey, dayEvents]) => (
                <div key={dayKey}>
                    <div className="sticky top-0 z-10 bg-[var(--workspace-background)] px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--workspace-text-muted)]">
                        {new Intl.DateTimeFormat("en-US", {
                            weekday: "long",
                            month: "short",
                            day: "numeric",
                        }).format(new Date(dayKey))}
                    </div>

                    {dayEvents.map((event) => (
                        <button
                            type="button"
                            key={event.id}
                            onClick={() => onSelectEvent(event)}
                            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--workspace-background)]/70"
                        >
                            <div className="min-w-0">
                                <p
                                    className={cn(
                                        "truncate text-xs font-semibold text-[var(--workspace-text)]",
                                        event.status === "CANCELLED" &&
                                            "text-[var(--workspace-text-muted)] line-through"
                                    )}
                                >
                                    {event.title}
                                </p>
                                <p className="mt-0.5 text-[10px] text-[var(--workspace-text-muted)]">
                                    {event.allDay
                                        ? "All day"
                                        : new Intl.DateTimeFormat("en-US", {
                                              hour: "numeric",
                                              minute: "2-digit",
                                          }).format(new Date(event.startAt))}
                                    {event.location && ` · ${event.location}`}
                                </p>
                            </div>

                            <div className="flex shrink-0 items-center gap-1.5">
                                <EventTypeBadge type={event.type} />
                                <EventStatusBadge status={event.status} />
                            </div>
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
}
