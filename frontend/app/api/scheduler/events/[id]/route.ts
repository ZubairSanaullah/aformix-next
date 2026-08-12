import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";

import {
    calendarEventSchema,
} from "@/lib/validations/calendar-event";

import {
    deleteCalendarEvent,
    getCalendarEventById,
    updateCalendarEvent,
} from "@/lib/services/scheduler";

function normalizeCalendarEventDateTimes(body: Record<string, any>) {
    const normalized = { ...body };
    const normalizeField = (field: string) => {
        const value = normalized[field];

        if (typeof value !== "string") {
            return;
        }

        if (/(?:Z|[+-]\d{2}:\d{2})$/i.test(value)) {
            return;
        }

        const parsed = new Date(value);

        if (!Number.isNaN(parsed.getTime())) {
            normalized[field] = parsed.toISOString();
        }
    };

    normalizeField("startAt");
    normalizeField("endAt");

    return normalized;
}

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

/**
 * GET /api/scheduler/events/[id]
 *
 * Returns a single calendar event belonging to
 * the authenticated user.
 */
export async function GET(
    _request: NextRequest,
    context: RouteContext
) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                {
                    error: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        const { id } = await context.params;

        if (!id) {
            return NextResponse.json(
                {
                    error: "Event ID is required",
                },
                {
                    status: 400,
                }
            );
        }

        const event = await getCalendarEventById(
            id,
            session.user.id
        );

        if (!event) {
            return NextResponse.json(
                {
                    error: "Calendar event not found",
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json(
            {
                data: event,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error(
            "GET /api/scheduler/events/[id] error:",
            error
        );

        return NextResponse.json(
            {
                error: "Failed to fetch calendar event",
            },
            {
                status: 500,
            }
        );
    }
}

/**
 * PATCH /api/scheduler/events/[id]
 *
 * Updates a calendar event belonging to
 * the authenticated user.
 */
export async function PATCH(
    request: NextRequest,
    context: RouteContext
) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                {
                    error: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        const { id } = await context.params;

        if (!id) {
            return NextResponse.json(
                {
                    error: "Event ID is required",
                },
                {
                    status: 400,
                }
            );
        }

        /**
         * Verify that the event exists and belongs
         * to the authenticated user before accepting
         * update data.
         */
        const existingEvent = await getCalendarEventById(
            id,
            session.user.id
        );

        if (!existingEvent) {
            return NextResponse.json(
                {
                    error: "Calendar event not found",
                },
                {
                    status: 404,
                }
            );
        }

        const rawBody = await request.json();
        const body = normalizeCalendarEventDateTimes(rawBody);

        /**
         * PATCH supports partial updates, so we validate
         * the complete event after merging the existing
         * values with the incoming values.
         */
        const mergedData = {
            title: body.title ?? existingEvent.title,

            description:
                body.description !== undefined
                    ? body.description
                    : existingEvent.description,

            type: body.type ?? existingEvent.type,

            status: body.status ?? existingEvent.status,

            startAt:
                body.startAt ??
                existingEvent.startAt.toISOString(),

            endAt:
                body.endAt ??
                existingEvent.endAt.toISOString(),

            allDay:
                body.allDay !== undefined
                    ? body.allDay
                    : existingEvent.allDay,

            location:
                body.location !== undefined
                    ? body.location
                    : existingEvent.location,

            contactId:
                body.contactId !== undefined
                    ? body.contactId
                    : existingEvent.contactId,

            companyId:
                body.companyId !== undefined
                    ? body.companyId
                    : existingEvent.companyId,

            leadId:
                body.leadId !== undefined
                    ? body.leadId
                    : existingEvent.leadId,

            dealId:
                body.dealId !== undefined
                    ? body.dealId
                    : existingEvent.dealId,

            taskId:
                body.taskId !== undefined
                    ? body.taskId
                    : existingEvent.taskId,
        };

        const result =
            calendarEventSchema.safeParse(mergedData);

        if (!result.success) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    details: result.error.flatten(),
                },
                {
                    status: 400,
                }
            );
        }

        const data = result.data;

        const event = await updateCalendarEvent(
            id,
            session.user.id,
            {
                title: data.title,
                description: data.description ?? null,
                type: data.type,
                status: data.status,
                startAt: new Date(data.startAt),
                endAt: new Date(data.endAt),
                allDay: data.allDay,
                location: data.location ?? null,
                contactId: data.contactId ?? null,
                companyId: data.companyId ?? null,
                leadId: data.leadId ?? null,
                dealId: data.dealId ?? null,
            }
        );

        if (!event) {
            return NextResponse.json(
                {
                    error: "Calendar event not found",
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json(
            {
                data: event,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error(
            "PATCH /api/scheduler/events/[id] error:",
            error
        );

        return NextResponse.json(
            {
                error: "Failed to update calendar event",
            },
            {
                status: 500,
            }
        );
    }
}

/**
 * DELETE /api/scheduler/events/[id]
 *
 * Deletes a calendar event belonging to
 * the authenticated user.
 */
export async function DELETE(
    _request: NextRequest,
    context: RouteContext
) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                {
                    error: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        const { id } = await context.params;

        if (!id) {
            return NextResponse.json(
                {
                    error: "Event ID is required",
                },
                {
                    status: 400,
                }
            );
        }

        const event = await deleteCalendarEvent(
            id,
            session.user.id
        );

        if (!event) {
            return NextResponse.json(
                {
                    error: "Calendar event not found",
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json(
            {
                message: "Calendar event deleted successfully",
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error(
            "DELETE /api/scheduler/events/[id] error:",
            error
        );

        return NextResponse.json(
            {
                error: "Failed to delete calendar event",
            },
            {
                status: 500,
            }
        );
    }
}