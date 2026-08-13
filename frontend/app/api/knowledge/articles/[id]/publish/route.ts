import { NextRequest, NextResponse } from "next/server";

import {
    requireAdmin,
    isAuthorizationError,
} from "@/lib/auth/authorization";

import {
    publishArticle,
    unpublishArticle,
    KnowledgeArticleServiceError,
} from "@/lib/services/knowledge-articles";

import {
    articleIdSchema,
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
        "[KNOWLEDGE_ARTICLE_PUBLISH_API]",
        error
    );

    return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 }
    );
}

/**
 * POST /api/knowledge/articles/[id]/publish
 *
 * Publishes an article.
 *
 * Optional body:
 * {
 *   "publishedAt": "2026-08-13T12:00:00.000Z"
 * }
 */
export async function POST(
    request: NextRequest,
    context: RouteContext
) {
    try {
        await requireAdmin();

        const { id } = await context.params;

        const parsed =
            articleIdSchema.safeParse({ id });

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Invalid article ID.",
                },
                { status: 400 }
            );
        }

        let publishedAt: Date | undefined;

        const contentType =
            request.headers.get("content-type");

        if (
            contentType?.includes(
                "application/json"
            )
        ) {
            let body: unknown;

            try {
                body = await request.json();
            } catch {
                return NextResponse.json(
                    {
                        error:
                            "Invalid JSON request body.",
                    },
                    { status: 400 }
                );
            }

            if (
                typeof body === "object" &&
                body !== null &&
                "publishedAt" in body
            ) {
                const value = (
                    body as {
                        publishedAt?: unknown;
                    }
                ).publishedAt;

                if (
                    typeof value !== "string" ||
                    Number.isNaN(
                        Date.parse(value)
                    )
                ) {
                    return NextResponse.json(
                        {
                            error:
                                "publishedAt must be a valid date.",
                        },
                        { status: 400 }
                    );
                }

                publishedAt = new Date(value);
            }
        }

        const article =
            await publishArticle(
                parsed.data.id,
                publishedAt
            );

        return NextResponse.json(
            {
                message:
                    "Knowledge article published successfully.",
                article,
            },
            { status: 200 }
        );
    } catch (error) {
        return handleError(error);
    }
}

/**
 * DELETE /api/knowledge/articles/[id]/publish
 *
 * Unpublishes an article and returns it to DRAFT.
 */
export async function DELETE(
    _request: NextRequest,
    context: RouteContext
) {
    try {
        await requireAdmin();

        const { id } = await context.params;

        const parsed =
            articleIdSchema.safeParse({ id });

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Invalid article ID.",
                },
                { status: 400 }
            );
        }

        const article =
            await unpublishArticle(
                parsed.data.id
            );

        return NextResponse.json(
            {
                message:
                    "Knowledge article unpublished successfully.",
                article,
            },
            { status: 200 }
        );
    } catch (error) {
        return handleError(error);
    }
}