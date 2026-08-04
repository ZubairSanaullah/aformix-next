/*
  Warnings:

  - You are about to drop the column `authorId` on the `Post` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "authorId",
ALTER COLUMN "excerpt" DROP NOT NULL,
ALTER COLUMN "readingTime" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "description" TEXT;
