import { NextRequest, NextResponse } from "next/server";

import {
    requireAdmin,
    isAuthorizationError,
} from "@/lib/auth/authorization";

import {
    replacePortfolioProjectMedia,
    PortfolioProjectServiceError,
} from "@/lib/services/portfolio-projects";

import {
    portfolioProjectIdSchema,
    replacePortfolioProjectMediaSchema,
} from "@/lib/validations/portfolio";

interface RouteContext {
    params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, context: RouteContext) {
    try {
        await requireAdmin();

        const { id } = await context.params;
        const parsedId = portfolioProjectIdSchema.safeParse({ id });

        if (!parsedId.success) {
            return NextResponse.json(
                { error: "Invalid project ID." },
                { status: 400 },
            );
        }

        let body: unknown;

        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                { error: "Invalid JSON request body." },
                { status: 400 },
            );
        }

        const parsed = replacePortfolioProjectMediaSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Invalid media data.",
                    details: parsed.error.flatten(),
                },
                { status: 400 },
            );
        }

        const media = await replacePortfolioProjectMedia(
            parsedId.data.id,
            parsed.data.items,
        );

        return NextResponse.json({ media }, { status: 200 });
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

        console.error("[PORTFOLIO_PROJECT_MEDIA_API]", error);

        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 },
        );
    }
}
