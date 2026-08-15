import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import {
    isAuthorizationError,
    requireAdmin,
} from "@/lib/auth/authorization";
import {
    deleteFinanceCategory,
    FinanceCategoryServiceError,
    getFinanceCategoryById,
    updateFinanceCategory,
} from "@/lib/services/finance-categories";
import {
    financeCategoryIdSchema,
    updateFinanceCategorySchema,
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

    console.error("[FINANCE_CATEGORY_DETAIL_API]", error);

    return NextResponse.json(
        { error: "An unexpected server error occurred." },
        { status: 500 }
    );
}

async function getValidatedId(context: RouteContext) {
    const { id } = await context.params;
    const parsed = financeCategoryIdSchema.safeParse({ id });

    if (!parsed.success) {
        throw new FinanceCategoryServiceError("Invalid finance category ID.", 400);
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
        const category = await getFinanceCategoryById(id);

        return NextResponse.json({ category }, { status: 200 });
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

        const parsed = updateFinanceCategorySchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Invalid finance category data.",
                    details: parsed.error.flatten(),
                },
                { status: 400 }
            );
        }

        const category = await updateFinanceCategory(id, parsed.data, user.id);

        return NextResponse.json({ category }, { status: 200 });
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
        const category = await deleteFinanceCategory(id, user.id);

        return NextResponse.json(
            {
                message: "Finance category permanently deleted.",
                category,
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
