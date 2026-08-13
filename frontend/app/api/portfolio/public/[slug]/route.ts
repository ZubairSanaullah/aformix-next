import { NextRequest, NextResponse } from "next/server";

import { getPublicPortfolioProjectBySlug } from "@/lib/services/portfolio-projects";

interface RouteContext {
    params: Promise<{ slug: string }>;
}

export async function GET(_request: NextRequest, context: RouteContext) {
    try {
        const { slug } = await context.params;
        const project = await getPublicPortfolioProjectBySlug(slug);

        return NextResponse.json({ project }, { status: 200 });
    } catch (error) {
        console.error("[PORTFOLIO_PUBLIC_DETAIL_API]", error);

        if (error instanceof Error && error.message === "Portfolio project not found.") {
            return NextResponse.json(
                { error: "Portfolio project not found." },
                { status: 404 },
            );
        }

        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 },
        );
    }
}
