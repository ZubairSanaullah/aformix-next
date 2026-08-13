import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { reorderStages } from "@/lib/services/deal";
import { requireAdmin } from "@/lib/auth/authorize";

const reorderSchema = z.object({
    updates: z
        .array(
            z.object({
                id: z.string().min(1),
                order: z.coerce.number().int().min(0),
            })
        )
        .min(1),
});

export async function POST(req: NextRequest) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const authError = requireAdmin(session);
    if (authError) return authError;

    try {
        const body = await req.json();
        const parsed = reorderSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation failed", issues: parsed.error.flatten() },
                { status: 400 }
            );
        }

        await reorderStages(parsed.data.updates);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("POST /api/crm/stages/reorder error:", error);
        return NextResponse.json(
            { error: "Failed to reorder stages" },
            { status: 500 }
        );
    }
}