"use client";

import Link from "next/link";
import { ExternalLink, MapPin, Pencil } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import WorkspaceButton from "@/components/workspace/ui/WorkspaceButton";

import EventTypeBadge from "./EventTypeBadge";
import EventStatusBadge from "./EventStatusBadge";
import EventActions from "./EventActions";

import type { CalendarEvent } from "@/lib/types/scheduler";
import { formatTime } from "@/lib/scheduler/date-utils";

interface CalendarEventModalProps {
    event: CalendarEvent | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onChanged?: () => void;
}

export default function CalendarEventModal({
    event,
    open,
    onOpenChange,
    onChanged,
}: CalendarEventModalProps) {
    if (!event) return null;

    const start = new Date(event.startAt);
    const end = new Date(event.endAt);

    const relationships = [
        event.contact && { label: "Contact", ref: event.contact },
        event.company && { label: "Company", ref: event.company },
        event.lead && { label: "Lead", ref: event.lead },
        event.deal && { label: "Deal", ref: event.deal },
        event.task && {
            label: "Task",
            ref: { id: event.task.id, name: event.task.title },
        },
    ].filter(Boolean) as { label: string; ref: { id: string; name: string } }[];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg bg-[var(--workspace-surface)]">
                <DialogHeader>
                    <div className="flex flex-wrap items-center gap-2">
                        <EventTypeBadge type={event.type} />
                        <EventStatusBadge status={event.status} />
                    </div>

                    <DialogTitle className="text-[var(--workspace-text)]">
                        {event.title}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-3 text-xs text-[var(--workspace-text-muted)]">
                    <div>
                        {event.allDay
                            ? "All day"
                            : `${formatTime(start)} – ${formatTime(end)}`}
                    </div>

                    {event.location && (
                        <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" />
                            {event.location}
                        </div>
                    )}

                    {event.description && (
                        <p className="leading-5 text-[var(--workspace-text)]">
                            {event.description}
                        </p>
                    )}

                    {relationships.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {relationships.map((rel) => (
                                <span
                                    key={`${rel.label}-${rel.ref.id}`}
                                    className="rounded-full border border-[var(--workspace-border)] px-2 py-1 text-[10px] text-[var(--workspace-text)]"
                                >
                                    {rel.label}: {rel.ref.name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <EventActions
                        event={event}
                        onChanged={() => {
                            onChanged?.();
                            onOpenChange(false);
                        }}
                    />

                    <div className="flex gap-2">
                        <Link href={`/workspace/scheduler/${event.id}`}>
                            <WorkspaceButton variant="secondary" size="sm">
                                <ExternalLink className="h-3.5 w-3.5" />
                                Details
                            </WorkspaceButton>
                        </Link>

                        <Link href={`/workspace/scheduler/${event.id}/edit`}>
                            <WorkspaceButton size="sm">
                                <Pencil className="h-3.5 w-3.5" />
                                Edit
                            </WorkspaceButton>
                        </Link>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
