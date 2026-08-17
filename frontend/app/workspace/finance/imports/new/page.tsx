import { WorkspacePageHeader, WorkspaceCard, WorkspaceAlert } from "@/components/workspace/ui";

import FinanceImportUploader from "@/components/workspace/finance/FinanceImportUploader";

import {
    isAuthorizationError,
    requireAdmin,
} from "@/lib/auth/authorization";

export default async function NewImportPage() {
    let currentUser;

    try {
        currentUser = await requireAdmin();
    } catch (error) {
        if (isAuthorizationError(error)) {
            return (
                <div className="space-y-6">
                    <WorkspacePageHeader
                        title="Upload Import"
                        description="Import financial transactions from a file."
                    />

                    <WorkspaceAlert variant="danger" title="Access restricted">
                        {error.status === 401
                            ? "Please sign in to create imports."
                            : "Only administrators can access the Finance module."}
                    </WorkspaceAlert>
                </div>
            );
        }

        throw error;
    }

    return (
        <div className="space-y-6">
            <WorkspacePageHeader
                title="Upload Import"
                description="Import financial transactions from a CSV or Excel file."
                breadcrumbs={[
                    { label: "Workspace", href: "/workspace" },
                    { label: "Finance", href: "/workspace/finance" },
                    { label: "Imports", href: "/workspace/finance/imports" },
                    { label: "New" },
                ]}
            />

            <WorkspaceCard>
                <FinanceImportUploader />
            </WorkspaceCard>

            {/* File Format Guide */}
            <WorkspaceCard padding="md">
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-[var(--workspace-text)]">
                        Supported File Format
                    </h3>

                    <div className="space-y-3 text-sm">
                        <div>
                            <p className="font-medium text-[var(--workspace-text)]">
                                Supported Formats
                            </p>
                            <p className="text-[var(--workspace-text-muted)]">
                                CSV, XLSX, XLS files
                            </p>
                        </div>

                        <div>
                            <p className="font-medium text-[var(--workspace-text)]">
                                Required Columns
                            </p>
                            <ul className="text-[var(--workspace-text-muted)] space-y-1 ml-4 list-disc">
                                <li>
                                    <strong>type</strong>: INCOME or EXPENSE
                                </li>
                                <li>
                                    <strong>amount</strong>: Positive number (currency optional)
                                </li>
                                <li>
                                    <strong>transactionDate</strong>: Date (YYYY-MM-DD format)
                                </li>
                            </ul>
                        </div>

                        <div>
                            <p className="font-medium text-[var(--workspace-text)]">
                                Optional Columns
                            </p>
                            <ul className="text-[var(--workspace-text-muted)] space-y-1 ml-4 list-disc">
                                <li>reference</li>
                                <li>invoiceNumber</li>
                                <li>description</li>
                                <li>notes</li>
                                <li>paidAmount</li>
                                <li>currency (default: USD)</li>
                                <li>dueDate</li>
                                <li>paidAt</li>
                                <li>categoryName</li>
                                <li>companyName</li>
                            </ul>
                        </div>

                        <div>
                            <p className="font-medium text-[var(--workspace-text)]">
                                Example CSV
                            </p>
                            <pre className="text-xs bg-[var(--workspace-card-background)] p-2 rounded overflow-x-auto text-[var(--workspace-text-muted)]">
{`type,amount,reference,description,transactionDate,categoryName
INCOME,5000,INV-001,Client Payment,2024-01-15,Consulting
EXPENSE,250,RECEIPT-001,Office Supplies,2024-01-16,Supplies`}
                            </pre>
                        </div>
                    </div>
                </div>
            </WorkspaceCard>
        </div>
    );
}
