import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { createCRMCompany, getCRMCompanies } from "@/lib/services/companies";
import { companySchema } from "@/lib/validations/company";

export async function GET(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);

        const companies = await getCRMCompanies({
            search: searchParams.get("search") || undefined,
            status: (searchParams.get("status") as "ACTIVE" | "INACTIVE" | "ARCHIVED" | null) || undefined,
        });

        return NextResponse.json({ companies });
    } catch (error) {
        console.error("GET /api/crm/companies error:", error);
        return NextResponse.json(
            { error: "Failed to fetch companies" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const parsed = companySchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation failed", issues: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const company = await createCRMCompany({
            ...parsed.data,
            ownerId: session.user.id,
        });

        return NextResponse.json({ company }, { status: 201 });
    } catch (error) {
        console.error("POST /api/crm/companies error:", error);
        return NextResponse.json(
            { error: "Failed to create company" },
            { status: 500 }
        );
    }
}