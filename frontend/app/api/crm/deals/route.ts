import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { dealSchema } from "@/lib/validations/deal";
import { getDeals, createDeal } from "@/lib/services/deal";

export async function GET() {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const deals = await getDeals();
        return NextResponse.json(deals);
    } catch (error) {
        console.error("GET /api/crm/deals error:", error);
        return NextResponse.json(
            { error: "Failed to fetch deals" },
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
        const parsed = dealSchema
            .omit({ ownerId: true })
            .safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation failed", issues: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const deal = await createDeal({
            ...parsed.data,
            ownerId: session.user.id as string,
        });
        return NextResponse.json(deal, { status: 201 });
    } catch (error) {
        console.error("POST /api/crm/deals error:", error);
        return NextResponse.json(
            { error: "Failed to create deal" },
            { status: 500 }
        );
    }
}