import { NextRequest, NextResponse } from "next/server";

import {
    requireAdmin,
    isAuthorizationError,
} from "@/lib/auth/authorization";

import {
    getCategories,
    createCategory,
    KnowledgeCategoryServiceError,
} from "@/lib/services/knowledge-categories";

import {
    categoryListQuerySchema,
    createCategorySchema,
} from "@/lib/validations/knowledge-base";

function handleError(error: unknown) {
    if (isAuthorizationError(error)) {
        return NextResponse.json(
            { error: error.message },
            { status: error.status }
        );
    }

    if (error instanceof KnowledgeCategoryServiceError) {
        return NextResponse.json(
            { error: error.message },
            { status: error.status }
        );
    }

    console.error(
        "[KNOWLEDGE_CATEGORIES_API]",
        error
    );

    return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 }
    );
}

/**
 * GET /api/knowledge/categories
 *
 * Admin-only category listing.
 */
export async function GET(request: NextRequest) {
    try {
        await requireAdmin();

        const searchParams = Object.fromEntries(
            request.nextUrl.searchParams.entries()
        );

        const parsed =
            categoryListQuerySchema.safeParse(
                searchParams
            );

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Invalid query parameters.",
                    details: parsed.error.flatten(),
                },
                { status: 400 }
            );
        }

        const result = await getCategories(
            parsed.data
        );

        return NextResponse.json(
            {
                categories: result.categories,
                pagination: result.pagination,
            },
            { status: 200 }
        );
    } catch (error) {
        return handleError(error);
    }
}

/**
 * POST /api/knowledge/categories
 *
 * Admin-only category creation.
 */
export async function POST(request: NextRequest) {
    try {
        await requireAdmin();

        let body: unknown;

        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                {
                    error: "Invalid JSON request body.",
                },
                { status: 400 }
            );
        }

        const parsed =
            createCategorySchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Invalid category data.",
                    details: parsed.error.flatten(),
                },
                { status: 400 }
            );
        }

        const category =
            await createCategory(parsed.data);

        return NextResponse.json(
            {
                category,
            },
            { status: 201 }
        );
    } catch (error) {
        return handleError(error);
    }
}