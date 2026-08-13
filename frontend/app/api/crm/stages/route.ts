import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { pipelineStageSchema } from "@/lib/validations/deal";
import { createStage } from "@/lib/services/deal";
import { requireAdmin } from "@/lib/auth/authorize";

export async function POST(req: NextRequest) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const authError = requireAdmin(session);
    if (authError) return authError;

    try {
        const body = await req.json();
        const parsed = pipelineStageSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation failed", issues: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const stage = await createStage(parsed.data);
        return NextResponse.json(stage, { status: 201 });
    } catch (error) {
        console.error("POST /api/crm/stages error:", error);
        return NextResponse.json(
            { error: "Failed to create stage" },
            { status: 500 }
        );
    }
}