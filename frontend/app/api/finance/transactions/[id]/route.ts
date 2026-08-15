import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import {
    isAuthorizationError,
    requireAdmin,
} from "@/lib/auth/authorization";
import {
    deleteFinanceTransaction,
    FinanceTransactionServiceError,
    getFinanceTransactionById,
    updateFinanceTransaction,
} from "@/lib/services/finance-transactions";
import {
    financeTransactionIdSchema,
    updateFinanceTransactionSchema,
} from "@/lib/validations/finance";

interface RouteContext {
    params: Promise<{ id: string }>;
}

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

    console.error("[FINANCE_TRANSACTION_DETAIL_API]", error);

    return NextResponse.json(
        { error: "An unexpected server error occurred." },
        { status: 500 }
    );
}

async function getValidatedId(context: RouteContext) {
    const { id } = await context.params;
    const parsed = financeTransactionIdSchema.safeParse({ id });

    if (!parsed.success) {
        throw new FinanceTransactionServiceError("Invalid finance transaction ID.", 400);
    }

    return parsed.data.id;
}

export async function GET(
    _request: NextRequest,
    context: RouteContext
) {
    try {
        await requireAdmin();
        const id = await getValidatedId(context);
        const transaction = await getFinanceTransactionById(id);

        return NextResponse.json({ transaction }, { status: 200 });
    } catch (error) {
        return handleRouteError(error);
    }
}

export async function PATCH(
    request: NextRequest,
    context: RouteContext
) {
    try {
        const user = await requireAdmin();
        const id = await getValidatedId(context);

        let body: unknown;

        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                { error: "Invalid JSON request body." },
                { status: 400 }
            );
        }

        const parsed = updateFinanceTransactionSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Invalid finance transaction data.",
                    details: parsed.error.flatten(),
                },
                { status: 400 }
            );
        }

        const transaction = await updateFinanceTransaction(
            id,
            parsed.data,
            user.id
        );

        return NextResponse.json({ transaction }, { status: 200 });
    } catch (error) {
        return handleRouteError(error);
    }
}

export async function DELETE(
    _request: NextRequest,
    context: RouteContext
) {
    try {
        const user = await requireAdmin();
        const id = await getValidatedId(context);
        const transaction = await deleteFinanceTransaction(id, user.id);

        return NextResponse.json(
            {
                message: "Finance transaction permanently deleted.",
                transaction,
            },
            { status: 200 }
        );
    } catch (error) {
        return handleRouteError(error);
    }
}

export async function HEAD() {
    return new NextResponse(null, {
        status: 405,
        headers: {
            Allow: "GET, PATCH, DELETE",
        },
    });
}
