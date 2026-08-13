import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { pipelineUpdateSchema } from "@/lib/validations/deal";
import {
    getPipelineById,
    updatePipeline,
    deletePipeline,
} from "@/lib/services/deal";
import { requireAdmin } from "@/lib/auth/authorize";

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
        const pipeline = await getPipelineById(id);

        if (!pipeline) {
            return NextResponse.json(
                { error: "Pipeline not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(pipeline);
    } catch (error) {
        console.error("GET /api/crm/pipelines/[id] error:", error);
        return NextResponse.json(
            { error: "Failed to fetch pipeline" },
            { status: 500 }
        );
    }
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
        const existing = await getPipelineById(id);

        if (!existing) {
            return NextResponse.json(
                { error: "Pipeline not found" },
                { status: 404 }
            );
        }

        const body = await req.json();
        const parsed = pipelineUpdateSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation failed", issues: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const pipeline = await updatePipeline(id, parsed.data);
        return NextResponse.json(pipeline);
    } catch (error) {
        console.error("PATCH /api/crm/pipelines/[id] error:", error);
        return NextResponse.json(
            { error: "Failed to update pipeline" },
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
        const existing = await getPipelineById(id);

        if (!existing) {
            return NextResponse.json(
                { error: "Pipeline not found" },
                { status: 404 }
            );
        }

        if (existing.deals.length > 0) {
            return NextResponse.json(
                {
                    error:
                        "This pipeline has deals attached to it. Move or delete those deals before deleting the pipeline.",
                },
                { status: 409 }
            );
        }

        await deletePipeline(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/crm/pipelines/[id] error:", error);
        return NextResponse.json(
            { error: "Failed to delete pipeline" },
            { status: 500 }
        );
    }
}