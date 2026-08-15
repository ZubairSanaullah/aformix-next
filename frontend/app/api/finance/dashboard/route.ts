import { NextResponse } from "next/server";

import { requireAdmin, isAuthorizationError } from "@/lib/auth/authorization";
import { getFinanceDashboardStats } from "@/lib/services/finance-dashboard";

export async function GET() {
    try {
        await requireAdmin();

        const stats = await getFinanceDashboardStats();

        return NextResponse.json({ stats }, { status: 200 });
    } catch (error) {
        if (isAuthorizationError(error)) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }

        console.error("[FINANCE_DASHBOARD_API]", error);

        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
