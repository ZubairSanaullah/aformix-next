import { NextRequest, NextResponse } from "next/server";

import { requireAdmin, isAuthorizationError } from "@/lib/auth/authorization";
import { createFinanceAuditLog, getFinanceAuditLogs } from "@/lib/services/finance-audit";

export async function GET(request: NextRequest) {
    try {
        await requireAdmin();

        const searchParams = Object.fromEntries(request.nextUrl.searchParams.entries());
        const page = Number(searchParams.page ?? 1);
        const limit = Number(searchParams.limit ?? 20);

        const result = await getFinanceAuditLogs({
            page: Number.isFinite(page) ? page : 1,
            limit: Number.isFinite(limit) ? limit : 20,
            action: searchParams.action,
            resource: searchParams.resource,
            resourceId: searchParams.resourceId,
            userId: searchParams.userId,
        });

        return NextResponse.json({ auditLogs: result.logs, pagination: result.pagination }, { status: 200 });
    } catch (error) {
        if (isAuthorizationError(error)) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }

        console.error("[FINANCE_AUDIT_API]", error);

        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        await requireAdmin();

        const body = await request.json();

        if (!body?.action || !body?.resource) {
            return NextResponse.json({ error: "Action and resource are required." }, { status: 400 });
        }

        const log = await createFinanceAuditLog({
            userId: body.userId,
            action: String(body.action),
            resource: String(body.resource),
            resourceId: body.resourceId ? String(body.resourceId) : null,
            metadata: body.metadata ?? null,
        });

        return NextResponse.json({ auditLog: log }, { status: 201 });
    } catch (error) {
        if (isAuthorizationError(error)) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }

        console.error("[FINANCE_AUDIT_API]", error);

        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
