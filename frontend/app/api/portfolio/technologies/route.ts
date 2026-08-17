import { NextRequest, NextResponse } from "next/server";

import {
    requireAdmin,
    isAuthorizationError,
} from "@/lib/auth/authorization";

import {
    createPortfolioTechnology,
    getPortfolioTechnologies,
    PortfolioTechnologyServiceError,
} from "@/lib/services/portfolio-technologies";

import { createPortfolioTechnologySchema } from "@/lib/validations/portfolio";

function handleError(error: unknown) {
    if (isAuthorizationError(error)) {
        return NextResponse.json(
            { error: error.message },
            { status: error.status },
        );
    }

    if (error instanceof PortfolioTechnologyServiceError) {
        return NextResponse.json(
            { error: error.message },
            { status: error.status },
        );
    }

    console.error("[PORTFOLIO_TECHNOLOGY_API]", error);

    return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 },
    );
}

export async function GET(request: NextRequest) {
    try {
        await requireAdmin();

        const search = request.nextUrl.searchParams.get("search") ?? undefined;
        const technologies = await getPortfolioTechnologies(search);

        return NextResponse.json({ technologies }, { status: 200 });
    } catch (error) {
        return handleError(error);
    }
}

export async function POST(request: NextRequest) {
    try {
        await requireAdmin();

        let body: unknown;

        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                { error: "Invalid JSON request body." },
                { status: 400 },
            );
        }

        const parsed = createPortfolioTechnologySchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Invalid technology data.",
                    details: parsed.error.flatten(),
                },
                { status: 400 },
            );
        }

        const technology = await createPortfolioTechnology(parsed.data);

        return NextResponse.json({ technology }, { status: 201 });
    } catch (error) {
        return handleError(error);
    }
}
