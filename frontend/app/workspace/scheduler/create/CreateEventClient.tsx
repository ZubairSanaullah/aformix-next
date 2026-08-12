"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

import EventForm from "@/components/workspace/scheduler/EventForm";
import WorkspaceButton from "@/components/workspace/ui/WorkspaceButton";
import WorkspaceCard from "@/components/workspace/ui/WorkspaceCard";
import WorkspacePageHeader from "@/components/workspace/ui/WorkspacePageHeader";

import { createEvent, SchedulerApiError } from "@/lib/api/scheduler";
import { toDateTimeLocalValue } from "@/lib/scheduler/date-utils";
import type { EventInput } from "@/lib/validations/event";

interface RelationshipOption {
    id: string;
    name: string;
}

interface Props {
    contacts: RelationshipOption[];
    companies: RelationshipOption[];
    leads: RelationshipOption[];
    deals: RelationshipOption[];
    tasks: RelationshipOption[];
}

export default function CreateEventClient({
    contacts,
    companies,
    leads,
    deals,
    tasks,
}: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // If the calendar hands off a pre-selected slot, prefill start/end.
    const prefillStartParam = searchParams.get("start");
    const prefillStart = prefillStartParam
        ? toDateTimeLocalValue(new Date(prefillStartParam))
        : undefined;
    const prefillEnd = prefillStartParam
        ? toDateTimeLocalValue(
                new Date(new Date(prefillStartParam).getTime() + 30 * 60 * 1000)
            )
        : undefined;

    const onSubmit = async (data: EventInput) => {
        try {
            await createEvent(data);
            toast.success("Event created successfully.");
            router.push("/workspace/scheduler");
            router.refresh();
        } catch (error) {
            console.error(error);
            const message =
                error instanceof SchedulerApiError
                    ? error.message
                    : "Something went wrong while creating the event.";
            toast.error(message);
        }
    };

    return (
        <div className="mx-auto w-full max-w-[1000px] space-y-6">
            <WorkspacePageHeader
                title="Create Event"
                description="Schedule a meeting, call, appointment, or reminder."
                breadcrumbs={[
                    { label: "Workspace", href: "/workspace" },
                    { label: "Scheduler", href: "/workspace/scheduler" },
                    { label: "Create Event" },
                ]}
                actions={
                    <WorkspaceButton
                        variant="secondary"
                        size="sm"
                        onClick={() => router.push("/workspace/scheduler")}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Scheduler
                    </WorkspaceButton>
                }
            />

            <WorkspaceCard padding="none" className="overflow-hidden">
                <div className="border-b border-[var(--workspace-border)] bg-[var(--workspace-background)] px-5 py-4 sm:px-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                            <h2 className="text-sm font-semibold text-[var(--workspace-text)]">
                                New Event
                            </h2>
                            <p className="mt-0.5 text-xs text-[var(--workspace-text-muted)]">
                                Fill in the details below.
                            </p>
                        </div>

                        <WorkspaceButton
                            variant="secondary"
                            size="sm"
                            type="submit"
                            form="create-event-form"
                        >
                            <Save className="h-3.5 w-3.5" />
                            Save Event
                        </WorkspaceButton>
                    </div>
                </div>

                <div className="p-5 sm:p-6">
                    <EventForm
                        mode="create"
                        onSubmit={onSubmit}
                        contacts={contacts}
                        companies={companies}
                        leads={leads}
                        deals={deals}
                        tasks={tasks}
                        defaultValues={{
                            startAt: prefillStart,
                            endAt: prefillEnd,
                        }}
                    />
                </div>
            </WorkspaceCard>
        </div>
    );
}
