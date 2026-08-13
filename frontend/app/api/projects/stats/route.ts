import { NextRequest, NextResponse } from "next/server";

import {
    requireAdmin,
    isAuthorizationError,
} from "@/lib/auth/authorization";
import { getProjectStats } from "@/lib/services/projects";

export async function GET(_request: NextRequest) {
    try {
        await requireAdmin();

        const stats = await getProjectStats();

        return NextResponse.json(
            {
                stats,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
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

        console.error("Project statistics API error:", error);

        return NextResponse.json(
            {
                error: "An unexpected error occurred.",
            },
            {
                status: 500,
            }
        );
    }
}