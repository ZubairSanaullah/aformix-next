import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations/contact";
import { getContacts } from "@/lib/services/contacts";

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

        const search = searchParams.get("search") || undefined;
        const status =
            (searchParams.get("status") as
                | "ACTIVE"
                | "INACTIVE"
                | "ARCHIVED"
                | null) || undefined;

        const companyId =
            searchParams.get("companyId") || undefined;

        const contacts = await getContacts({
            search,
            status,
            companyId,
        });

        return NextResponse.json({
            contacts,
        });
    } catch (error) {
        console.error("GET /api/crm/contacts error:", error);

        return NextResponse.json(
            { error: "Failed to fetch contacts" },
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

        const parsed = contactSchema.safeParse(body);

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

        const contact = await prisma.contact.create({
            data: {
                firstName: data.firstName,
                lastName: data.lastName || null,
                email: data.email || null,
                phone: data.phone || null,
                jobTitle: data.jobTitle || null,
                website: data.website || null,
                linkedinUrl: data.linkedinUrl || null,
                description: data.description || null,
                companyId: data.companyId || null,
                source: data.source ?? null,
                status: data.status,
                ownerId: session.user.id,
            },
        });

        return NextResponse.json(
            { contact },
            { status: 201 }
        );
    } catch (error) {
        console.error("POST /api/crm/contacts error:", error);

        return NextResponse.json(
            { error: "Failed to create contact" },
            { status: 500 }
        );
    }
}