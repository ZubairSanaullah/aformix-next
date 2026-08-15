"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Prisma } from "@prisma/client";
import { toast } from "sonner";

import { WorkspaceButton } from "@/components/workspace/ui";

import type { FinanceCategory } from "@prisma/client";

interface Company {
    id: string;
    name: string;
}

interface Transaction {
    id: string;
    type: string;
    status: string;
    reference: string | null;
    invoiceNumber: string | null;
    description: string | null;
    notes: string | null;
    amount: any;
    paidAmount: any;
    pendingAmount: any;
    currency: string;
    transactionDate: Date;
    dueDate: Date | null;
    paidAt: Date | null;
    categoryId: string | null;
    companyId: string | null;
}

interface FinanceTransactionFormProps {
    transaction?: Transaction;
    categories: FinanceCategory[];
    companies: Company[];
    mode?: "create" | "edit";
}

function toDateInputValue(date: Date | null | undefined): string {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function formatCurrencyForDisplay(amount: any): string {
    const num =
        typeof amount === "string"
            ? parseFloat(amount)
            : amount instanceof Prisma.Decimal
              ? parseFloat(amount.toString())
              : amount;
    return isNaN(num) ? "" : num.toFixed(2);
}

export default function FinanceTransactionForm({
    transaction,
    categories,
    companies,
    mode = "create",
}: FinanceTransactionFormProps) {
    const router = useRouter();
    const isEdit = mode === "edit" && transaction;

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        type: transaction?.type || "INCOME",
        status: transaction?.status || "PENDING",
        reference: transaction?.reference || "",
        invoiceNumber: transaction?.invoiceNumber || "",
        description: transaction?.description || "",
        notes: transaction?.notes || "",
        amount: formatCurrencyForDisplay(transaction?.amount || ""),
        paidAmount: formatCurrencyForDisplay(transaction?.paidAmount || "0"),
        currency: transaction?.currency || "USD",
        transactionDate: toDateInputValue(transaction?.transactionDate),
        dueDate: toDateInputValue(transaction?.dueDate),
        paidAt: toDateInputValue(transaction?.paidAt),
        categoryId: transaction?.categoryId || "",
        companyId: transaction?.companyId || "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.reference?.trim()) {
            newErrors.reference = "Reference is required";
        }

        const amount = parseFloat(formData.amount);
        if (!formData.amount || isNaN(amount) || amount <= 0) {
            newErrors.amount = "Amount must be a positive number";
        }

        const paidAmount = parseFloat(formData.paidAmount || "0");
        if (isNaN(paidAmount) || paidAmount < 0) {
            newErrors.paidAmount = "Paid amount cannot be negative";
        }

        if (paidAmount > amount) {
            newErrors.paidAmount = "Paid amount cannot exceed total amount";
        }

        if (!formData.transactionDate) {
            newErrors.transactionDate = "Transaction date is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const payload = {
                type: formData.type,
                status: formData.status,
                reference: formData.reference || undefined,
                invoiceNumber: formData.invoiceNumber || undefined,
                description: formData.description || undefined,
                notes: formData.notes || undefined,
                amount: formData.amount,
                paidAmount: formData.paidAmount || "0",
                pendingAmount: String(Number(formData.amount) - Number(formData.paidAmount || "0")),
                currency: formData.currency,
                transactionDate: formData.transactionDate,
                dueDate: formData.dueDate || undefined,
                paidAt: formData.paidAt || undefined,
                categoryId: formData.categoryId || undefined,
                companyId: formData.companyId || undefined,
            };

            let response;
            if (isEdit) {
                response = await fetch(
                    `/api/finance/transactions/${transaction.id}`,
                    {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload),
                    }
                );
            } else {
                response = await fetch("/api/finance/transactions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.error || errorData.message || "Failed to save transaction";
                const details = errorData.details ? " - " + JSON.stringify(errorData.details) : "";
                throw new Error(errorMessage + details);
            }

            const result = await response.json();
            toast.success(
                isEdit
                    ? "Transaction updated successfully"
                    : "Transaction created successfully"
            );

            if (isEdit) {
                router.refresh();
            } else {
                router.push(
                    `/workspace/finance/transactions/${result.transaction.id}`
                );
            }
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "An error occurred"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type & Status Row */}
            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="block text-xs font-semibold text-[var(--workspace-text)] mb-1.5">
                        Type
                    </label>
                    <select
                        value={formData.type}
                        onChange={(e) =>
                            setFormData({ ...formData, type: e.target.value })
                        }
                        className="
              w-full
              rounded-lg
              border
              border-[var(--workspace-border)]
              bg-[var(--workspace-background)]
              px-3
              py-2
              text-sm
              text-[var(--workspace-text)]
              transition-colors
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--workspace-primary)]
            "
                    >
                        <option value="INCOME">Income</option>
                        <option value="EXPENSE">Expense</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-[var(--workspace-text)] mb-1.5">
                        Status
                    </label>
                    <select
                        value={formData.status}
                        onChange={(e) =>
                            setFormData({ ...formData, status: e.target.value })
                        }
                        className="
              w-full
              rounded-lg
              border
              border-[var(--workspace-border)]
              bg-[var(--workspace-background)]
              px-3
              py-2
              text-sm
              text-[var(--workspace-text)]
              transition-colors
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--workspace-primary)]
            "
                    >
                        <option value="PENDING">Pending</option>
                        <option value="PARTIALLY_PAID">Partially Paid</option>
                        <option value="PAID">Paid</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Reference & Invoice Number */}
            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="block text-xs font-semibold text-[var(--workspace-text)] mb-1.5">
                        Reference <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.reference}
                        onChange={(e) =>
                            setFormData({ ...formData, reference: e.target.value })
                        }
                        placeholder="e.g., INV-2024-001"
                        className="
              w-full
              rounded-lg
              border
              border-[var(--workspace-border)]
              bg-[var(--workspace-background)]
              px-3
              py-2
              text-sm
              text-[var(--workspace-text)]
              placeholder:text-[var(--workspace-text-muted)]
              transition-colors
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--workspace-primary)]
            "
                    />
                    {errors.reference && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.reference}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-semibold text-[var(--workspace-text)] mb-1.5">
                        Invoice Number
                    </label>
                    <input
                        type="text"
                        value={formData.invoiceNumber}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                invoiceNumber: e.target.value,
                            })
                        }
                        placeholder="e.g., INV123456"
                        className="
              w-full
              rounded-lg
              border
              border-[var(--workspace-border)]
              bg-[var(--workspace-background)]
              px-3
              py-2
              text-sm
              text-[var(--workspace-text)]
              placeholder:text-[var(--workspace-text-muted)]
              transition-colors
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--workspace-primary)]
            "
                    />
                </div>
            </div>

            {/* Description */}
            <div>
                <label className="block text-xs font-semibold text-[var(--workspace-text)] mb-1.5">
                    Description
                </label>
                <textarea
                    value={formData.description}
                    onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Transaction details..."
                    rows={3}
                    className="
              w-full
              rounded-lg
              border
              border-[var(--workspace-border)]
              bg-[var(--workspace-background)]
              px-3
              py-2
              text-sm
              text-[var(--workspace-text)]
              placeholder:text-[var(--workspace-text-muted)]
              transition-colors
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--workspace-primary)]
              resize-none
            "
                />
            </div>

            {/* Amount & Currency */}
            <div className="grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[var(--workspace-text)] mb-1.5">
                        Amount <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.amount}
                        onChange={(e) =>
                            setFormData({ ...formData, amount: e.target.value })
                        }
                        placeholder="0.00"
                        className="
              w-full
              rounded-lg
              border
              border-[var(--workspace-border)]
              bg-[var(--workspace-background)]
              px-3
              py-2
              text-sm
              text-[var(--workspace-text)]
              placeholder:text-[var(--workspace-text-muted)]
              transition-colors
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--workspace-primary)]
            "
                    />
                    {errors.amount && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.amount}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-semibold text-[var(--workspace-text)] mb-1.5">
                        Currency
                    </label>
                    <input
                        type="text"
                        value={formData.currency}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                currency: e.target.value.toUpperCase(),
                            })
                        }
                        placeholder="USD"
                        maxLength={3}
                        className="
              w-full
              rounded-lg
              border
              border-[var(--workspace-border)]
              bg-[var(--workspace-background)]
              px-3
              py-2
              text-sm
              text-[var(--workspace-text)]
              placeholder:text-[var(--workspace-text-muted)]
              transition-colors
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--workspace-primary)]
            "
                    />
                </div>
            </div>

            {/* Paid Amount */}
            <div>
                <label className="block text-xs font-semibold text-[var(--workspace-text)] mb-1.5">
                    Paid Amount
                </label>
                <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.paidAmount}
                    onChange={(e) =>
                        setFormData({ ...formData, paidAmount: e.target.value })
                    }
                    placeholder="0.00"
                    className="
              w-full
              rounded-lg
              border
              border-[var(--workspace-border)]
              bg-[var(--workspace-background)]
              px-3
              py-2
              text-sm
              text-[var(--workspace-text)]
              placeholder:text-[var(--workspace-text-muted)]
              transition-colors
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--workspace-primary)]
            "
                />
                {errors.paidAmount && (
                    <p className="mt-1 text-xs text-red-500">
                        {errors.paidAmount}
                    </p>
                )}
            </div>

            {/* Dates */}
            <div className="grid gap-4 sm:grid-cols-3">
                <div>
                    <label className="block text-xs font-semibold text-[var(--workspace-text)] mb-1.5">
                        Transaction Date <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        value={formData.transactionDate}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                transactionDate: e.target.value,
                            })
                        }
                        className="
              w-full
              rounded-lg
              border
              border-[var(--workspace-border)]
              bg-[var(--workspace-background)]
              px-3
              py-2
              text-sm
              text-[var(--workspace-text)]
              transition-colors
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--workspace-primary)]
            "
                    />
                    {errors.transactionDate && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.transactionDate}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-semibold text-[var(--workspace-text)] mb-1.5">
                        Due Date
                    </label>
                    <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                dueDate: e.target.value,
                            })
                        }
                        className="
              w-full
              rounded-lg
              border
              border-[var(--workspace-border)]
              bg-[var(--workspace-background)]
              px-3
              py-2
              text-sm
              text-[var(--workspace-text)]
              transition-colors
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--workspace-primary)]
            "
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-[var(--workspace-text)] mb-1.5">
                        Paid At
                    </label>
                    <input
                        type="date"
                        value={formData.paidAt}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                paidAt: e.target.value,
                            })
                        }
                        className="
              w-full
              rounded-lg
              border
              border-[var(--workspace-border)]
              bg-[var(--workspace-background)]
              px-3
              py-2
              text-sm
              text-[var(--workspace-text)]
              transition-colors
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--workspace-primary)]
            "
                    />
                </div>
            </div>

            {/* Category & Company */}
            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="block text-xs font-semibold text-[var(--workspace-text)] mb-1.5">
                        Category
                    </label>
                    <select
                        value={formData.categoryId}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                categoryId: e.target.value,
                            })
                        }
                        className="
              w-full
              rounded-lg
              border
              border-[var(--workspace-border)]
              bg-[var(--workspace-background)]
              px-3
              py-2
              text-sm
              text-[var(--workspace-text)]
              transition-colors
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--workspace-primary)]
            "
                    >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-[var(--workspace-text)] mb-1.5">
                        Company
                    </label>
                    <select
                        value={formData.companyId}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                companyId: e.target.value,
                            })
                        }
                        className="
              w-full
              rounded-lg
              border
              border-[var(--workspace-border)]
              bg-[var(--workspace-background)]
              px-3
              py-2
              text-sm
              text-[var(--workspace-text)]
              transition-colors
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--workspace-primary)]
            "
                    >
                        <option value="">Select a company</option>
                        {companies.map((company) => (
                            <option key={company.id} value={company.id}>
                                {company.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Notes */}
            <div>
                <label className="block text-xs font-semibold text-[var(--workspace-text)] mb-1.5">
                    Notes
                </label>
                <textarea
                    value={formData.notes}
                    onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Additional notes..."
                    rows={3}
                    className="
              w-full
              rounded-lg
              border
              border-[var(--workspace-border)]
              bg-[var(--workspace-background)]
              px-3
              py-2
              text-sm
              text-[var(--workspace-text)]
              placeholder:text-[var(--workspace-text-muted)]
              transition-colors
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--workspace-primary)]
              resize-none
            "
                />
            </div>

            {/* Actions */}
            <div className="flex gap-3 sm:justify-end">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-lg
              border
              border-[var(--workspace-border)]
              bg-[var(--workspace-background)]
              px-4
              py-2
              text-sm
              font-medium
              text-[var(--workspace-text)]
              transition-colors
              hover:bg-[var(--workspace-card-background)]
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--workspace-primary)]
            "
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-[var(--workspace-primary)]
              px-4
              py-2
              text-sm
              font-medium
              text-white
              shadow-sm
              transition-all
              duration-150
              hover:opacity-90
              disabled:opacity-50
              disabled:cursor-not-allowed
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--workspace-primary)]
              focus:ring-offset-2
              focus:ring-offset-[var(--workspace-background)]
            "
                >
                    {loading ? "Saving..." : isEdit ? "Update" : "Create"}
                </button>
            </div>
        </form>
    );
}
