-- CreateEnum
CREATE TYPE "FinanceTransactionType" AS ENUM ('INCOME', 'EXPENSE');

-- CreateEnum
CREATE TYPE "FinancePaymentStatus" AS ENUM ('PENDING', 'PARTIALLY_PAID', 'PAID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "FinanceCategoryType" AS ENUM ('INCOME', 'EXPENSE', 'ALL');

-- CreateEnum
CREATE TYPE "FinanceImportStatus" AS ENUM ('UPLOADED', 'PROCESSING', 'COMPLETED', 'PARTIAL', 'FAILED');

-- CreateTable
CREATE TABLE "FinanceCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "type" "FinanceCategoryType" NOT NULL DEFAULT 'ALL',
    "color" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinanceCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinanceImport" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "originalFilename" TEXT NOT NULL,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "status" "FinanceImportStatus" NOT NULL DEFAULT 'UPLOADED',
    "sourceHash" TEXT,
    "sheetName" TEXT,
    "totalRows" INTEGER NOT NULL DEFAULT 0,
    "successfulRows" INTEGER NOT NULL DEFAULT 0,
    "failedRows" INTEGER NOT NULL DEFAULT 0,
    "skippedRows" INTEGER NOT NULL DEFAULT 0,
    "errorSummary" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinanceImport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinanceTransaction" (
    "id" TEXT NOT NULL,
    "type" "FinanceTransactionType" NOT NULL,
    "status" "FinancePaymentStatus" NOT NULL DEFAULT 'PENDING',
    "reference" TEXT,
    "invoiceNumber" TEXT,
    "invoiceReference" TEXT,
    "description" TEXT,
    "notes" TEXT,
    "amount" DECIMAL(18,2) NOT NULL,
    "paidAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "pendingAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "transactionDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "categoryId" TEXT,
    "companyId" TEXT,
    "createdById" TEXT NOT NULL,
    "sourceImportId" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinanceTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinanceAuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FinanceAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FinanceCategory_slug_key" ON "FinanceCategory"("slug");

-- CreateIndex
CREATE INDEX "FinanceCategory_type_idx" ON "FinanceCategory"("type");

-- CreateIndex
CREATE INDEX "FinanceCategory_slug_idx" ON "FinanceCategory"("slug");

-- CreateIndex
CREATE INDEX "FinanceCategory_sortOrder_idx" ON "FinanceCategory"("sortOrder");

-- CreateIndex
CREATE INDEX "FinanceCategory_deletedAt_idx" ON "FinanceCategory"("deletedAt");

-- CreateIndex
CREATE INDEX "FinanceCategory_createdAt_idx" ON "FinanceCategory"("createdAt");

-- CreateIndex
CREATE INDEX "FinanceImport_createdAt_idx" ON "FinanceImport"("createdAt");

-- CreateIndex
CREATE INDEX "FinanceImport_status_idx" ON "FinanceImport"("status");

-- CreateIndex
CREATE INDEX "FinanceImport_createdById_idx" ON "FinanceImport"("createdById");

-- CreateIndex
CREATE INDEX "FinanceImport_sourceHash_idx" ON "FinanceImport"("sourceHash");

-- CreateIndex
CREATE INDEX "FinanceTransaction_transactionDate_idx" ON "FinanceTransaction"("transactionDate");

-- CreateIndex
CREATE INDEX "FinanceTransaction_dueDate_idx" ON "FinanceTransaction"("dueDate");

-- CreateIndex
CREATE INDEX "FinanceTransaction_paidAt_idx" ON "FinanceTransaction"("paidAt");

-- CreateIndex
CREATE INDEX "FinanceTransaction_type_idx" ON "FinanceTransaction"("type");

-- CreateIndex
CREATE INDEX "FinanceTransaction_status_idx" ON "FinanceTransaction"("status");

-- CreateIndex
CREATE INDEX "FinanceTransaction_categoryId_idx" ON "FinanceTransaction"("categoryId");

-- CreateIndex
CREATE INDEX "FinanceTransaction_companyId_idx" ON "FinanceTransaction"("companyId");

-- CreateIndex
CREATE INDEX "FinanceTransaction_createdById_idx" ON "FinanceTransaction"("createdById");

-- CreateIndex
CREATE INDEX "FinanceTransaction_deletedAt_idx" ON "FinanceTransaction"("deletedAt");

-- CreateIndex
CREATE INDEX "FinanceTransaction_createdAt_idx" ON "FinanceTransaction"("createdAt");

-- CreateIndex
CREATE INDEX "FinanceTransaction_sourceImportId_idx" ON "FinanceTransaction"("sourceImportId");

-- CreateIndex
CREATE INDEX "FinanceTransaction_type_transactionDate_idx" ON "FinanceTransaction"("type", "transactionDate");

-- CreateIndex
CREATE INDEX "FinanceTransaction_status_pendingAmount_idx" ON "FinanceTransaction"("status", "pendingAmount");

-- CreateIndex
CREATE INDEX "FinanceAuditLog_userId_idx" ON "FinanceAuditLog"("userId");

-- CreateIndex
CREATE INDEX "FinanceAuditLog_action_idx" ON "FinanceAuditLog"("action");

-- CreateIndex
CREATE INDEX "FinanceAuditLog_resource_idx" ON "FinanceAuditLog"("resource");

-- CreateIndex
CREATE INDEX "FinanceAuditLog_resourceId_idx" ON "FinanceAuditLog"("resourceId");

-- CreateIndex
CREATE INDEX "FinanceAuditLog_createdAt_idx" ON "FinanceAuditLog"("createdAt");

-- AddForeignKey
ALTER TABLE "FinanceImport" ADD CONSTRAINT "FinanceImport_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinanceTransaction" ADD CONSTRAINT "FinanceTransaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "FinanceCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinanceTransaction" ADD CONSTRAINT "FinanceTransaction_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinanceTransaction" ADD CONSTRAINT "FinanceTransaction_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinanceTransaction" ADD CONSTRAINT "FinanceTransaction_sourceImportId_fkey" FOREIGN KEY ("sourceImportId") REFERENCES "FinanceImport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinanceAuditLog" ADD CONSTRAINT "FinanceAuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
