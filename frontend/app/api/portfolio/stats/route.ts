import { NextResponse } from "next/server";

import {
    requireAdmin,
    isAuthorizationError,
} from "@/lib/auth/authorization";

import { getPortfolioStats } from "@/lib/services/portfolio-stats";

export async function GET() {
    try {
        await requireAdmin();

        const stats = await getPortfolioStats();

        return NextResponse.json(
            { stats },
            { status: 200 },
        );
    } catch (error) {
        if (isAuthorizationError(error)) {
            return NextResponse.json(
                { error: error.message },
                { status: error.status },
            );
        }

        console.error("[PORTFOLIO_STATS_API]", error);

        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 },
        );
    }
}
