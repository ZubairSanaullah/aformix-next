import { NextRequest, NextResponse } from "next/server";

import {
    requireAdmin,
    isAuthorizationError,
} from "@/lib/auth/authorization";

import {
    createPortfolioProject,
    getPortfolioProjects,
    PortfolioProjectServiceError,
} from "@/lib/services/portfolio-projects";

import {
    createPortfolioProjectSchema,
    portfolioProjectListQuerySchema,
} from "@/lib/validations/portfolio";

function handleError(error: unknown) {
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

    console.error("[PORTFOLIO_PROJECT_API]", error);

    return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 },
    );
}

export async function GET(request: NextRequest) {
    try {
        await requireAdmin();

        const searchParams = Object.fromEntries(request.nextUrl.searchParams.entries());
        const parsed = portfolioProjectListQuerySchema.safeParse(searchParams);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Invalid project query parameters.",
                    details: parsed.error.flatten(),
                },
                { status: 400 },
            );
        }

        const result = await getPortfolioProjects(parsed.data);

        return NextResponse.json(
            {
                items: result.items,
                pagination: result.pagination,
            },
            { status: 200 },
        );
    } catch (error) {
        return handleError(error);
    }
}

export async function POST(request: NextRequest) {
    try {
        const admin = await requireAdmin();

        let body: unknown;

        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                { error: "Invalid JSON request body." },
                { status: 400 },
            );
        }

        // authorId is never trusted from the client — always the
        // authenticated admin, regardless of what the request body
        // contains. Without this, any client could submit any user's
        // ID as the author.
        const parsed = createPortfolioProjectSchema.safeParse({
            ...(typeof body === "object" && body !== null ? body : {}),
            authorId: admin.id,
        });

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Invalid project data.",
                    details: parsed.error.flatten(),
                },
                { status: 400 },
            );
        }

        const project = await createPortfolioProject(parsed.data);

        return NextResponse.json(
            {
                project,
            },
            { status: 201 },
        );
    } catch (error) {
        return handleError(error);
    }
}
