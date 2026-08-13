import { NextRequest, NextResponse } from "next/server";

import {
    requireAdmin,
    isAuthorizationError,
} from "@/lib/auth/authorization";

import {
    createPortfolioCategory,
    getPortfolioCategories,
    PortfolioCategoryServiceError,
} from "@/lib/services/portfolio-categories";

import {
    createPortfolioCategorySchema,
    portfolioCategoryListQuerySchema,
} from "@/lib/validations/portfolio";

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

    console.error("[PORTFOLIO_CATEGORY_API]", error);

    return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 },
    );
}

export async function GET(request: NextRequest) {
    try {
        await requireAdmin();

        const searchParams = Object.fromEntries(request.nextUrl.searchParams.entries());

        const parsed = portfolioCategoryListQuerySchema.safeParse(searchParams);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Invalid category query parameters.",
                    details: parsed.error.flatten(),
                },
                { status: 400 },
            );
        }

        const result = await getPortfolioCategories(parsed.data);

        return NextResponse.json(
            {
                categories: result.categories,
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
        await requireAdmin();

        let body: unknown;

        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                { error: "Invalid JSON request body." },
                { status: 400 },
            );
        }

        const parsed = createPortfolioCategorySchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Invalid category data.",
                    details: parsed.error.flatten(),
                },
                { status: 400 },
            );
        }

        const category = await createPortfolioCategory(parsed.data);

        return NextResponse.json(
            {
                category,
            },
            { status: 201 },
        );
    } catch (error) {
        return handleError(error);
    }
}
