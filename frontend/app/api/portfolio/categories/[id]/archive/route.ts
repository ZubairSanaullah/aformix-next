import { NextRequest, NextResponse } from "next/server";

import {
    requireAdmin,
    isAuthorizationError,
} from "@/lib/auth/authorization";

import {
    archivePortfolioCategory,
    PortfolioCategoryServiceError,
} from "@/lib/services/portfolio-categories";

import { portfolioCategoryIdSchema } from "@/lib/validations/portfolio";

interface RouteContext {
    params: Promise<{ id: string }>;
}

export async function POST(_request: NextRequest, context: RouteContext) {
    try {
        await requireAdmin();

        const { id } = await context.params;
        const parsed = portfolioCategoryIdSchema.safeParse({ id });

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Invalid category ID." },
                { status: 400 },
            );
        }

        const category = await archivePortfolioCategory(parsed.data.id);

        return NextResponse.json(
            {
                message: "Portfolio category archived successfully.",
                category,
            },
            { status: 200 },
        );
    } catch (error) {
        if (isAuthorizationError(error)) {
            return NextResponse.json(
                { error: error.message },
                { status: error.status },
            );
        }

        if (error instanceof PortfolioCategoryServiceError) {
            return NextResponse.json(
                { error: error.message },
                { status: error.status },
            );
        }

        console.error("[PORTFOLIO_CATEGORY_ARCHIVE_API]", error);

        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 },
        );
    }
}
