import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations/contact";

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(
    _request: Request,
    { params }: RouteContext
) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = await params;

        const contact = await prisma.contact.findFirst({
            where: {
                id,
                ownerId: session.user.id,
                deletedAt: null,
            },
            include: {
                company: true,

                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },

                leads: true,
                deals: true,

                notes: {
                    orderBy: {
                        createdAt: "desc",
                    },
                },

                activities: {
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
        });

        if (!contact) {
            return NextResponse.json(
                { error: "Contact not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ contact });
    } catch (error) {
        console.error(
            "GET /api/crm/contacts/[id] error:",
            error
        );

        return NextResponse.json(
            { error: "Failed to fetch contact" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: Request,
    { params }: RouteContext
) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = await params;
        const body = await request.json();

        const existingContact = await prisma.contact.findFirst({
            where: {
                id,
                ownerId: session.user.id,
                deletedAt: null,
            },
        });

        if (!existingContact) {
            return NextResponse.json(
                { error: "Contact not found" },
                { status: 404 }
            );
        }

        const parsed = contactSchema.partial().safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    issues: parsed.error.flatten(),
                },
                { status: 400 }
            );
        }

        const data = parsed.data;

        const contact = await prisma.contact.update({
            where: {
                id,
            },
            data: {
                ...(data.firstName !== undefined && {
                    firstName: data.firstName,
                }),

                ...(data.lastName !== undefined && {
                    lastName: data.lastName || null,
                }),

                ...(data.email !== undefined && {
                    email: data.email || null,
                }),

                ...(data.phone !== undefined && {
                    phone: data.phone || null,
                }),

                ...(data.jobTitle !== undefined && {
                    jobTitle: data.jobTitle || null,
                }),

                ...(data.website !== undefined && {
                    website: data.website || null,
                }),

                ...(data.linkedinUrl !== undefined && {
                    linkedinUrl: data.linkedinUrl || null,
                }),

                ...(data.description !== undefined && {
                    description: data.description || null,
                }),

                ...(data.companyId !== undefined && {
                    companyId: data.companyId || null,
                }),

                ...(data.source !== undefined && {
                    source: data.source || null,
                }),

                ...(data.status !== undefined && {
                    status: data.status,
                }),
            },
        });

        return NextResponse.json({ contact });
    } catch (error) {
        console.error(
            "PATCH /api/crm/contacts/[id] error:",
            error
        );

        return NextResponse.json(
            { error: "Failed to update contact" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    _request: Request,
    { params }: RouteContext
) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = await params;

        const contact = await prisma.contact.findFirst({
            where: {
                id,
                ownerId: session.user.id,
                deletedAt: null,
            },
        });

        if (!contact) {
            return NextResponse.json(
                { error: "Contact not found" },
                { status: 404 }
            );
        }

        await prisma.contact.update({
            where: {
                id,
            },
            data: {
                deletedAt: new Date(),
            },
        });

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error(
            "DELETE /api/crm/contacts/[id] error:",
            error
        );

        return NextResponse.json(
            { error: "Failed to delete contact" },
            { status: 500 }
        );
    }
}