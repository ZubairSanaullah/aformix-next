import { NextResponse } from "next/server";

import {
    requireAdmin,
    isAuthorizationError,
} from "@/lib/auth/authorization";

import {
    archiveCategory,
    KnowledgeCategoryServiceError,
} from "@/lib/services/knowledge-categories";

import {
    categoryIdSchema,
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
            categoryIdSchema.safeParse({ id });

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Invalid category ID.",
                },
                { status: 400 }
            );
        }

        const category =
            await archiveCategory(parsed.data.id);

        return NextResponse.json(
            {
                message:
                    "Knowledge category archived successfully.",
                category,
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
            KnowledgeCategoryServiceError
        ) {
            return NextResponse.json(
                { error: error.message },
                { status: error.status }
            );
        }

        console.error(
            "[KNOWLEDGE_CATEGORY_ARCHIVE_API]",
            error
        );

        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 }
        );
    }
}