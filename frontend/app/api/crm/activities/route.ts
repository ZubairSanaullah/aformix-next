import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { createActivity, getActivities } from "@/lib/services/activity";
import { activitySchema } from "@/lib/validations/activity";

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

        const activities = await getActivities({
            search: searchParams.get("search") || undefined,
            type: searchParams.get("type") || undefined,
            contactId: searchParams.get("contactId") || undefined,
            companyId: searchParams.get("companyId") || undefined,
            leadId: searchParams.get("leadId") || undefined,
            dealId: searchParams.get("dealId") || undefined,
            userId: searchParams.get("ownerId") || undefined,
            completed:
                searchParams.get("completed") === "true"
                    ? true
                    : searchParams.get("completed") === "false"
                        ? false
                        : undefined,
            overdue:
                searchParams.get("overdue") === "true"
                    ? true
                    : undefined,
        });

        return NextResponse.json({ activities });
    } catch (error) {
        console.error("GET /api/crm/activities error:", error);
        return NextResponse.json(
            { error: "Failed to fetch activities" },
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
        const parsed = activitySchema.safeParse({
            ...body,
            userId: session.user.id,
        });

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    issues: parsed.error.flatten(),
                },
                { status: 400 }
            );
        }

        const activity = await createActivity(parsed.data);

        return NextResponse.json({ activity }, { status: 201 });
    } catch (error) {
        console.error("POST /api/crm/activities error:", error);
        return NextResponse.json(
            { error: "Failed to create activity" },
            { status: 500 }
        );
    }
}