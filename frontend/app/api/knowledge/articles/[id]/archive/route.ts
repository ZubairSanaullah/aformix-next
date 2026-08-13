import { NextResponse } from "next/server";

import {
    requireAdmin,
    isAuthorizationError,
} from "@/lib/auth/authorization";

import {
    archiveArticle,
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

export async function POST(
    _request: Request,
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
            await archiveArticle(
                parsed.data.id
            );

        return NextResponse.json(
            {
                message:
                    "Knowledge article archived successfully.",
                article,
            },
            { status: 200 }
        );
    } catch (error) {
        if (isAuthorizationError(error)) {
            return NextResponse.json(
                { error: error.message },
                { status: error.status }
            );
        }

        if (
            error instanceof
            KnowledgeArticleServiceError
        ) {
            return NextResponse.json(
                { error: error.message },
                { status: error.status }
            );
        }

        console.error(
            "[KNOWLEDGE_ARTICLE_ARCHIVE_API]",
            error
        );

        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 }
        );
    }
}