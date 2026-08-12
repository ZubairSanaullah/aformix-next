import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";

import {
    calendarEventSchema,
} from "@/lib/validations/calendar-event";

import {
    createCalendarEvent,
    getCalendarEvents,
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

import {
    CalendarEventStatus,
    CalendarEventType,
} from "@prisma/client";

/**
 * GET /api/scheduler/events
 *
 * Returns calendar events belonging to the authenticated user.
 *
 * Supported query parameters:
 *
 * start
 * end
 * status
 * type
 * search
 * contactId
 * companyId
 * leadId
 * dealId
 * taskId
 */
export async function GET(request: NextRequest) {
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

        const searchParams = request.nextUrl.searchParams;

        const startParam = searchParams.get("start");
        const endParam = searchParams.get("end");

        const statusParam = searchParams.get("status");
        const typeParam = searchParams.get("type");

        const search = searchParams.get("search") ?? undefined;

        const contactId =
            searchParams.get("contactId") ?? undefined;

        const companyId =
            searchParams.get("companyId") ?? undefined;

        const leadId =
            searchParams.get("leadId") ?? undefined;

        const dealId =
            searchParams.get("dealId") ?? undefined;

        const taskId =
            searchParams.get("taskId") ?? undefined;

        let startAt: Date | undefined;
        let endAt: Date | undefined;

        if (startParam) {
            const parsedStart = new Date(startParam);

            if (Number.isNaN(parsedStart.getTime())) {
                return NextResponse.json(
                    {
                        error: "Invalid start date",
                    },
                    {
                        status: 400,
                    }
                );
            }

            startAt = parsedStart;
        }

        if (endParam) {
            const parsedEnd = new Date(endParam);

            if (Number.isNaN(parsedEnd.getTime())) {
                return NextResponse.json(
                    {
                        error: "Invalid end date",
                    },
                    {
                        status: 400,
                    }
                );
            }

            endAt = parsedEnd;
        }

        if (startAt && endAt && endAt <= startAt) {
            return NextResponse.json(
                {
                    error: "End date must be after start date",
                },
                {
                    status: 400,
                }
            );
        }

        let status: CalendarEventStatus | undefined;

        if (statusParam) {
            if (
                !Object.values(CalendarEventStatus).includes(
                    statusParam as CalendarEventStatus
                )
            ) {
                return NextResponse.json(
                    {
                        error: "Invalid event status",
                    },
                    {
                        status: 400,
                    }
                );
            }

            status = statusParam as CalendarEventStatus;
        }

        let type: CalendarEventType | undefined;

        if (typeParam) {
            if (
                !Object.values(CalendarEventType).includes(
                    typeParam as CalendarEventType
                )
            ) {
                return NextResponse.json(
                    {
                        error: "Invalid event type",
                    },
                    {
                        status: 400,
                    }
                );
            }

            type = typeParam as CalendarEventType;
        }

        const events = await getCalendarEvents({
            ownerId: session.user.id,
            startAt,
            endAt,
            status,
            type,
            search,
            contactId,
            companyId,
            leadId,
            dealId,
            taskId,
        });

        return NextResponse.json(
            {
                data: events,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error(
            "GET /api/scheduler/events error:",
            error
        );

        return NextResponse.json(
            {
                error: "Failed to fetch calendar events",
            },
            {
                status: 500,
            }
        );
    }
}

/**
 * POST /api/scheduler/events
 *
 * Creates a new calendar event for the authenticated user.
 */
export async function POST(request: NextRequest) {
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

        const rawBody = await request.json();
        const body = normalizeCalendarEventDateTimes(rawBody);

        const result = calendarEventSchema.safeParse(body);

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

        const event = await createCalendarEvent(
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
                taskId: data.taskId ?? null,
            },
            session.user.id
        );

        return NextResponse.json(
            {
                data: event,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error(
            "POST /api/scheduler/events error:",
            error
        );

        return NextResponse.json(
            {
                error: "Failed to create calendar event",
            },
            {
                status: 500,
            }
        );
    }
}