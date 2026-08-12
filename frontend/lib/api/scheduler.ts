import type {
    CalendarEvent,
    SchedulerEventFilters,
} from "@/lib/types/scheduler";
import type { EventInput } from "@/lib/validations/event";

const BASE_URL = "/api/scheduler/events";

class SchedulerApiError extends Error {
    constructor(message: string, public status?: number) {
        super(message);
        this.name = "SchedulerApiError";
    }
}

async function parseOrThrow<T>(response: Response): Promise<T> {
    const json = await response.json().catch(() => null);

    if (!response.ok) {
        throw new SchedulerApiError(
            json?.error || json?.message || "Something went wrong.",
            response.status
        );
    }

    // All API routes wrap their payload in a { data: ... } envelope.
    return (json?.data ?? json) as T;
}

/**
 * Fetch events for the visible calendar range only, per the
 * backend contract (GET /api/scheduler/events?start=...&end=...).
 * Additional filters are passed through as query params.
 */
export async function fetchEvents(
    filters: SchedulerEventFilters
): Promise<CalendarEvent[]> {
    const params = new URLSearchParams();

    if (filters.start) params.set("start", filters.start);
    if (filters.end) params.set("end", filters.end);
    if (filters.search) params.set("search", filters.search);
    if (filters.type) params.set("type", filters.type);
    if (filters.status) params.set("status", filters.status);
    if (filters.relationship)
        params.set("relationship", filters.relationship);

    const response = await fetch(`${BASE_URL}?${params.toString()}`, {
        method: "GET",
    });

    return parseOrThrow<CalendarEvent[]>(response);
}

export async function fetchEvent(id: string): Promise<CalendarEvent> {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "GET",
    });

    return parseOrThrow<CalendarEvent>(response);
}

export async function createEvent(
    input: EventInput
): Promise<CalendarEvent> {
    const response = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });

    return parseOrThrow<CalendarEvent>(response);
}

export async function updateEvent(
    id: string,
    input: Partial<EventInput>
): Promise<CalendarEvent> {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });

    return parseOrThrow<CalendarEvent>(response);
}

export async function deleteEvent(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new SchedulerApiError(
            data?.message || "Failed to delete event.",
            response.status
        );
    }
}

export async function markEventCompleted(
    id: string
): Promise<CalendarEvent> {
    return updateEvent(id, { status: "COMPLETED" });
}

export async function cancelEvent(id: string): Promise<CalendarEvent> {
    return updateEvent(id, { status: "CANCELLED" });
}

export { SchedulerApiError };
