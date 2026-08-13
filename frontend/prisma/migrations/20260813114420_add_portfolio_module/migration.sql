-- CreateEnum
CREATE TYPE "PortfolioProjectStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "PortfolioProjectVisibility" AS ENUM ('INTERNAL', 'PUBLIC');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ActivityType" ADD VALUE 'PORTFOLIO_PROJECT_CREATED';
ALTER TYPE "ActivityType" ADD VALUE 'PORTFOLIO_PROJECT_UPDATED';
ALTER TYPE "ActivityType" ADD VALUE 'PORTFOLIO_PROJECT_PUBLISHED';
ALTER TYPE "ActivityType" ADD VALUE 'PORTFOLIO_PROJECT_ARCHIVED';
ALTER TYPE "ActivityType" ADD VALUE 'PORTFOLIO_PROJECT_RESTORED';
ALTER TYPE "ActivityType" ADD VALUE 'PORTFOLIO_PROJECT_DELETED';
ALTER TYPE "ActivityType" ADD VALUE 'PORTFOLIO_CATEGORY_CREATED';
ALTER TYPE "ActivityType" ADD VALUE 'PORTFOLIO_CATEGORY_UPDATED';
ALTER TYPE "ActivityType" ADD VALUE 'PORTFOLIO_CATEGORY_ARCHIVED';
ALTER TYPE "ActivityType" ADD VALUE 'PORTFOLIO_CATEGORY_RESTORED';
ALTER TYPE "ActivityType" ADD VALUE 'PORTFOLIO_CATEGORY_DELETED';

-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "portfolioCategoryId" TEXT,
ADD COLUMN     "portfolioProjectId" TEXT;

-- CreateTable
CREATE TABLE "PortfolioCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PortfolioCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioTechnology" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "PortfolioTechnology_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioProject" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "description" TEXT,
    "content" TEXT,
    "status" "PortfolioProjectStatus" NOT NULL DEFAULT 'DRAFT',
    "visibility" "PortfolioProjectVisibility" NOT NULL DEFAULT 'INTERNAL',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "clientName" TEXT,
    "clientIndustry" TEXT,
    "projectUrl" TEXT,
    "repositoryUrl" TEXT,
    "startDate" TIMESTAMP(3),
    "completionDate" TIMESTAMP(3),
    "categoryId" TEXT,
    "authorId" TEXT NOT NULL,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoKeywords" TEXT,
    "canonicalUrl" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "PortfolioProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioProjectMedia" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "caption" TEXT,
    "altText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PortfolioProjectMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PortfolioProjectToTechnology" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PortfolioProjectToTechnology_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "PortfolioCategory_slug_key" ON "PortfolioCategory"("slug");

-- CreateIndex
CREATE INDEX "PortfolioCategory_name_idx" ON "PortfolioCategory"("name");

-- CreateIndex
CREATE INDEX "PortfolioCategory_slug_idx" ON "PortfolioCategory"("slug");

-- CreateIndex
CREATE INDEX "PortfolioCategory_sortOrder_idx" ON "PortfolioCategory"("sortOrder");

-- CreateIndex
CREATE INDEX "PortfolioCategory_deletedAt_idx" ON "PortfolioCategory"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PortfolioTechnology_slug_key" ON "PortfolioTechnology"("slug");

-- CreateIndex
CREATE INDEX "PortfolioTechnology_name_idx" ON "PortfolioTechnology"("name");

-- CreateIndex
CREATE INDEX "PortfolioTechnology_slug_idx" ON "PortfolioTechnology"("slug");

-- CreateIndex
CREATE INDEX "PortfolioTechnology_deletedAt_idx" ON "PortfolioTechnology"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PortfolioProject_slug_key" ON "PortfolioProject"("slug");

-- CreateIndex
CREATE INDEX "PortfolioProject_categoryId_idx" ON "PortfolioProject"("categoryId");

-- CreateIndex
CREATE INDEX "PortfolioProject_authorId_idx" ON "PortfolioProject"("authorId");

-- CreateIndex
CREATE INDEX "PortfolioProject_status_idx" ON "PortfolioProject"("status");

-- CreateIndex
CREATE INDEX "PortfolioProject_visibility_idx" ON "PortfolioProject"("visibility");

-- CreateIndex
CREATE INDEX "PortfolioProject_featured_idx" ON "PortfolioProject"("featured");

-- CreateIndex
CREATE INDEX "PortfolioProject_sortOrder_idx" ON "PortfolioProject"("sortOrder");

-- CreateIndex
CREATE INDEX "PortfolioProject_publishedAt_idx" ON "PortfolioProject"("publishedAt");

-- CreateIndex
CREATE INDEX "PortfolioProject_deletedAt_idx" ON "PortfolioProject"("deletedAt");

-- CreateIndex
CREATE INDEX "PortfolioProject_createdAt_idx" ON "PortfolioProject"("createdAt");

-- CreateIndex
CREATE INDEX "PortfolioProject_updatedAt_idx" ON "PortfolioProject"("updatedAt");

-- CreateIndex
CREATE INDEX "PortfolioProject_status_visibility_idx" ON "PortfolioProject"("status", "visibility");

-- CreateIndex
CREATE INDEX "PortfolioProject_deletedAt_updatedAt_idx" ON "PortfolioProject"("deletedAt", "updatedAt");

-- CreateIndex
CREATE INDEX "PortfolioProject_categoryId_sortOrder_idx" ON "PortfolioProject"("categoryId", "sortOrder");

-- CreateIndex
CREATE INDEX "PortfolioProject_featured_publishedAt_idx" ON "PortfolioProject"("featured", "publishedAt");

-- CreateIndex
CREATE INDEX "PortfolioProjectMedia_projectId_idx" ON "PortfolioProjectMedia"("projectId");

-- CreateIndex
CREATE INDEX "PortfolioProjectMedia_mediaId_idx" ON "PortfolioProjectMedia"("mediaId");

-- CreateIndex
CREATE INDEX "PortfolioProjectMedia_projectId_sortOrder_idx" ON "PortfolioProjectMedia"("projectId", "sortOrder");

-- CreateIndex
CREATE INDEX "PortfolioProjectMedia_isPrimary_idx" ON "PortfolioProjectMedia"("isPrimary");

-- CreateIndex
CREATE UNIQUE INDEX "PortfolioProjectMedia_projectId_mediaId_key" ON "PortfolioProjectMedia"("projectId", "mediaId");

-- CreateIndex
CREATE INDEX "_PortfolioProjectToTechnology_B_index" ON "_PortfolioProjectToTechnology"("B");

-- CreateIndex
CREATE INDEX "Activity_portfolioProjectId_idx" ON "Activity"("portfolioProjectId");

-- CreateIndex
CREATE INDEX "Activity_portfolioCategoryId_idx" ON "Activity"("portfolioCategoryId");

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_portfolioProjectId_fkey" FOREIGN KEY ("portfolioProjectId") REFERENCES "PortfolioProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_portfolioCategoryId_fkey" FOREIGN KEY ("portfolioCategoryId") REFERENCES "PortfolioCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioProject" ADD CONSTRAINT "PortfolioProject_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "PortfolioCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioProject" ADD CONSTRAINT "PortfolioProject_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioProjectMedia" ADD CONSTRAINT "PortfolioProjectMedia_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "PortfolioProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioProjectMedia" ADD CONSTRAINT "PortfolioProjectMedia_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PortfolioProjectToTechnology" ADD CONSTRAINT "_PortfolioProjectToTechnology_A_fkey" FOREIGN KEY ("A") REFERENCES "PortfolioProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PortfolioProjectToTechnology" ADD CONSTRAINT "_PortfolioProjectToTechnology_B_fkey" FOREIGN KEY ("B") REFERENCES "PortfolioTechnology"("id") ON DELETE CASCADE ON UPDATE CASCADE;
