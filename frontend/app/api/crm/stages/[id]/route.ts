import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { pipelineStageUpdateSchema } from "@/lib/validations/deal";
import { getStageById, updateStage, deleteStage } from "@/lib/services/deal";
import { requireAdmin } from "@/lib/auth/authorize";

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const authError = requireAdmin(session);
    if (authError) return authError;

    try {
        const { id } = await params;
        const existing = await getStageById(id);

        if (!existing) {
            return NextResponse.json({ error: "Stage not found" }, { status: 404 });
        }

        const body = await req.json();
        const parsed = pipelineStageUpdateSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation failed", issues: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const stage = await updateStage(id, parsed.data);
        return NextResponse.json(stage);
    } catch (error) {
        console.error("PATCH /api/crm/stages/[id] error:", error);
        return NextResponse.json(
            { error: "Failed to update stage" },
            { status: 500 }
        );
    }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const authError = requireAdmin(session);
    if (authError) return authError;

    try {
        const { id } = await params;
        const existing = await getStageById(id);

        if (!existing) {
            return NextResponse.json({ error: "Stage not found" }, { status: 404 });
        }

        await deleteStage(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/crm/stages/[id] error:", error);
        // Prisma throws on FK constraint violation if deals still reference this stage
        return NextResponse.json(
            {
                error:
                    "Failed to delete stage. It may still have deals assigned to it.",
            },
            { status: 500 }
        );
    }
}