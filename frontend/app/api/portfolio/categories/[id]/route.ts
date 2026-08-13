import { NextRequest, NextResponse } from "next/server";

import {
    requireAdmin,
    isAuthorizationError,
} from "@/lib/auth/authorization";

import {
    deletePortfolioCategory,
    getPortfolioCategoryById,
    updatePortfolioCategory,
    PortfolioCategoryServiceError,
} from "@/lib/services/portfolio-categories";

import {
    portfolioCategoryIdSchema,
    updatePortfolioCategorySchema,
} from "@/lib/validations/portfolio";

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

function handleError(error: unknown) {
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

    console.error("[PORTFOLIO_CATEGORY_DETAIL_API]", error);

    return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 },
    );
}

async function getValidatedId(context: RouteContext) {
    const { id } = await context.params;
    const parsed = portfolioCategoryIdSchema.safeParse({ id });

    if (!parsed.success) {
        throw new PortfolioCategoryServiceError("Invalid category ID.", 400);
    }

    return parsed.data.id;
}

export async function GET(_request: NextRequest, context: RouteContext) {
    try {
        await requireAdmin();
        const id = await getValidatedId(context);
        const category = await getPortfolioCategoryById(id);

        return NextResponse.json({ category }, { status: 200 });
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

        const parsed = updatePortfolioCategorySchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Invalid category data.",
                    details: parsed.error.flatten(),
                },
                { status: 400 },
            );
        }

        const category = await updatePortfolioCategory(id, parsed.data);

        return NextResponse.json({ category }, { status: 200 });
    } catch (error) {
        return handleError(error);
    }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
    try {
        await requireAdmin();
        const id = await getValidatedId(context);
        const category = await deletePortfolioCategory(id);

        return NextResponse.json(
            {
                message: "Portfolio category permanently deleted.",
                category,
            },
            { status: 200 },
        );
    } catch (error) {
        return handleError(error);
    }
}
