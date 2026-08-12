"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { useDraggable } from "@dnd-kit/core";

import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/scheduler/date-utils";
import { HOUR_ROW_HEIGHT, MIN_BLOCK_HEIGHT } from "@/lib/scheduler/grid-constants";
import type { CalendarEvent as CalendarEventType } from "@/lib/types/scheduler";

const TYPE_STYLE: Record<CalendarEventType["type"], string> = {
    MEETING:
        "bg-[var(--workspace-primary-soft)] border-[var(--workspace-primary)]",
    APPOINTMENT: "bg-sky-50 border-sky-400 dark:bg-sky-500/10 dark:border-sky-400",
    CALL: "bg-amber-50 border-amber-400 dark:bg-amber-500/10 dark:border-amber-400",
    REMINDER: "bg-slate-50 border-slate-300 dark:bg-slate-500/10 dark:border-slate-500",
    OTHER: "bg-slate-50 border-slate-300 dark:bg-slate-500/10 dark:border-slate-500",
};

interface TimeGridEventBlockProps {
    event: CalendarEventType;
    top: number;
    height: number;
    onClick: () => void;
    onResize: (newEndAt: Date) => void;
}

export default function TimeGridEventBlock({
    event,
    top,
    height,
    onClick,
    onResize,
}: TimeGridEventBlockProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
        useDraggable({ id: event.id, data: { event } });

    const [resizing, setResizing] = useState(false);
    const [previewHeight, setPreviewHeight] = useState<number | null>(null);

    const startYRef = useRef(0);
    const startHeightRef = useRef(height);

    function handleResizeStart(e: ReactPointerEvent) {
        e.stopPropagation();
        e.preventDefault();

        setResizing(true);
        startYRef.current = e.clientY;
        startHeightRef.current = height;

        function handleMove(moveEvent: PointerEvent) {
            const delta = moveEvent.clientY - startYRef.current;
            const next = Math.max(
                MIN_BLOCK_HEIGHT,
                startHeightRef.current + delta
            );
            setPreviewHeight(next);
        }

        function handleUp(upEvent: PointerEvent) {
            window.removeEventListener("pointermove", handleMove);
            window.removeEventListener("pointerup", handleUp);

            const delta = upEvent.clientY - startYRef.current;
            const finalHeight = Math.max(
                MIN_BLOCK_HEIGHT,
                startHeightRef.current + delta
            );

            // Snap to 15-minute increments.
            const rawMinutes = (finalHeight / HOUR_ROW_HEIGHT) * 60;
            const snappedMinutes = Math.max(
                15,
                Math.round(rawMinutes / 15) * 15
            );

            const start = new Date(event.startAt);
            const newEnd = new Date(
                start.getTime() + snappedMinutes * 60_000
            );

            setResizing(false);
            setPreviewHeight(null);
            onResize(newEnd);
        }

        window.addEventListener("pointermove", handleMove);
        window.addEventListener("pointerup", handleUp);
    }

    const style = {
        top,
        height: previewHeight ?? height,
        transform:
            !resizing && transform
                ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
                : undefined,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "absolute left-1 right-1 z-10 touch-none overflow-hidden rounded-md border-l-2 px-1.5 py-1 text-left shadow-sm transition-shadow",
                TYPE_STYLE[event.type],
                event.status === "CANCELLED" && "opacity-50",
                (isDragging || resizing) && "z-30 shadow-md"
            )}
            {...(resizing ? {} : listeners)}
            {...(resizing ? {} : attributes)}
        >
            <button
                type="button"
                onClick={onClick}
                className={cn(
                    "block w-full text-left",
                    event.status === "CANCELLED" && "line-through"
                )}
            >
                <p className="truncate text-[10px] font-semibold text-[var(--workspace-text)]">
                    {event.title}
                </p>

                {!event.allDay && height > 28 && (
                    <p className="truncate text-[9px] text-[var(--workspace-text-muted)]">
                        {formatTime(new Date(event.startAt))}
                    </p>
                )}
            </button>

            <div
                onPointerDown={handleResizeStart}
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-1.5 cursor-ns-resize"
                title="Drag to resize"
            />
        </div>
    );
}
