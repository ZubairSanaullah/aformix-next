import { NextRequest, NextResponse } from "next/server";

import {
    requireAdmin,
    isAuthorizationError,
} from "@/lib/auth/authorization";

import {
    getArticles,
    createArticle,
    KnowledgeArticleServiceError,
} from "@/lib/services/knowledge-articles";

import {
    articleListQuerySchema,
    createArticleSchema,
} from "@/lib/validations/knowledge-base";

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
        "[KNOWLEDGE_ARTICLES_API]",
        error
    );

    return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 }
    );
}

/**
 * GET /api/knowledge/articles
 */
export async function GET(request: NextRequest) {
    try {
        await requireAdmin();

        const searchParams = Object.fromEntries(
            request.nextUrl.searchParams.entries()
        );

        const parsed =
            articleListQuerySchema.safeParse(
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

        const result = await getArticles(parsed.data);

        return NextResponse.json(
            {
                articles: result.articles,
                pagination: result.pagination,
            },
            { status: 200 }
        );
    } catch (error) {
        return handleError(error);
    }
}

/**
 * POST /api/knowledge/articles
 */
export async function POST(request: NextRequest) {
    try {
        const admin = await requireAdmin();

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
            createArticleSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Invalid article data.",
                    details: parsed.error.flatten(),
                },
                { status: 400 }
            );
        }

        const article = await createArticle(
            parsed.data,
            admin.id
        );

        return NextResponse.json(
            {
                article,
            },
            { status: 201 }
        );
    } catch (error) {
        return handleError(error);
    }
}