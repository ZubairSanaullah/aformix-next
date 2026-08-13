-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ActivityType" ADD VALUE 'KNOWLEDGE_ARTICLE_CREATED';
ALTER TYPE "ActivityType" ADD VALUE 'KNOWLEDGE_ARTICLE_UPDATED';
ALTER TYPE "ActivityType" ADD VALUE 'KNOWLEDGE_ARTICLE_PUBLISHED';
ALTER TYPE "ActivityType" ADD VALUE 'KNOWLEDGE_ARTICLE_ARCHIVED';
ALTER TYPE "ActivityType" ADD VALUE 'KNOWLEDGE_ARTICLE_RESTORED';
ALTER TYPE "ActivityType" ADD VALUE 'KNOWLEDGE_ARTICLE_DELETED';
ALTER TYPE "ActivityType" ADD VALUE 'KNOWLEDGE_CATEGORY_CREATED';
ALTER TYPE "ActivityType" ADD VALUE 'KNOWLEDGE_CATEGORY_UPDATED';
ALTER TYPE "ActivityType" ADD VALUE 'KNOWLEDGE_CATEGORY_DELETED';

-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "knowledgeArticleId" TEXT,
ADD COLUMN     "knowledgeCategoryId" TEXT;

-- CreateIndex
CREATE INDEX "Activity_knowledgeArticleId_idx" ON "Activity"("knowledgeArticleId");

-- CreateIndex
CREATE INDEX "Activity_knowledgeCategoryId_idx" ON "Activity"("knowledgeCategoryId");

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_knowledgeArticleId_fkey" FOREIGN KEY ("knowledgeArticleId") REFERENCES "KnowledgeArticle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_knowledgeCategoryId_fkey" FOREIGN KEY ("knowledgeCategoryId") REFERENCES "KnowledgeCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
