import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { pipelineSchema } from "@/lib/validations/deal";
import { getPipelines, createPipeline } from "@/lib/services/deal";
import { requireAdmin } from "@/lib/auth/authorize";

export async function GET() {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const pipelines = await getPipelines();
        return NextResponse.json(pipelines);
    } catch (error) {
        console.error("GET /api/crm/pipelines error:", error);
        return NextResponse.json(
            { error: "Failed to fetch pipelines" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const authError = requireAdmin(session);
    if (authError) return authError;

    try {
        const body = await req.json();
        const parsed = pipelineSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation failed", issues: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const pipeline = await createPipeline(parsed.data);
        return NextResponse.json(pipeline, { status: 201 });
    } catch (error) {
        console.error("POST /api/crm/pipelines error:", error);
        return NextResponse.json(
            { error: "Failed to create pipeline" },
            { status: 500 }
        );
    }
}