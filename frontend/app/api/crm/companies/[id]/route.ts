import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
    deleteCRMCompany,
    updateCRMCompany,
} from "@/lib/services/companies";
import { companySchema } from "@/lib/validations/company";

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

        const company = await prisma.company.findFirst({
            where: {
                id,
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },

                contacts: {
                    where: {
                        deletedAt: null,
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true,
                        jobTitle: true,
                        status: true,
                    },
                },

                leads: {
                    orderBy: {
                        createdAt: "desc",
                    },
                    select: {
                        id: true,
                        title: true,
                        status: true,
                        source: true,
                        value: true,
                        createdAt: true,
                    },
                },

                // FIXED: `stage` on Deal is a relation ({ id, name, color }),
                // not a scalar column. Selecting it as `stage: true` either
                // throws at the Prisma level or (if it somehow passes)
                // serializes as an object, which the frontend was rendering
                // as `deal.stage || "Deal"` -> "[object Object]".
                deals: {
                    orderBy: {
                        createdAt: "desc",
                    },
                    select: {
                        id: true,
                        title: true,
                        stage: {
                            select: {
                                id: true,
                                name: true,
                                color: true,
                            },
                        },
                        value: true,
                        createdAt: true,
                    },
                },

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

                _count: {
                    select: {
                        contacts: true,
                        leads: true,
                        deals: true,
                        notes: true,
                        activities: true,
                    },
                },
            },
        });

        if (!company) {
            return NextResponse.json(
                { error: "Company not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ company });
    } catch (error) {
        console.error(
            "GET /api/crm/companies/[id] error:",
            error
        );

        return NextResponse.json(
            { error: "Failed to fetch company" },
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

        const existingCompany =
            await prisma.company.findUnique({
                where: {
                    id,
                },
                select: {
                    id: true,
                    ownerId: true,
                },
            });

        if (!existingCompany) {
            return NextResponse.json(
                { error: "Company not found" },
                { status: 404 }
            );
        }

        if (
            existingCompany.ownerId !==
            session.user.id
        ) {
            return NextResponse.json(
                { error: "Forbidden" },
                { status: 403 }
            );
        }

        const body = await request.json();

        const parsed =
            companySchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    issues:
                        parsed.error.flatten(),
                },
                { status: 400 }
            );
        }

        const data = parsed.data;

        const company =
            await updateCRMCompany(id, {
                name: data.name,
                website: data.website,
                industry: data.industry,
                size: data.size,
                phone: data.phone,
                email: data.email,
                location: data.location,
                description: data.description,
                status: data.status,
            });

        return NextResponse.json({
            company,
        });
    } catch (error) {
        console.error(
            "PATCH /api/crm/companies/[id] error:",
            error
        );

        return NextResponse.json(
            {
                error:
                    "Failed to update company",
            },
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

        const existingCompany =
            await prisma.company.findUnique({
                where: {
                    id,
                },
                select: {
                    id: true,
                    ownerId: true,
                },
            });

        if (!existingCompany) {
            return NextResponse.json(
                {
                    error: "Company not found",
                },
                { status: 404 }
            );
        }

        if (
            existingCompany.ownerId !==
            session.user.id
        ) {
            return NextResponse.json(
                {
                    error: "Forbidden",
                },
                { status: 403 }
            );
        }

        const result =
            await deleteCRMCompany(id);

        if (!result.success) {
            if (
                result.reason ===
                "NOT_FOUND"
            ) {
                return NextResponse.json(
                    {
                        error:
                            "Company not found",
                    },
                    { status: 404 }
                );
            }

            if (
                result.reason ===
                "HAS_RELATIONSHIPS"
            ) {
                return NextResponse.json(
                    {
                        error:
                            "This company cannot be deleted because it has related CRM records.",
                        counts: result.counts,
                    },
                    { status: 409 }
                );
            }
        }

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error(
            "DELETE /api/crm/companies/[id] error:",
            error
        );

        return NextResponse.json(
            {
                error:
                    "Failed to delete company",
            },
            { status: 500 }
        );
    }
}