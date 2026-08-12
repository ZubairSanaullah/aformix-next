"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

import EventForm from "@/components/workspace/scheduler/EventForm";
import WorkspaceButton from "@/components/workspace/ui/WorkspaceButton";
import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";
import WorkspacePageHeader from "@/components/workspace/ui/WorkspacePageHeader";
import WorkspaceLoading from "@/components/workspace/ui/WorkspaceLoading";

import {
    fetchEvent,
    updateEvent,
    SchedulerApiError,
} from "@/lib/api/scheduler";
import { toDateTimeLocalValue } from "@/lib/scheduler/date-utils";
import type { EventInput } from "@/lib/validations/event";
import type { CalendarEvent } from "@/lib/types/scheduler";

interface RelationshipOption {
    id: string;
    name: string;
}

interface Props {
    eventId: string;
    contacts: RelationshipOption[];
    companies: RelationshipOption[];
    leads: RelationshipOption[];
    deals: RelationshipOption[];
    tasks: RelationshipOption[];
}

function toDefaultValues(event: CalendarEvent): Partial<EventInput> {
    return {
        title: event.title,
        description: event.description ?? "",
        type: event.type,
        status: event.status,
        startAt: toDateTimeLocalValue(new Date(event.startAt)),
        endAt: toDateTimeLocalValue(new Date(event.endAt)),
        allDay: event.allDay,
        location: event.location ?? "",
        contactId: event.contact?.id ?? "",
        companyId: event.company?.id ?? "",
        leadId: event.lead?.id ?? "",
        dealId: event.deal?.id ?? "",
        taskId: event.task?.id ?? "",
    };
}

export default function EditEventClient({
    eventId,
    contacts,
    companies,
    leads,
    deals,
    tasks,
}: Props) {
    const router = useRouter();
    const [event, setEvent] = useState<CalendarEvent | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    function load() {
        setIsLoading(true);
        setNotFound(false);
        fetchEvent(eventId)
            .then(setEvent)
            .catch((error) => {
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
            })
            .finally(() => setIsLoading(false));
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eventId]);

    const onSubmit = async (data: EventInput) => {
        try {
            await updateEvent(eventId, data);
            toast.success("Event updated successfully.");
            router.push(`/workspace/scheduler/${eventId}`);
            router.refresh();
        } catch (error) {
            console.error(error);
            const message =
                error instanceof SchedulerApiError
                    ? error.message
                    : "Something went wrong while updating the event.";
            toast.error(message);
        }
    };

    if (isLoading) {
        return <WorkspaceLoading fullPage label="Loading event..." />;
    }

    if (!event) {
        return (
            <div className="mx-auto w-full max-w-[1000px] space-y-6">
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

    return (
        <div className="mx-auto w-full max-w-[1000px] space-y-6">
            <WorkspacePageHeader
                title="Edit Event"
                description="Update the details for this event."
                breadcrumbs={[
                    { label: "Workspace", href: "/workspace" },
                    { label: "Scheduler", href: "/workspace/scheduler" },
                    {
                        label: event.title,
                        href: `/workspace/scheduler/${event.id}`,
                    },
                    { label: "Edit" },
                ]}
                actions={
                    <WorkspaceButton
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                            router.push(`/workspace/scheduler/${event.id}`)
                        }
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Event
                    </WorkspaceButton>
                }
            />

            <WorkspaceCard padding="none" className="overflow-hidden">
                <div className="border-b border-[var(--workspace-border)] bg-[var(--workspace-background)] px-5 py-4 sm:px-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                            <h2 className="text-sm font-semibold text-[var(--workspace-text)]">
                                Edit Details
                            </h2>
                        </div>

                        <WorkspaceButton
                            variant="secondary"
                            size="sm"
                            type="submit"
                            form="edit-event-form"
                        >
                            <Save className="h-3.5 w-3.5" />
                            Save Changes
                        </WorkspaceButton>
                    </div>
                </div>

                <div className="p-5 sm:p-6">
                    <EventForm
                        mode="edit"
                        eventId={event.id}
                        onSubmit={onSubmit}
                        defaultValues={toDefaultValues(event)}
                        contacts={contacts}
                        companies={companies}
                        leads={leads}
                        deals={deals}
                        tasks={tasks}
                    />
                </div>
            </WorkspaceCard>
        </div>
    );
}
