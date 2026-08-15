import { NextResponse } from "next/server";

import {
    isAuthorizationError,
    requireAdmin,
} from "@/lib/auth/authorization";
import {
    archiveFinanceTransaction,
    FinanceTransactionServiceError,
} from "@/lib/services/finance-transactions";
import { financeTransactionIdSchema } from "@/lib/validations/finance";

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
        const parsed = financeTransactionIdSchema.safeParse({ id });

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Invalid finance transaction ID." },
                { status: 400 }
            );
        }

        const transaction = await archiveFinanceTransaction(parsed.data.id, user.id);

        return NextResponse.json(
            {
                message: "Finance transaction archived successfully.",
                transaction,
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

        if (error instanceof FinanceTransactionServiceError) {
            return NextResponse.json(
                { error: error.message },
                { status: error.status }
            );
        }

        console.error("[FINANCE_TRANSACTION_ARCHIVE_API]", error);

        return NextResponse.json(
            { error: "An unexpected server error occurred." },
            { status: 500 }
        );
    }
}
