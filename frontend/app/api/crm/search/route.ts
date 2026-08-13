import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { searchCRM } from "@/lib/services/search";

export async function GET(req: NextRequest) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);

        const query = searchParams.get("q") || "";
        const limitParam = searchParams.get("limit");
        const limitPerType = limitParam ? Number(limitParam) : undefined;

        const results = await searchCRM(query, { limitPerType });

        return NextResponse.json(results);
    } catch (error) {
        console.error("GET /api/crm/search error:", error);
        return NextResponse.json(
            { error: "Failed to search CRM" },
            { status: 500 }
        );
    }
}