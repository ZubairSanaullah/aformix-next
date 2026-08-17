import { NextResponse } from "next/server";
import * as xlsx from "xlsx";

export async function GET() {
    try {
        const wb = xlsx.utils.book_new();

        const data = [
            {
                type: "INCOME",
                amount: 5000,
                reference: "INV-001",
                description: "Client Payment",
                transactionDate: "2024-01-15",
                categoryName: "Consulting",
                invoiceNumber: "",
                notes: "",
                paidAmount: "",
                currency: "USD",
                dueDate: "",
                paidAt: "",
                companyName: "",
            },
            {
                type: "EXPENSE",
                amount: 250,
                reference: "RECEIPT-001",
                description: "Office Supplies",
                transactionDate: "2024-01-16",
                categoryName: "Supplies",
                invoiceNumber: "",
                notes: "",
                paidAmount: "",
                currency: "USD",
                dueDate: "",
                paidAt: "",
                companyName: "",
            },
        ];

        const ws = xlsx.utils.json_to_sheet(data);

        // Auto-size columns slightly
        const wscols = [
            { wch: 10 }, // type
            { wch: 10 }, // amount
            { wch: 15 }, // reference
            { wch: 20 }, // description
            { wch: 15 }, // transactionDate
            { wch: 15 }, // categoryName
            { wch: 15 }, // invoiceNumber
            { wch: 20 }, // notes
            { wch: 10 }, // paidAmount
            { wch: 10 }, // currency
            { wch: 15 }, // dueDate
            { wch: 15 }, // paidAt
            { wch: 15 }, // companyName
        ];
        ws["!cols"] = wscols;

        xlsx.utils.book_append_sheet(wb, ws, "Template");

        const buf = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

        return new NextResponse(buf, {
            status: 200,
            headers: {
                "Content-Disposition": 'attachment; filename="finance_import_template.xlsx"',
                "Content-Type":
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            },
        });
    } catch (error) {
        console.error("Error generating Excel template:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
