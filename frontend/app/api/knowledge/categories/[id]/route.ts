import { NextRequest, NextResponse } from "next/server";

import {
    requireAdmin,
    isAuthorizationError,
} from "@/lib/auth/authorization";

import {
    getCategoryById,
    updateCategory,
    archiveCategory,
    restoreCategory,
    deleteCategory,
    getCategoryArticleCount,
    KnowledgeCategoryServiceError,
} from "@/lib/services/knowledge-categories";

import {
    categoryIdSchema,
    updateCategorySchema,
} from "@/lib/validations/knowledge-base";

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

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
        "[KNOWLEDGE_CATEGORY_API]",
        error
    );

    return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 }
    );
}

async function getValidatedId(
    context: RouteContext
) {
    const { id } = await context.params;

    const parsed = categoryIdSchema.safeParse({
        id,
    });

    if (!parsed.success) {
        throw new KnowledgeCategoryServiceError(
            "Invalid category ID.",
            400
        );
    }

    return parsed.data.id;
}

/**
 * GET /api/knowledge/categories/[id]
 *
 * Admin-only category details.
 */
export async function GET(
    _request: NextRequest,
    context: RouteContext
) {
    try {
        await requireAdmin();

        const id = await getValidatedId(context);

        const category = await getCategoryById(id, {
            includeArticleCount: true,
        });

        return NextResponse.json(
            {
                category,
            },
            { status: 200 }
        );
    } catch (error) {
        return handleError(error);
    }
}

/**
 * PATCH /api/knowledge/categories/[id]
 *
 * Admin-only category update.
 */
export async function PATCH(
    request: NextRequest,
    context: RouteContext
) {
    try {
        await requireAdmin();

        const id = await getValidatedId(context);

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
            updateCategorySchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Invalid category data.",
                    details: parsed.error.flatten(),
                },
                { status: 400 }
            );
        }

        const category = await updateCategory(
            id,
            parsed.data
        );

        return NextResponse.json(
            {
                category,
            },
            { status: 200 }
        );
    } catch (error) {
        return handleError(error);
    }
}

/**
 * DELETE /api/knowledge/categories/[id]
 *
 * Admin-only permanent deletion.
 *
 * Categories containing articles cannot be
 * permanently deleted by the service layer.
 */
export async function DELETE(
    _request: NextRequest,
    context: RouteContext
) {
    try {
        await requireAdmin();

        const id = await getValidatedId(context);

        const category =
            await deleteCategory(id);

        return NextResponse.json(
            {
                message:
                    "Knowledge category permanently deleted.",
                category,
            },
            { status: 200 }
        );
    } catch (error) {
        return handleError(error);
    }
}

/**
 * POST /api/knowledge/categories/[id]/archive
 *
 * This route is intentionally not exported from
 * this file because Next.js route handlers only
 * support HTTP methods.
 *
 * Archive/restore are exposed through dedicated
 * nested route files.
 */
export async function HEAD() {
    return new NextResponse(null, {
        status: 405,
        headers: {
            Allow: "GET, PATCH, DELETE",
        },
    });
}