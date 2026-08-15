import { NextRequest, NextResponse } from "next/server";

import { requireAdmin, isAuthorizationError } from "@/lib/auth/authorization";
import { getFinanceImportById } from "@/lib/services/finance-imports";

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin();

        const { id } = await params;

        const financeImport = await getFinanceImportById(id);

        if (!financeImport) {
            return NextResponse.json(
                { error: "Finance import not found." },
                { status: 404 }
            );
        }

        return NextResponse.json({ import: financeImport }, { status: 200 });
    } catch (error) {
        if (isAuthorizationError(error)) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }

        console.error("[FINANCE_IMPORT_DETAIL_API]", error);

        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
