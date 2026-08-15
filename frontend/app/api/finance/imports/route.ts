import { NextRequest, NextResponse } from "next/server";

import { requireAdmin, isAuthorizationError } from "@/lib/auth/authorization";
import { getFinanceImports, createFinanceImport } from "@/lib/services/finance-imports";
import { financeImportQuerySchema } from "@/lib/validations/finance";

export async function GET(request: NextRequest) {
    try {
        await requireAdmin();

        const searchParams = Object.fromEntries(request.nextUrl.searchParams.entries());
        const parsed = financeImportQuerySchema.safeParse(searchParams);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Invalid finance import query parameters.",
                    details: parsed.error.flatten(),
                },
                { status: 400 }
            );
        }

        const result = await getFinanceImports(parsed.data.page, parsed.data.limit, parsed.data.status);

        return NextResponse.json(
            {
                imports: result.imports,
                pagination: result.pagination,
            },
            { status: 200 }
        );
    } catch (error) {
        if (isAuthorizationError(error)) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }

        console.error("[FINANCE_IMPORTS_API]", error);

        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const admin = await requireAdmin();

        const contentType = request.headers.get("content-type") || "";

        // Handle FormData (file upload)
        if (contentType.includes("multipart/form-data")) {
            const formData = await request.formData();
            const file = formData.get("file") as File;
            const action = formData.get("action") as string;

            if (!file) {
                return NextResponse.json(
                    { error: "No file provided" },
                    { status: 400 }
                );
            }

            // File upload with import processing
            if (action === "import") {
                const { createFinanceTransaction } = await import(
                    "@/lib/services/finance-transactions"
                );
                const { getFinanceCategories } = await import(
                    "@/lib/services/finance-categories"
                );
                const { getCRMCompaniesForFilter } = await import(
                    "@/lib/services/crm"
                );
                const { updateFinanceImportStatus } = await import(
                    "@/lib/services/finance-imports"
                );
                const XLSX = await import("xlsx");

                // Parse file
                const buffer = Buffer.from(await file.arrayBuffer());
                let rows: any[] = [];

                if (file.type === "text/csv") {
                    const text = buffer.toString("utf-8");
                    const lines = text.trim().split("\n");
                    if (lines.length >= 2) {
                        const headers = lines[0]
                            .split(",")
                            .map((h) => h.trim());
                        for (let i = 1; i < lines.length; i++) {
                            const values = lines[i].split(",").map((v) => v.trim());
                            const row: any = {};
                            headers.forEach((header, index) => {
                                row[header] = values[index] || null;
                            });
                            rows.push(row);
                        }
                    }
                } else if (
                    file.type.includes("spreadsheetml.sheet") ||
                    file.type === "application/vnd.ms-excel"
                ) {
                    const workbook = XLSX.read(buffer, { type: "buffer" });
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    rows = XLSX.utils.sheet_to_json(worksheet);
                }

                // Create import record
                const importRecord = await createFinanceImport(
                    file.name,
                    file.name,
                    admin.id,
                    { fileSize: file.size },
                    admin.id
                );

                // Fetch category and company data for mapping
                const categoriesResult = await getFinanceCategories({
                    page: 1,
                    limit: 1000,
                    includeDeleted: false,
                    sortBy: "name",
                    sortOrder: "asc",
                });
                const companies = await getCRMCompaniesForFilter();

                const categoryMap = new Map(
                    categoriesResult.categories.map((c) => [c.slug, c.id])
                );
                const companyMap = new Map(companies.map((c) => [c.name, c.id]));

                // Process rows
                let successCount = 0;
                let failCount = 0;

                for (let i = 0; i < rows.length; i++) {
                    const row = rows[i];

                    try {
                        const type = row.type?.toString().toUpperCase();
                        if (!type || !["INCOME", "EXPENSE"].includes(type)) {
                            throw new Error("Type must be INCOME or EXPENSE");
                        }

                        const amountRaw = row.amount
                            ?.toString()
                            .replace(/[$,]/g, "");
                        const amount = Number(amountRaw);
                        if (!amountRaw || isNaN(amount) || amount <= 0) {
                            throw new Error("Amount must be a positive number");
                        }

                        const transactionDateRaw = row.transactionDate?.toString();
                        if (!transactionDateRaw) {
                            throw new Error("Transaction date is required");
                        }

                        const transactionDate = new Date(transactionDateRaw);
                        if (isNaN(transactionDate.getTime())) {
                            throw new Error("Invalid transaction date format");
                        }

                        const paidAmountRaw = row.paidAmount
                            ?.toString()
                            .replace(/[$,]/g, "") ?? "0";
                        const paidAmount = Number(paidAmountRaw);
                        if (isNaN(paidAmount) || paidAmount < 0) {
                            throw new Error("Paid amount must be a non-negative number");
                        }

                        if (paidAmount > amount) {
                            throw new Error("Paid amount cannot exceed total amount");
                        }

                        let dueDate: Date | undefined;
                        if (row.dueDate) {
                            dueDate = new Date(row.dueDate.toString());
                            if (isNaN(dueDate.getTime())) {
                                dueDate = undefined;
                            }
                        }

                        let paidAt: Date | undefined;
                        if (row.paidAt) {
                            paidAt = new Date(row.paidAt.toString());
                            if (isNaN(paidAt.getTime())) {
                                paidAt = undefined;
                            }
                        }

                        let categoryId: string | undefined;
                        if (row.categoryName) {
                            const slug = row.categoryName
                                .toString()
                                .toLowerCase()
                                .replace(/\s+/g, "-");
                            categoryId = categoryMap.get(slug);
                        }

                        let companyId: string | undefined;
                        if (row.companyName) {
                            companyId = companyMap.get(row.companyName.toString());
                        }

                        let status = "PENDING";
                        if (paidAmount >= amount) {
                            status = "PAID";
                        } else if (paidAmount > 0) {
                            status = "PARTIALLY_PAID";
                        }

                        await createFinanceTransaction(
                            {
                                type: type as "INCOME" | "EXPENSE",
                                status: status as any,
                                reference: row.reference?.toString() || undefined,
                                invoiceNumber: row.invoiceNumber?.toString() || undefined,
                                description: row.description?.toString() || undefined,
                                notes: row.notes?.toString() || undefined,
                                amount,
                                paidAmount,
                                pendingAmount: Number((amount - paidAmount).toFixed(2)),
                                currency: row.currency?.toString() || "USD",
                                transactionDate,
                                dueDate,
                                paidAt,
                                categoryId,
                                companyId,
                                sourceImportId: importRecord.id,
                            },
                            admin.id
                        );

                        successCount++;
                    } catch {
                        failCount++;
                    }
                }

                const finalStatus =
                    failCount === 0
                        ? "COMPLETED"
                        : successCount === 0
                          ? "FAILED"
                          : "PARTIAL";

                await updateFinanceImportStatus(
                    importRecord.id,
                    finalStatus,
                    {
                        totalRows: rows.length,
                        successfulRows: successCount,
                        failedRows: failCount,
                        skippedRows: 0,
                    },
                    admin.id
                );

                return NextResponse.json({
                    importId: importRecord.id,
                    totalRows: rows.length,
                    successfulRows: successCount,
                    failedRows: failCount,
                    status: finalStatus,
                });
            }

            return NextResponse.json(
                { error: "Invalid action" },
                { status: 400 }
            );
        }

        // Handle JSON (legacy API)
        let body: unknown;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
        }

        const bodyData = body as Record<string, unknown>;

        if (!bodyData.filename || !bodyData.originalFilename) {
            return NextResponse.json(
                { error: "filename and originalFilename are required." },
                { status: 400 }
            );
        }

        const financeImport = await createFinanceImport(
            String(bodyData.filename),
            String(bodyData.originalFilename),
            admin.id,
            {
                fileSize: bodyData.fileSize ? Number(bodyData.fileSize) : undefined,
                mimeType: bodyData.mimeType ? String(bodyData.mimeType) : undefined,
                sourceHash: bodyData.sourceHash ? String(bodyData.sourceHash) : undefined,
                sheetName: bodyData.sheetName ? String(bodyData.sheetName) : undefined,
            },
            admin.id
        );

        return NextResponse.json({ import: financeImport }, { status: 201 });
    } catch (error) {
        if (isAuthorizationError(error)) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }

        console.error("[FINANCE_IMPORTS_API]", error);

        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
