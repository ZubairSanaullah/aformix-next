-- AlterEnum
ALTER TYPE "LeadSource" ADD VALUE 'TWITTER';

-- CreateTable
CREATE TABLE "SEOSettings" (
    "id" TEXT NOT NULL,
    "siteTitle" TEXT,
    "siteDescription" TEXT,
    "canonicalUrl" TEXT,
    "defaultOgImage" TEXT,
    "twitterHandle" TEXT,
    "defaultRobotsIndex" BOOLEAN NOT NULL DEFAULT true,
    "defaultRobotsFollow" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SEOSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SEOPage" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "keywords" TEXT,
    "canonical" TEXT,
    "noIndex" BOOLEAN NOT NULL DEFAULT false,
    "noFollow" BOOLEAN NOT NULL DEFAULT false,
    "ogTitle" TEXT,
    "ogDescription" TEXT,
    "ogImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SEOPage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SEOPage_path_key" ON "SEOPage"("path");
