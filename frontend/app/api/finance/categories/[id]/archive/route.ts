import { NextResponse } from "next/server";

import {
    isAuthorizationError,
    requireAdmin,
} from "@/lib/auth/authorization";
import {
    archiveFinanceCategory,
    FinanceCategoryServiceError,
} from "@/lib/services/finance-categories";
import { financeCategoryIdSchema } from "@/lib/validations/finance";

interface RouteContext {
    params: Promise<{ id: string }>;
}

export async function POST(
    _request: Request,
    context: RouteContext
) {
    try {
        const user = await requireAdmin();

        const { id } = await context.params;
        const parsed = financeCategoryIdSchema.safeParse({ id });

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Invalid finance category ID." },
                { status: 400 }
            );
        }

        const category = await archiveFinanceCategory(parsed.data.id, user.id);

        return NextResponse.json(
            {
                message: "Finance category archived successfully.",
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

        if (error instanceof FinanceCategoryServiceError) {
            return NextResponse.json(
                { error: error.message },
                { status: error.status }
            );
        }

        console.error("[FINANCE_CATEGORY_ARCHIVE_API]", error);

        return NextResponse.json(
            { error: "An unexpected server error occurred." },
            { status: 500 }
        );
    }
}
