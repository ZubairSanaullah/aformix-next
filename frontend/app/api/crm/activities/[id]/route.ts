import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { activityUpdateSchema } from "@/lib/validations/activity";
import {
    getActivityById,
    updateActivity,
    deleteActivity,
} from "@/lib/services/activity";

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const activity = await getActivityById(id);

        if (!activity) {
            return NextResponse.json(
                { error: "Activity not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(activity);
    } catch (error) {
        console.error("GET /api/crm/activities/[id] error:", error);
        return NextResponse.json(
            { error: "Failed to fetch activity" },
            { status: 500 }
        );
    }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const existing = await getActivityById(id);

        if (!existing) {
            return NextResponse.json(
                { error: "Activity not found" },
                { status: 404 }
            );
        }

        const body = await req.json();
        const parsed = activityUpdateSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation failed", issues: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const activity = await updateActivity(id, parsed.data);
        return NextResponse.json(activity);
    } catch (error) {
        console.error("PATCH /api/crm/activities/[id] error:", error);
        return NextResponse.json(
            { error: "Failed to update activity" },
            { status: 500 }
        );
    }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const existing = await getActivityById(id);

        if (!existing) {
            return NextResponse.json(
                { error: "Activity not found" },
                { status: 404 }
            );
        }

        await deleteActivity(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/crm/activities/[id] error:", error);
        return NextResponse.json(
            { error: "Failed to delete activity" },
            { status: 500 }
        );
    }
}