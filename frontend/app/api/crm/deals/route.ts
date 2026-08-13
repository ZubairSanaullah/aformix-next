import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { createDeal, getDeals } from "@/lib/services/deal";
import { dealSchema } from "@/lib/validations/deal";

export async function GET(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);

        const deals = await getDeals();

        return NextResponse.json({ deals });
    } catch (error) {
        console.error("GET /api/crm/deals error:", error);
        return NextResponse.json(
            { error: "Failed to fetch deals" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const parsed = dealSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation failed", issues: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const deal = await createDeal(parsed.data);

        return NextResponse.json({ deal }, { status: 201 });
    } catch (error) {
        console.error("POST /api/crm/deals error:", error);
        return NextResponse.json(
            { error: "Failed to create deal" },
            { status: 500 }
        );
    }
}