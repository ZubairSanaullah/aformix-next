import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import {
    isAuthorizationError,
    requireAdmin,
} from "@/lib/auth/authorization";
import {
    createFinanceTransaction,
    FinanceTransactionServiceError,
    getFinanceTransactions,
} from "@/lib/services/finance-transactions";
import {
    createFinanceTransactionSchema,
    financeTransactionListQuerySchema,
} from "@/lib/validations/finance";

function handleRouteError(error: unknown) {
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

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
            return NextResponse.json(
                { error: "This finance transaction conflicts with an existing record." },
                { status: 409 }
            );
        }

        if (error.code === "P2003") {
            return NextResponse.json(
                { error: "One of the referenced records could not be found." },
                { status: 400 }
            );
        }
    }

    console.error("[FINANCE_TRANSACTION_API]", error);

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

        const parsed = financeTransactionListQuerySchema.safeParse(searchParams);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Invalid finance transaction query parameters.",
                    details: parsed.error.flatten(),
                },
                { status: 400 }
            );
        }

        const result = await getFinanceTransactions(parsed.data);

        return NextResponse.json(
            {
                transactions: result.transactions,
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

        const parsed = createFinanceTransactionSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Invalid finance transaction data.",
                    details: parsed.error.flatten(),
                },
                { status: 400 }
            );
        }

        const transaction = await createFinanceTransaction(
            parsed.data,
            user.id
        );

        return NextResponse.json(
            { transaction },
            { status: 201 }
        );
    } catch (error) {
        return handleRouteError(error);
    }
}
