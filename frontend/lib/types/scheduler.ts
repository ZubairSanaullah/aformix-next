// Mirrors the Scheduler backend contract from Phase 11.1–11.9.
// Do not diverge from these shapes — the backend is the source of truth.

export type EventType =
    | "MEETING"
    | "APPOINTMENT"
    | "CALL"
    | "REMINDER"
    | "OTHER";

export type EventStatus =
    | "SCHEDULED"
    | "COMPLETED"
    | "CANCELLED";

export interface CrmRef {
    id: string;
    name: string;
}

export interface TaskRef {
    id: string;
    title: string;
}

export interface CalendarEvent {
    id: string;
    title: string;
    description: string | null;
    type: EventType;
    status: EventStatus;
    startAt: string; // ISO string
    endAt: string; // ISO string
    allDay: boolean;
    location: string | null;
    owner: {
        id: string;
        name: string;
    };
    contact: CrmRef | null;
    company: CrmRef | null;
    lead: CrmRef | null;
    deal: CrmRef | null;
    task: TaskRef | null;
}

export type CalendarViewMode = "month" | "week" | "day" | "agenda";

export interface SchedulerEventFilters {
    search?: string;
    type?: EventType | "";
    status?: EventStatus | "";
    relationship?: "contact" | "company" | "lead" | "deal" | "task" | "";
    start?: string; // ISO — visible range start
    end?: string; // ISO — visible range end
}

export const EVENT_TYPES: EventType[] = [
    "MEETING",
    "APPOINTMENT",
    "CALL",
    "REMINDER",
    "OTHER",
];

export const EVENT_STATUSES: EventStatus[] = [
    "SCHEDULED",
    "COMPLETED",
    "CANCELLED",
];

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
    MEETING: "Meeting",
    APPOINTMENT: "Appointment",
    CALL: "Call",
    REMINDER: "Reminder",
    OTHER: "Other",
};

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
    SCHEDULED: "Scheduled",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
};
