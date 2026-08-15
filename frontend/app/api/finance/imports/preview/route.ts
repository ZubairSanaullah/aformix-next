import { NextRequest, NextResponse } from "next/server";
import {
    isAuthorizationError,
    requireAdmin,
} from "@/lib/auth/authorization";

import * as XLSX from "xlsx";

function handleRouteError(error: unknown) {
    if (isAuthorizationError(error)) {
        return NextResponse.json(
            { error: error.message },
            { status: error.status }
        );
    }

    console.error("[FINANCE_IMPORT_PREVIEW_API]", error);

    return NextResponse.json(
        { error: "An unexpected server error occurred." },
        { status: 500 }
    );
}

interface PreviewRow {
    rowNumber: number;
    data: Record<string, any>;
    valid: boolean;
    error?: string;
}

async function parseCSV(text: string): Promise<Array<Record<string, any>>> {
    // Simple CSV parser
    const lines = text.trim().split("\n");
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map((h) => h.trim());
    const rows: Array<Record<string, any>> = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim());
        const row: Record<string, any> = {};
        headers.forEach((header, index) => {
            row[header] = values[index] || null;
        });
        rows.push(row);
    }

    return rows;
}

async function parseExcel(
    buffer: Buffer
): Promise<Array<Record<string, any>>> {
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);
    return rows;
}

export async function POST(request: NextRequest) {
    try {
        const admin = await requireAdmin();

        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        // Read file
        const buffer = Buffer.from(await file.arrayBuffer());
        let rows: Array<Record<string, any>> = [];

        if (file.type === "text/csv") {
            const text = buffer.toString("utf-8");
            rows = await parseCSV(text);
        } else if (
            file.type ===
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
            file.type === "application/vnd.ms-excel"
        ) {
            rows = await parseExcel(buffer);
        } else {
            return NextResponse.json(
                { error: "Unsupported file format" },
                { status: 400 }
            );
        }

        // Validate rows
        const previewRows: PreviewRow[] = rows.map((row, index) => {
            const errors: string[] = [];

            // Check required fields
            if (!row.type || !["INCOME", "EXPENSE"].includes(row.type.toString().toUpperCase())) {
                errors.push("Type must be INCOME or EXPENSE");
            }

            if (!row.amount) {
                errors.push("Amount is required");
            } else {
                const amount = parseFloat(
                    row.amount.toString().replace(/[$,]/g, "")
                );
                if (isNaN(amount) || amount <= 0) {
                    errors.push("Amount must be a positive number");
                }
            }

            if (!row.transactionDate) {
                errors.push("Transaction date is required");
            }

            return {
                rowNumber: index + 2, // +2 because row 1 is headers
                data: row,
                valid: errors.length === 0,
                error: errors.length > 0 ? errors.join("; ") : undefined,
            };
        });

        const validRows = previewRows.filter((r) => r.valid).length;

        return NextResponse.json({
            rows: previewRows,
            validRows,
            totalRows: previewRows.length,
        });
    } catch (error) {
        return handleRouteError(error);
    }
}
