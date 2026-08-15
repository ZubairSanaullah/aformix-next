import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import {
    isAuthorizationError,
    requireAdmin,
} from "@/lib/auth/authorization";
import {
    createFinanceCategory,
    FinanceCategoryServiceError,
    getFinanceCategories,
} from "@/lib/services/finance-categories";
import {
    createFinanceCategorySchema,
    financeCategoryListQuerySchema,
} from "@/lib/validations/finance";

function handleRouteError(error: unknown) {
    if (isAuthorizationError(error)) {
        return NextResponse.json(
            { error: error.message },
            { status: error.status }
        );
    }

    if (error instanceof FinanceCategoryServiceError) {
        return NextResponse.json(
            { error: error.message },
            { status: error.status }
        );
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
            return NextResponse.json(
                { error: "A finance category with this slug already exists." },
                { status: 409 }
            );
        }

        if (error.code === "P2003") {
            return NextResponse.json(
                { error: "A referenced record could not be found." },
                { status: 400 }
            );
        }
    }

    console.error("[FINANCE_CATEGORY_API]", error);

    return NextResponse.json(
        { error: "An unexpected server error occurred." },
        { status: 500 }
    );
}

export async function GET(request: NextRequest) {
    try {
        await requireAdmin();

        const searchParams = Object.fromEntries(
            request.nextUrl.searchParams.entries()
        );

        const parsed = financeCategoryListQuerySchema.safeParse(searchParams);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Invalid finance category query parameters.",
                    details: parsed.error.flatten(),
                },
                { status: 400 }
            );
        }

        const result = await getFinanceCategories(parsed.data);

        return NextResponse.json(
            {
                categories: result.categories,
                pagination: result.pagination,
            },
            { status: 200 }
        );
    } catch (error) {
        return handleRouteError(error);
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await requireAdmin();

        let body: unknown;

        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                { error: "Invalid JSON request body." },
                { status: 400 }
            );
        }

        const parsed = createFinanceCategorySchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Invalid finance category data.",
                    details: parsed.error.flatten(),
                },
                { status: 400 }
            );
        }

        const category = await createFinanceCategory(parsed.data, user.id);

        return NextResponse.json(
            { category },
            { status: 201 }
        );
    } catch (error) {
        return handleRouteError(error);
    }
}
