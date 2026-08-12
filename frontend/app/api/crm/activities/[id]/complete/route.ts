import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import {
    getActivityById,
    toggleActivityCompletion,
} from "@/lib/services/activity";

interface RouteParams {
    params: Promise<{ id: string }>;
}

const completeSchema = z.object({
    completed: z.boolean(),
});

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
        const parsed = completeSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation failed", issues: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const activity = await toggleActivityCompletion(
            id,
            parsed.data.completed
        );

        return NextResponse.json(activity);
    } catch (error) {
        console.error(
            "PATCH /api/crm/activities/[id]/complete error:",
            error
        );
        return NextResponse.json(
            { error: "Failed to update activity completion" },
            { status: 500 }
        );
    }
}