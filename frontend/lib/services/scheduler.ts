import {
    CalendarEventStatus,
    CalendarEventType,
    Prisma,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";

import {
    CreateCalendarEventData,
    UpdateCalendarEventData,
} from "@/lib/validations/calendar-event";

export interface GetCalendarEventsOptions {
    ownerId: string;
    startAt?: Date;
    endAt?: Date;
    status?: CalendarEventStatus;
    type?: CalendarEventType;
    contactId?: string;
    companyId?: string;
    leadId?: string;
    dealId?: string;
    taskId?: string;
    search?: string;
}

const calendarEventInclude = {
    owner: true,
    contact: true,
    company: true,
    lead: true,
    deal: true,
    task: true,
} satisfies Prisma.CalendarEventInclude;

/**
 * Error thrown when a CRM or Task relationship supplied
 * to a calendar event does not exist or does not belong
 * to the authenticated user.
 */
export class CalendarEventRelationError extends Error {
    constructor(
        public readonly relation:
            | "contact"
            | "company"
            | "lead"
            | "deal"
            | "task",
        public readonly id: string
    ) {
        super(
            `The selected ${relation} could not be found or does not belong to the current user.`
        );

        this.name = "CalendarEventRelationError";
    }
}

/**
 * Validate all optional CRM and Task relationships before
 * creating or updating a calendar event.
 *
 * Ownership is checked directly against the database rather
 * than relying on the existing CRM service layer.
 */
async function validateEventRelationships(
    ownerId: string,
    data: {
        contactId?: string | null;
        companyId?: string | null;
        leadId?: string | null;
        dealId?: string | null;
        taskId?: string | null;
    }
) {
    const {
        contactId,
        companyId,
        leadId,
        dealId,
        taskId,
    } = data;

    const [
        contact,
        company,
        lead,
        deal,
        task,
    ] = await Promise.all([
        contactId
            ? prisma.contact.findFirst({
                where: {
                    id: contactId,
                    ownerId,
                    deletedAt: null,
                },
                select: {
                    id: true,
                },
            })
            : null,

        companyId
            ? prisma.company.findFirst({
                where: {
                    id: companyId,
                    ownerId,
                },
                select: {
                    id: true,
                },
            })
            : null,

        leadId
            ? prisma.lead.findFirst({
                where: {
                    id: leadId,
                    ownerId,
                },
                select: {
                    id: true,
                },
            })
            : null,

        dealId
            ? prisma.deal.findFirst({
                where: {
                    id: dealId,
                    ownerId,
                },
                select: {
                    id: true,
                },
            })
            : null,

        taskId
            ? prisma.task.findFirst({
                where: {
                    id: taskId,
                    ownerId,
                },
                select: {
                    id: true,
                },
            })
            : null,
    ]);

    if (contactId && !contact) {
        throw new CalendarEventRelationError(
            "contact",
            contactId
        );
    }

    if (companyId && !company) {
        throw new CalendarEventRelationError(
            "company",
            companyId
        );
    }

    if (leadId && !lead) {
        throw new CalendarEventRelationError(
            "lead",
            leadId
        );
    }

    if (dealId && !deal) {
        throw new CalendarEventRelationError(
            "deal",
            dealId
        );
    }

    if (taskId && !task) {
        throw new CalendarEventRelationError(
            "task",
            taskId
        );
    }
}

/**
 * Get calendar events for an authenticated user.
 *
 * Supports optional date-range, status, type, CRM,
 * task, and search filters.
 */
export async function getCalendarEvents(
    options: GetCalendarEventsOptions
) {
    const {
        ownerId,
        startAt,
        endAt,
        status,
        type,
        contactId,
        companyId,
        leadId,
        dealId,
        taskId,
        search,
    } = options;

    const where: Prisma.CalendarEventWhereInput = {
        ownerId,
    };

    /**
     * Date-range filtering.
     *
     * An event overlaps the requested range when:
     *
     * event.startAt < requestedEnd
     * AND
     * event.endAt > requestedStart
     */
    if (startAt || endAt) {
        where.AND = [];

        if (endAt) {
            where.AND.push({
                startAt: {
                    lt: endAt,
                },
            });
        }

        if (startAt) {
            where.AND.push({
                endAt: {
                    gt: startAt,
                },
            });
        }
    }

    if (status) {
        where.status = status;
    }

    if (type) {
        where.type = type;
    }

    if (contactId) {
        where.contactId = contactId;
    }

    if (companyId) {
        where.companyId = companyId;
    }

    if (leadId) {
        where.leadId = leadId;
    }

    if (dealId) {
        where.dealId = dealId;
    }

    if (taskId) {
        where.taskId = taskId;
    }

    if (search?.trim()) {
        const searchTerm = search.trim();

        where.OR = [
            {
                title: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            },
            {
                description: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            },
            {
                location: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            },
        ];
    }

    return prisma.calendarEvent.findMany({
        where,
        include: calendarEventInclude,
        orderBy: [
            {
                startAt: "asc",
            },
            {
                createdAt: "asc",
            },
        ],
    });
}

/**
 * Get a single calendar event owned by the authenticated user.
 */
export async function getCalendarEventById(
    id: string,
    ownerId: string
) {
    return prisma.calendarEvent.findFirst({
        where: {
            id,
            ownerId,
        },
        include: calendarEventInclude,
    });
}

/**
 * Create a new calendar event.
 *
 * ownerId is intentionally supplied separately from
 * client-controlled event data.
 */
export async function createCalendarEvent(
    data: CreateCalendarEventData,
    ownerId: string
) {
    await validateEventRelationships(ownerId, {
        contactId: data.contactId,
        companyId: data.companyId,
        leadId: data.leadId,
        dealId: data.dealId,
        taskId: data.taskId,
    });

    return prisma.calendarEvent.create({
        data: {
            title: data.title,
            description: data.description ?? null,
            type:
                data.type ??
                CalendarEventType.MEETING,
            status:
                data.status ??
                CalendarEventStatus.SCHEDULED,
            startAt: data.startAt,
            endAt: data.endAt,
            allDay: data.allDay ?? false,
            location: data.location ?? null,

            ownerId,

            contactId: data.contactId ?? null,
            companyId: data.companyId ?? null,
            leadId: data.leadId ?? null,
            dealId: data.dealId ?? null,
            taskId: data.taskId ?? null,
        },
        include: calendarEventInclude,
    });
}

/**
 * Update an existing calendar event.
 *
 * The event must belong to ownerId.
 *
 * Any CRM or Task relationships supplied for the update
 * are validated against the same owner.
 */
export async function updateCalendarEvent(
    id: string,
    ownerId: string,
    data: UpdateCalendarEventData
) {
    const existingEvent =
        await prisma.calendarEvent.findFirst({
            where: {
                id,
                ownerId,
            },
            select: {
                id: true,
            },
        });

    if (!existingEvent) {
        return null;
    }

    await validateEventRelationships(ownerId, {
        contactId: data.contactId,
        companyId: data.companyId,
        leadId: data.leadId,
        dealId: data.dealId,
        taskId: data.taskId,
    });

    const updateData: Prisma.CalendarEventUpdateInput = {
        title: data.title,
        description: data.description,
        type: data.type,
        status: data.status,
        startAt: data.startAt,
        endAt: data.endAt,
        allDay: data.allDay,
        location: data.location,

        contact:
            data.contactId !== undefined
                ? data.contactId
                    ? {
                        connect: {
                            id: data.contactId,
                        },
                    }
                    : {
                        disconnect: true,
                    }
                : undefined,

        company:
            data.companyId !== undefined
                ? data.companyId
                    ? {
                        connect: {
                            id: data.companyId,
                        },
                    }
                    : {
                        disconnect: true,
                    }
                : undefined,

        lead:
            data.leadId !== undefined
                ? data.leadId
                    ? {
                        connect: {
                            id: data.leadId,
                        },
                    }
                    : {
                        disconnect: true,
                    }
                : undefined,

        deal:
            data.dealId !== undefined
                ? data.dealId
                    ? {
                        connect: {
                            id: data.dealId,
                        },
                    }
                    : {
                        disconnect: true,
                    }
                : undefined,

        task:
            data.taskId !== undefined
                ? data.taskId
                    ? {
                        connect: {
                            id: data.taskId,
                        },
                    }
                    : {
                        disconnect: true,
                    }
                : undefined,
    };

    return prisma.calendarEvent.update({
        where: {
            id,
        },
        data: updateData,
        include: calendarEventInclude,
    });
}

/**
 * Delete a calendar event.
 *
 * The event must belong to ownerId.
 */
export async function deleteCalendarEvent(
    id: string,
    ownerId: string
) {
    const existingEvent =
        await prisma.calendarEvent.findFirst({
            where: {
                id,
                ownerId,
            },
            select: {
                id: true,
            },
        });

    if (!existingEvent) {
        return null;
    }

    return prisma.calendarEvent.delete({
        where: {
            id,
        },
    });
}