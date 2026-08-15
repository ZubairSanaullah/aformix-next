import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { requireAdmin, isAuthorizationError } from "@/lib/auth/authorization";
import { getFinanceReport } from "@/lib/services/finance-reports";
import { financeReportQuerySchema } from "@/lib/validations/finance";

export async function GET(request: NextRequest) {
    try {
        await requireAdmin();

        const searchParams = Object.fromEntries(request.nextUrl.searchParams.entries());
        const parsed = financeReportQuerySchema.safeParse(searchParams);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Invalid finance report query parameters.",
                    details: parsed.error.flatten(),
                },
                { status: 400 }
            );
        }

        const report = await getFinanceReport(parsed.data);

        return NextResponse.json({ report }, { status: 200 });
    } catch (error) {
        if (isAuthorizationError(error)) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return NextResponse.json({ error: "Unable to generate finance report." }, { status: 400 });
        }

        console.error("[FINANCE_REPORT_API]", error);

        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
