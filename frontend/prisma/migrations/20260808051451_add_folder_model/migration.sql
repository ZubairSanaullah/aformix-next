/*
  Warnings:

  - You are about to drop the column `folder` on the `Media` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Media_folder_idx";

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "folder",
ADD COLUMN     "folderId" TEXT;

-- CreateTable
CREATE TABLE "Folder" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Folder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Folder_name_key" ON "Folder"("name");

-- CreateIndex
CREATE INDEX "Folder_name_idx" ON "Folder"("name");

-- CreateIndex
CREATE INDEX "Media_folderId_idx" ON "Media"("folderId");

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
