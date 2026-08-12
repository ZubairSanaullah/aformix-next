"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Pencil } from "lucide-react";

import WorkspaceButton from "@/components/workspace/ui/WorkspaceButton";
import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";
import WorkspacePageHeader from "@/components/workspace/ui/WorkspacePageHeader";
import WorkspaceLoading from "@/components/workspace/ui/WorkspaceLoading";
import WorkspaceDivider from "@/components/workspace/ui/WorkspaceDivider";

import EventTypeBadge from "@/components/workspace/scheduler/EventTypeBadge";
import EventStatusBadge from "@/components/workspace/scheduler/EventStatusBadge";
import EventActions from "@/components/workspace/scheduler/EventActions";

import { fetchEvent, SchedulerApiError } from "@/lib/api/scheduler";
import { formatTime } from "@/lib/scheduler/date-utils";
import type { CalendarEvent } from "@/lib/types/scheduler";
import { toast } from "sonner";

interface Props {
    eventId: string;
}

export default function EventDetailClient({ eventId }: Props) {
    const router = useRouter();
    const [event, setEvent] = useState<CalendarEvent | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    const load = useCallback(async () => {
        setIsLoading(true);
        setNotFound(false);
        try {
            const result = await fetchEvent(eventId);
            setEvent(result);
        } catch (error) {
            console.error(error);
            if (error instanceof SchedulerApiError && error.status === 404) {
                setNotFound(true);
            } else {
                const message =
                    error instanceof SchedulerApiError
                        ? error.message
                        : "Failed to load the event.";
                toast.error(message);
            }
        } finally {
            setIsLoading(false);
        }
    }, [eventId]);

    useEffect(() => {
        load();
    }, [load]);

    if (isLoading) {
        return <WorkspaceLoading fullPage label="Loading event..." />;
    }

    if (!event) {
        return (
            <div className="mx-auto w-full max-w-[900px] space-y-6">
                <WorkspaceCard padding="lg" className="space-y-4 text-center">
                    <p className="text-sm text-[var(--workspace-text-muted)]">
                        {notFound
                            ? "This event could not be found. It may have been deleted."
                            : "Something went wrong loading this event."}
                    </p>

                    <div className="flex justify-center gap-2">
                        {!notFound && (
                            <WorkspaceButton
                                variant="secondary"
                                size="sm"
                                onClick={load}
                            >
                                Try Again
                            </WorkspaceButton>
                        )}

                        <WorkspaceButton
                            size="sm"
                            onClick={() => router.push("/workspace/scheduler")}
                        >
                            Back to Scheduler
                        </WorkspaceButton>
                    </div>
                </WorkspaceCard>
            </div>
        );
    }

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
        <div className="mx-auto w-full max-w-[900px] space-y-6">
            <WorkspacePageHeader
                title={event.title}
                breadcrumbs={[
                    { label: "Workspace", href: "/workspace" },
                    { label: "Scheduler", href: "/workspace/scheduler" },
                    { label: event.title },
                ]}
                actions={
                    <div className="flex items-center gap-2">
                        <WorkspaceButton
                            variant="secondary"
                            size="sm"
                            onClick={() => router.push("/workspace/scheduler")}
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </WorkspaceButton>

                        <Link href={`/workspace/scheduler/${event.id}/edit`}>
                            <WorkspaceButton size="sm">
                                <Pencil className="h-3.5 w-3.5" />
                                Edit
                            </WorkspaceButton>
                        </Link>
                    </div>
                }
            />

            <WorkspaceCard padding="lg" className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <EventTypeBadge type={event.type} />
                        <EventStatusBadge status={event.status} />
                    </div>

                    <EventActions
                        event={event}
                        onChanged={load}
                        showDelete={false}
                    />
                </div>

                <WorkspaceDivider />

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-[var(--workspace-text-subtle)]">
                            When
                        </p>
                        <p className="mt-1 text-sm text-[var(--workspace-text)]">
                            {event.allDay
                                ? "All day"
                                : `${formatTime(start)} – ${formatTime(end)}`}
                        </p>
                        <p className="text-xs text-[var(--workspace-text-muted)]">
                            {new Intl.DateTimeFormat("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                            }).format(start)}
                        </p>
                    </div>

                    {event.location && (
                        <div>
                            <p className="text-[10px] uppercase tracking-wider text-[var(--workspace-text-subtle)]">
                                Location
                            </p>
                            <p className="mt-1 flex items-center gap-1.5 text-sm text-[var(--workspace-text)]">
                                <MapPin className="h-3.5 w-3.5" />
                                {event.location}
                            </p>
                        </div>
                    )}

                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-[var(--workspace-text-subtle)]">
                            Owner
                        </p>
                        <p className="mt-1 text-sm text-[var(--workspace-text)]">
                            {event.owner.name}
                        </p>
                    </div>
                </div>

                {event.description && (
                    <>
                        <WorkspaceDivider />
                        <div>
                            <p className="text-[10px] uppercase tracking-wider text-[var(--workspace-text-subtle)]">
                                Description
                            </p>
                            <p className="mt-1.5 whitespace-pre-wrap text-sm leading-6 text-[var(--workspace-text)]">
                                {event.description}
                            </p>
                        </div>
                    </>
                )}

                {relationships.length > 0 && (
                    <>
                        <WorkspaceDivider />
                        <div>
                            <p className="mb-2 text-[10px] uppercase tracking-wider text-[var(--workspace-text-subtle)]">
                                Related Records
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {relationships.map((rel) => (
                                    <span
                                        key={`${rel.label}-${rel.ref.id}`}
                                        className="rounded-full border border-[var(--workspace-border)] bg-[var(--workspace-background)] px-3 py-1.5 text-xs text-[var(--workspace-text)]"
                                    >
                                        <span className="text-[var(--workspace-text-muted)]">
                                            {rel.label}:
                                        </span>{" "}
                                        {rel.ref.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </WorkspaceCard>
        </div>
    );
}
