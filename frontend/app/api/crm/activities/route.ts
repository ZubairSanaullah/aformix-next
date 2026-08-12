import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { activitySchema } from "@/lib/validations/activity";
import { getActivities, createActivity } from "@/lib/services/activity";

export async function GET(req: NextRequest) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);

        const activities = await getActivities({
            search: searchParams.get("search") || undefined,
            type: searchParams.get("type") || undefined,
            contactId: searchParams.get("contactId") || undefined,
            companyId: searchParams.get("companyId") || undefined,
            leadId: searchParams.get("leadId") || undefined,
            dealId: searchParams.get("dealId") || undefined,
            userId: searchParams.get("userId") || undefined,
            completed:
                searchParams.get("completed") === "true"
                    ? true
                    : searchParams.get("completed") === "false"
                        ? false
                        : undefined,
            overdue: searchParams.get("overdue") === "true" || undefined,
        });

        return NextResponse.json(activities);
    } catch (error) {
        console.error("GET /api/crm/activities error:", error);
        return NextResponse.json(
            { error: "Failed to fetch activities" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();

        // Inject the authenticated user's ID before parsing so we can use
        // activitySchema (with its .refine()) directly, avoiding internal unwrapping.
        const parsed = activitySchema.safeParse({
            ...body,
            userId: session.user.id,
        });

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation failed", issues: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const activity = await createActivity(parsed.data);

        return NextResponse.json(activity, { status: 201 });
    } catch (error) {
        console.error("POST /api/crm/activities error:", error);
        return NextResponse.json(
            { error: "Failed to create activity" },
            { status: 500 }
        );
    }
}