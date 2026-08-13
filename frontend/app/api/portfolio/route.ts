import { NextRequest, NextResponse } from "next/server";

import { getPublicPortfolioProjects } from "@/lib/services/portfolio-projects";
import { portfolioProjectListQuerySchema } from "@/lib/validations/portfolio";

const publicPortfolioListQuerySchema = portfolioProjectListQuerySchema.omit({
    status: true,
    visibility: true,
    includeDeleted: true,
});

export async function GET(request: NextRequest) {
    try {
        const searchParams = Object.fromEntries(
            request.nextUrl.searchParams.entries(),
        );

        const parsed = publicPortfolioListQuerySchema.safeParse(searchParams);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Invalid query parameters.",
                    details: parsed.error.flatten(),
                },
                { status: 400 },
            );
        }

        const result = await getPublicPortfolioProjects(parsed.data);

        return NextResponse.json(
            {
                items: result.items,
                pagination: result.pagination,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("[PORTFOLIO_PUBLIC_LIST_API]", error);

        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 },
        );
    }
}