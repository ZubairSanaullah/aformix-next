import { NextRequest, NextResponse } from "next/server";

import {
    requireAdmin,
    isAuthorizationError,
} from "@/lib/auth/authorization";

import {
    deletePortfolioProject,
    getPortfolioProjectById,
    updatePortfolioProject,
    PortfolioProjectServiceError,
} from "@/lib/services/portfolio-projects";

import {
    portfolioProjectIdSchema,
    updatePortfolioProjectSchema,
} from "@/lib/validations/portfolio";

interface RouteContext {
    params: Promise<{ id: string }>;
}

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

    console.error("[PORTFOLIO_PROJECT_DETAIL_API]", error);

    return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 },
    );
}

async function getValidatedId(context: RouteContext) {
    const { id } = await context.params;
    const parsed = portfolioProjectIdSchema.safeParse({ id });

    if (!parsed.success) {
        throw new PortfolioProjectServiceError("Invalid project ID.", 400);
    }

    return parsed.data.id;
}

export async function GET(_request: NextRequest, context: RouteContext) {
    try {
        await requireAdmin();
        const id = await getValidatedId(context);
        const project = await getPortfolioProjectById(id, {
            includeDeleted: true,
        });

        return NextResponse.json({ project }, { status: 200 });
    } catch (error) {
        return handleError(error);
    }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
    try {
        await requireAdmin();
        const id = await getValidatedId(context);

        let body: unknown;

        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                { error: "Invalid JSON request body." },
                { status: 400 },
            );
        }

        const parsed = updatePortfolioProjectSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Invalid project data.",
                    details: parsed.error.flatten(),
                },
                { status: 400 },
            );
        }

        const project = await updatePortfolioProject(id, parsed.data);

        return NextResponse.json({ project }, { status: 200 });
    } catch (error) {
        return handleError(error);
    }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
    try {
        await requireAdmin();
        const id = await getValidatedId(context);
        const project = await deletePortfolioProject(id);

        return NextResponse.json(
            {
                message: "Portfolio project permanently deleted.",
                project,
            },
            { status: 200 },
        );
    } catch (error) {
        return handleError(error);
    }
}