import { NextResponse } from "next/server";

import {
    requireAdmin,
    isAuthorizationError,
} from "@/lib/auth/authorization";

import {
    getKnowledgeBaseStats,
    KnowledgeStatsServiceError,
} from "@/lib/services/knowledge-stats";

export async function GET() {
    try {
        await requireAdmin();

        const stats =
            await getKnowledgeBaseStats();

        return NextResponse.json(
            {
                stats,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        if (isAuthorizationError(error)) {
            return NextResponse.json(
                {
                    error: error.message,
                },
                {
                    status: error.status,
                }
            );
        }

        if (
            error instanceof
            KnowledgeStatsServiceError
        ) {
            return NextResponse.json(
                {
                    error: error.message,
                },
                {
                    status: error.status,
                }
            );
        }

        console.error(
            "[KNOWLEDGE_STATS_API]",
            error
        );

        return NextResponse.json(
            {
                error: "Internal server error.",
            },
            {
                status: 500,
            }
        );
    }
}