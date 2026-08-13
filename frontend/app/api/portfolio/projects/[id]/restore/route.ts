import { NextRequest, NextResponse } from "next/server";

import {
    requireAdmin,
    isAuthorizationError,
} from "@/lib/auth/authorization";

import {
    restorePortfolioProject,
    PortfolioProjectServiceError,
} from "@/lib/services/portfolio-projects";

import { portfolioProjectIdSchema } from "@/lib/validations/portfolio";

interface RouteContext {
    params: Promise<{ id: string }>;
}

export async function POST(_request: NextRequest, context: RouteContext) {
    try {
        await requireAdmin();

        const { id } = await context.params;
        const parsed = portfolioProjectIdSchema.safeParse({ id });

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Invalid project ID." },
                { status: 400 },
            );
        }

        const project = await restorePortfolioProject(parsed.data.id);

        return NextResponse.json(
            {
                message: "Portfolio project restored successfully.",
                project,
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

        if (error instanceof PortfolioProjectServiceError) {
            return NextResponse.json(
                { error: error.message },
                { status: error.status },
            );
        }

        console.error("[PORTFOLIO_PROJECT_RESTORE_API]", error);

        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 },
        );
    }
}