"use client";

import { useDraggable } from "@dnd-kit/core";

import { cn } from "@/lib/utils";
import CalendarEvent from "./CalendarEvent";
import type { CalendarEvent as CalendarEventType } from "@/lib/types/scheduler";

interface DraggableEventChipProps {
    event: CalendarEventType;
    onClick: () => void;
    compact?: boolean;
}

export default function DraggableEventChip({
    event,
    onClick,
    compact,
}: DraggableEventChipProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
        useDraggable({ id: event.id, data: { event } });

    const style = transform
        ? {
              transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
          }
        : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={cn(
                "touch-none",
                isDragging && "relative z-50 opacity-70"
            )}
        >
            <CalendarEvent event={event} compact={compact} onClick={onClick} />
        </div>
    );
}
