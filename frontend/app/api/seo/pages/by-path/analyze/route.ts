import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { analyzeSEOPageByPath } from "@/lib/services/seo/analysis-service";

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized." },
                { status: 401 }
            );
        }

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

        if (
            typeof body !== "object" ||
            body === null ||
            !("path" in body)
        ) {
            return NextResponse.json(
                {
                    error: "Page path is required.",
                },
                { status: 400 }
            );
        }

        const path = (body as {
            path?: unknown;
        }).path;

        if (
            typeof path !== "string" ||
            !path.trim()
        ) {
            return NextResponse.json(
                {
                    error: "Page path is required.",
                },
                { status: 400 }
            );
        }

        const normalizedPath = path.trim();

        if (!normalizedPath.startsWith("/")) {
            return NextResponse.json(
                {
                    error:
                        "Page path must start with /.",
                },
                { status: 400 }
            );
        }

        const analysis =
            await analyzeSEOPageByPath(
                normalizedPath
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
            "POST /api/seo/pages/by-path/analyze error:",
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