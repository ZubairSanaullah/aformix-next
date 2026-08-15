import { z } from "zod";

const cuidSchema = z.string().trim().min(1, "ID is required.").cuid();

const optionalTrimmedString = (max: number) =>
    z
        .string()
        .trim()
        .max(max, `Must be ${max} characters or fewer.`)
        .optional()
        .nullable();

const positiveDecimalSchema = z
    .union([z.string(), z.number()])
    .transform((value, ctx) => {
        const raw = typeof value === "string" ? value.trim() : String(value);

        if (!raw || raw === "") {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Value is required.",
            });
            return z.NEVER;
        }

        const numericValue = Number(raw);

        if (!Number.isFinite(numericValue)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Value must be a valid number.",
            });
            return z.NEVER;
        }

        return Number(numericValue.toFixed(2));
    })
    .pipe(z.number().min(0, "Value cannot be negative."));

const nonNegativeDecimalSchema = z
    .union([z.string(), z.number()])
    .transform((value, ctx) => {
        const raw = typeof value === "string" ? value.trim() : String(value);

        if (!raw || raw === "") {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Value is required.",
            });
            return z.NEVER;
        }

        const numericValue = Number(raw);

        if (!Number.isFinite(numericValue)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Value must be a valid number.",
            });
            return z.NEVER;
        }

        return Number(numericValue.toFixed(2));
    })
    .pipe(z.number().min(0, "Value cannot be negative."));

const slugSchema = z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .max(120, "Slug must be 120 characters or fewer.")
    .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug may only contain lowercase letters, numbers, and single hyphens."
    );

const colorSchema = z
    .string()
    .trim()
    .regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Color must be a valid hex value.")
    .optional()
    .nullable();

const pageSchema = z.coerce.number().int("Page must be an integer.").min(1, "Page must be at least 1.").default(1);
const limitSchema = z.coerce.number().int("Limit must be an integer.").min(1, "Limit must be at least 1.").max(100, "Limit cannot exceed 100.").default(20);

export const financeTransactionTypeSchema = z.enum(["INCOME", "EXPENSE"]);
export const financePaymentStatusSchema = z.enum([
    "PENDING",
    "PARTIALLY_PAID",
    "PAID",
    "CANCELLED",
]);
export const financeCategoryTypeSchema = z.enum(["INCOME", "EXPENSE", "ALL"]);
export const financeImportStatusSchema = z.enum([
    "UPLOADED",
    "PROCESSING",
    "COMPLETED",
    "PARTIAL",
    "FAILED",
]);

export const financeCategorySortFieldSchema = z.enum([
    "name",
    "type",
    "sortOrder",
    "createdAt",
    "updatedAt",
]);

export const financeCategorySortDirectionSchema = z.enum(["asc", "desc"]);

export const financeTransactionSortFieldSchema = z.enum([
    "transactionDate",
    "dueDate",
    "paidAt",
    "amount",
    "paidAmount",
    "pendingAmount",
    "createdAt",
    "updatedAt",
    "reference",
]);

export const financeTransactionSortDirectionSchema = z.enum(["asc", "desc"]);

export const financeImportSortFieldSchema = z.enum([
    "createdAt",
    "status",
    "startedAt",
    "completedAt",
]);

export const financeImportSortDirectionSchema = z.enum(["asc", "desc"]);

const financeCategoryBaseSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Category name is required.")
        .max(150, "Category name must be 150 characters or fewer."),
    slug: slugSchema,
    description: optionalTrimmedString(1000),
    type: financeCategoryTypeSchema.default("ALL"),
    color: colorSchema,
    sortOrder: z.coerce.number().int("Sort order must be an integer.").min(0, "Sort order cannot be negative.").default(0),
});

export const createFinanceCategorySchema = financeCategoryBaseSchema;

export const updateFinanceCategorySchema = financeCategoryBaseSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, "At least one field must be provided.");

export const financeCategoryIdSchema = z.object({
    id: cuidSchema,
});

export const financeCategoryListQuerySchema = z.object({
    search: z.string().trim().max(200, "Search must be 200 characters or fewer.").optional(),
    type: financeCategoryTypeSchema.optional(),
    includeDeleted: z.coerce.boolean().default(false),
    page: pageSchema,
    limit: limitSchema,
    sortBy: financeCategorySortFieldSchema.default("sortOrder"),
    sortOrder: financeCategorySortDirectionSchema.default("asc"),
});

const financeTransactionBaseSchema = z.object({
    type: financeTransactionTypeSchema,
    status: financePaymentStatusSchema.default("PENDING"),
    reference: optionalTrimmedString(200),
    invoiceNumber: optionalTrimmedString(100),
    invoiceReference: optionalTrimmedString(200),
    description: optionalTrimmedString(2000),
    notes: optionalTrimmedString(5000),
    amount: positiveDecimalSchema,
    paidAmount: nonNegativeDecimalSchema.default(0),
    pendingAmount: nonNegativeDecimalSchema.default(0),
    currency: z
        .string()
        .trim()
        .toUpperCase()
        .regex(/^[A-Z]{3}$/u, "Currency must be a valid 3-letter ISO code.")
        .default("USD"),
    transactionDate: z.coerce.date(),
    dueDate: z.coerce.date().optional().nullable(),
    paidAt: z.coerce.date().optional().nullable(),
    categoryId: cuidSchema.optional().nullable(),
    companyId: cuidSchema.optional().nullable(),
    sourceImportId: cuidSchema.optional().nullable(),
});

export const createFinanceTransactionSchema = financeTransactionBaseSchema.superRefine((data, ctx) => {
        const amount = Number(data.amount);
        const paidAmount = Number(data.paidAmount);
        const pendingAmount = Number(data.pendingAmount);

        if (paidAmount > amount) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["paidAmount"],
                message: "Paid amount cannot exceed the total amount.",
            });
        }

        const expectedPending = Number((amount - paidAmount).toFixed(2));

        if (Math.abs(expectedPending - pendingAmount) > 0.01) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["pendingAmount"],
                message: "Pending amount must equal amount minus paid amount.",
            });
        }

        const status = data.status;

        if (status === "PAID" && !(paidAmount === amount && pendingAmount === 0)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["status"],
                message: "PAID transactions must have the full amount paid with zero pending balance.",
            });
        }

        if (status === "PENDING" && !(pendingAmount === amount && paidAmount === 0)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["status"],
                message: "PENDING transactions must have no paid amount and full pending balance remaining.",
            });
        }

        if (status === "PARTIALLY_PAID") {
            if (paidAmount <= 0 || pendingAmount <= 0 || paidAmount >= amount) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["status"],
                    message: "PARTIALLY_PAID transactions must have some paid and some pending remaining.",
                });
            }
        }

        if (status === "CANCELLED" && pendingAmount > 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["status"],
                message: "CANCELLED transactions cannot have a pending balance.",
            });
        }
    });

export const updateFinanceTransactionSchema = financeTransactionBaseSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, "At least one field must be provided.");

export const financeTransactionIdSchema = z.object({
    id: cuidSchema,
});

export const financeTransactionListQuerySchema = z.object({
    search: z.string().trim().max(200, "Search must be 200 characters or fewer.").optional(),
    type: financeTransactionTypeSchema.optional(),
    status: financePaymentStatusSchema.optional(),
    categoryId: cuidSchema.optional(),
    companyId: cuidSchema.optional(),
    dateFrom: z.coerce.date().optional(),
    dateTo: z.coerce.date().optional(),
    dueDateFrom: z.coerce.date().optional(),
    dueDateTo: z.coerce.date().optional(),
    minAmount: nonNegativeDecimalSchema.optional(),
    maxAmount: nonNegativeDecimalSchema.optional(),
    includeDeleted: z.coerce.boolean().default(false),
    page: pageSchema,
    limit: limitSchema,
    sortBy: financeTransactionSortFieldSchema.default("transactionDate"),
    sortOrder: financeTransactionSortDirectionSchema.default("desc"),
}).refine((data) => {
    if (data.dateFrom && data.dateTo && data.dateTo < data.dateFrom) {
        return false;
    }
    if (data.dueDateFrom && data.dueDateTo && data.dueDateTo < data.dueDateFrom) {
        return false;
    }
    if (data.minAmount !== undefined && data.maxAmount !== undefined && data.maxAmount < data.minAmount) {
        return false;
    }
    return true;
}, {
    message: "Date and amount filters must be in a valid range.",
    path: ["dateTo"],
});

export const financeReportQuerySchema = z.object({
    year: z.coerce.number().int("Year must be an integer.").min(2000, "Year must be 2000 or later.").max(2100, "Year cannot be beyond 2100.").optional(),
    month: z.coerce.number().int("Month must be an integer.").min(1, "Month must be between 1 and 12.").max(12, "Month must be between 1 and 12.").optional(),
    compareYear: z.coerce.number().int().min(2000).max(2100).optional(),
    categoryId: cuidSchema.optional(),
    companyId: cuidSchema.optional(),
});

export const financeImportQuerySchema = z.object({
    search: z.string().trim().max(200, "Search must be 200 characters or fewer.").optional(),
    status: financeImportStatusSchema.optional(),
    createdById: cuidSchema.optional(),
    page: pageSchema,
    limit: limitSchema,
    sortBy: financeImportSortFieldSchema.default("createdAt"),
    sortOrder: financeImportSortDirectionSchema.default("desc"),
});

export type CreateFinanceCategoryInput = z.infer<typeof createFinanceCategorySchema>;
export type UpdateFinanceCategoryInput = z.infer<typeof updateFinanceCategorySchema>;
export type FinanceCategoryIdInput = z.infer<typeof financeCategoryIdSchema>;
export type FinanceCategoryListQuery = z.infer<typeof financeCategoryListQuerySchema>;

export type CreateFinanceTransactionInput = z.infer<typeof createFinanceTransactionSchema>;
export type UpdateFinanceTransactionInput = z.infer<typeof updateFinanceTransactionSchema>;
export type FinanceTransactionIdInput = z.infer<typeof financeTransactionIdSchema>;
export type FinanceTransactionListQuery = z.infer<typeof financeTransactionListQuerySchema>;

export type FinanceReportQuery = z.infer<typeof financeReportQuerySchema>;
export type FinanceImportQuery = z.infer<typeof financeImportQuerySchema>;
