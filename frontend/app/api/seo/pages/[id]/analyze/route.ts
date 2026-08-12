import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { analyzeSEOPageById } from "@/lib/services/seo/analysis-service";

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
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized." },
                { status: 401 }
            );
        }

        const { id } = await context.params;
        const normalizedId = id?.trim();

        if (!normalizedId) {
            return NextResponse.json(
                {
                    error:
                        "SEO page ID is required.",
                },
                { status: 400 }
            );
        }

        const analysis =
            await analyzeSEOPageById(
                normalizedId
            );

        if (!analysis) {
            return NextResponse.json(
                {
                    error:
                        "SEO page configuration not found.",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            data: analysis,
        });
    } catch (error) {
        console.error(
            "POST /api/seo/pages/[id]/analyze error:",
            error
        );

        return NextResponse.json(
            {
                error:
                    "Failed to analyze SEO page.",
            },
            { status: 500 }
        );
    }
}