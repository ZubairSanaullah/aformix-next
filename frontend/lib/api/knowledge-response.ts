import { NextResponse } from "next/server";

import { isAuthorizationError } from "@/lib/auth/authorization";

export function knowledgeErrorResponse(
    error: unknown,
    context: string
) {
    if (isAuthorizationError(error)) {
        return NextResponse.json(
            {
                error: error.message,
            },
            {
                status: error.status,
            }
        );
    }

    if (
        error instanceof Error &&
        "status" in error &&
        typeof error.status === "number" &&
        [400, 404, 409, 500].includes(error.status)
    ) {
        return NextResponse.json(
            {
                error: error.message,
            },
            {
                status: error.status,
            }
        );
    }

    console.error(`[${context}]`, error);

    return NextResponse.json(
        {
            error: "Internal server error.",
        },
        {
            status: 500,
        }
    );
}