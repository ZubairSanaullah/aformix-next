import { NextRequest, NextResponse } from "next/server";

import {
    requireAdmin,
    isAuthorizationError,
} from "@/lib/auth/authorization";

import {
    getArticleById,
    updateArticle,
    deleteArticle,
    KnowledgeArticleServiceError,
} from "@/lib/services/knowledge-articles";

import {
    articleIdSchema,
    updateArticleSchema,
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

    if (error instanceof KnowledgeArticleServiceError) {
        return NextResponse.json(
            { error: error.message },
            { status: error.status }
        );
    }

    console.error(
        "[KNOWLEDGE_ARTICLE_API]",
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

    const parsed =
        articleIdSchema.safeParse({ id });

    if (!parsed.success) {
        throw new KnowledgeArticleServiceError(
            "Invalid article ID.",
            400
        );
    }

    return parsed.data.id;
}

/**
 * GET /api/knowledge/articles/[id]
 */
export async function GET(
    _request: NextRequest,
    context: RouteContext
) {
    try {
        await requireAdmin();

        const id = await getValidatedId(context);

        const article =
            await getArticleById(id);

        return NextResponse.json(
            { article },
            { status: 200 }
        );
    } catch (error) {
        return handleError(error);
    }
}

/**
 * PATCH /api/knowledge/articles/[id]
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
            updateArticleSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Invalid article data.",
                    details: parsed.error.flatten(),
                },
                { status: 400 }
            );
        }

        const article =
            await updateArticle(
                id,
                parsed.data
            );

        return NextResponse.json(
            { article },
            { status: 200 }
        );
    } catch (error) {
        return handleError(error);
    }
}

/**
 * DELETE /api/knowledge/articles/[id]
 *
 * Permanent deletion.
 *
 * Normal archival uses the dedicated /archive endpoint.
 */
export async function DELETE(
    _request: NextRequest,
    context: RouteContext
) {
    try {
        await requireAdmin();

        const id = await getValidatedId(context);

        const article =
            await deleteArticle(id);

        return NextResponse.json(
            {
                message:
                    "Knowledge article permanently deleted.",
                article,
            },
            { status: 200 }
        );
    } catch (error) {
        return handleError(error);
    }
}