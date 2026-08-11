import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { dealUpdateSchema } from "@/lib/validations/deal";
import { getDealById, updateDeal, deleteDeal } from "@/lib/services/deal";

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
        const deal = await getDealById(id);

        if (!deal) {
            return NextResponse.json({ error: "Deal not found" }, { status: 404 });
        }

        return NextResponse.json(deal);
    } catch (error) {
        console.error("GET /api/crm/deals/[id] error:", error);
        return NextResponse.json(
            { error: "Failed to fetch deal" },
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
        const existing = await getDealById(id);

        if (!existing) {
            return NextResponse.json({ error: "Deal not found" }, { status: 404 });
        }

        const body = await req.json();
        const parsed = dealUpdateSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation failed", issues: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const deal = await updateDeal(id, parsed.data);
        return NextResponse.json(deal);
    } catch (error) {
        console.error("PATCH /api/crm/deals/[id] error:", error);
        return NextResponse.json(
            { error: "Failed to update deal" },
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
        const existing = await getDealById(id);

        if (!existing) {
            return NextResponse.json({ error: "Deal not found" }, { status: 404 });
        }

        await deleteDeal(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/crm/deals/[id] error:", error);
        return NextResponse.json(
            { error: "Failed to delete deal" },
            { status: 500 }
        );
    }
}