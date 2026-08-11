import { NextResponse } from "next/server";

import { auth } from "@/auth";
import {
    getCRMLeads,
    createCRMLead,
} from "@/lib/services/crm";
import { leadSchema } from "@/lib/validations/lead";

export async function GET(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);

        const search =
            searchParams.get("search") || undefined;

        const status =
            searchParams.get("status") || undefined;

        const source =
            searchParams.get("source") || undefined;

        const companyId =
            searchParams.get("companyId") || undefined;

        const contactId =
            searchParams.get("contactId") || undefined;

        const ownerId =
            searchParams.get("ownerId") || undefined;

        const leads = await getCRMLeads({
            search,
            status,
            source,
            companyId,
            contactId,
            ownerId,
        });

        return NextResponse.json({
            leads,
        });
    } catch (error) {
        console.error(
            "GET /api/crm/leads error:",
            error
        );

        return NextResponse.json(
            { error: "Failed to fetch leads" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
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
                { status: 400 }
            );
        }

        const data = parsed.data;

        const lead = await createCRMLead({
            title: data.title,
            description: data.description,
            status: data.status,
            source: data.source,
            value: data.value,
            contactId: data.contactId || undefined,
            companyId: data.companyId || undefined,
            ownerId: session.user.id,
        });

        return NextResponse.json(
            {
                lead,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error(
            "POST /api/crm/leads error:",
            error
        );

        if (error instanceof Error) {
            if (error.message === "CONTACT_NOT_FOUND") {
                return NextResponse.json(
                    {
                        error: "Selected contact was not found",
                    },
                    { status: 404 }
                );
            }

            if (error.message === "COMPANY_NOT_FOUND") {
                return NextResponse.json(
                    {
                        error: "Selected company was not found",
                    },
                    { status: 404 }
                );
            }
        }

        return NextResponse.json(
            { error: "Failed to create lead" },
            { status: 500 }
        );
    }
}