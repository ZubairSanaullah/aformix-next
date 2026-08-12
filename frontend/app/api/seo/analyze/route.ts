import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { analyzeSEOInputData } from "@/lib/services/seo/analysis-service";
import { seoAnalysisSchema } from "@/lib/validations/seo";

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

        const result =
            seoAnalysisSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    error:
                        result.error.issues[0]?.message ??
                        "Invalid SEO analysis input.",
                },
                { status: 400 }
            );
        }

        const analysis =
            analyzeSEOInputData(result.data);

        return NextResponse.json({
            data: analysis,
        });
    } catch (error) {
        console.error(
            "POST /api/seo/analyze error:",
            error
        );

        return NextResponse.json(
            {
                error:
                    "Failed to analyze SEO data.",
            },
            { status: 500 }
        );
    }
}