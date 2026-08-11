import { NextResponse } from "next/server";

import { auth } from "@/auth";
import {
    getCRMLead,
    updateCRMLead,
    deleteCRMLead,
} from "@/lib/services/crm";
import { leadSchema } from "@/lib/validations/lead";

interface LeadRouteProps {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(
    request: Request,
    { params }: LeadRouteProps
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

        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                {
                    error: "Lead ID is required",
                },
                {
                    status: 400,
                }
            );
        }

        const lead = await getCRMLead(id);

        if (!lead) {
            return NextResponse.json(
                {
                    error: "Lead not found",
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json({
            lead,
        });
    } catch (error) {
        console.error(
            "GET /api/crm/leads/[id] error:",
            error
        );

        return NextResponse.json(
            {
                error: "Failed to fetch lead",
            },
            {
                status: 500,
            }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: LeadRouteProps
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

        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                {
                    error: "Lead ID is required",
                },
                {
                    status: 400,
                }
            );
        }

        await deleteCRMLead(id);

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error(
            "DELETE /api/crm/leads/[id] error:",
            error
        );

        if (
            error instanceof Error &&
            error.message === "LEAD_NOT_FOUND"
        ) {
            return NextResponse.json(
                {
                    error: "Lead not found",
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json(
            {
                error: "Failed to delete lead",
            },
            {
                status: 500,
            }
        );
    }
}

export async function PATCH(
    request: Request,
    { params }: LeadRouteProps
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

        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                {
                    error: "Lead ID is required",
                },
                {
                    status: 400,
                }
            );
        }

        const body = await request.json();

        const parsed = leadSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    issues: parsed.error.flatten(),
                },
                {
                    status: 400,
                }
            );
        }

        const data = parsed.data;

        const lead = await updateCRMLead(id, {
            title: data.title,
            description: data.description,
            status: data.status,
            source: data.source,
            value: data.value,
            contactId:
                data.contactId || undefined,
            companyId:
                data.companyId || undefined,
        });

        return NextResponse.json({
            lead,
        });
    } catch (error) {
        console.error(
            "PATCH /api/crm/leads/[id] error:",
            error
        );

        if (error instanceof Error) {
            if (
                error.message ===
                "LEAD_NOT_FOUND"
            ) {
                return NextResponse.json(
                    {
                        error: "Lead not found",
                    },
                    {
                        status: 404,
                    }
                );
            }

            if (
                error.message ===
                "CONTACT_NOT_FOUND"
            ) {
                return NextResponse.json(
                    {
                        error:
                            "Selected contact was not found",
                    },
                    {
                        status: 404,
                    }
                );
            }

            if (
                error.message ===
                "COMPANY_NOT_FOUND"
            ) {
                return NextResponse.json(
                    {
                        error:
                            "Selected company was not found",
                    },
                    {
                        status: 404,
                    }
                );
            }
        }

        return NextResponse.json(
            {
                error: "Failed to update lead",
            },
            {
                status: 500,
            }
        );
    }
}