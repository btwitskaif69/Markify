-- CreateEnum
CREATE TYPE "public"."BookmarkArchiveStatus" AS ENUM ('PENDING', 'READY', 'FAILED');

-- CreateTable
CREATE TABLE "public"."BookmarkArchive" (
    "id" TEXT NOT NULL,
    "bookmarkId" TEXT NOT NULL,
    "status" "public"."BookmarkArchiveStatus" NOT NULL DEFAULT 'PENDING',
    "archivedAt" TIMESTAMP(3),
    "sourceStatusCode" INTEGER,
    "contentType" TEXT,
    "canonicalUrl" TEXT,
    "siteName" TEXT,
    "author" TEXT,
    "publishedAt" TIMESTAMP(3),
    "excerpt" TEXT,
    "textContent" TEXT,
    "contentHtml" TEXT,
    "wordCount" INTEGER,
    "readTimeMinutes" INTEGER,
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookmarkArchive_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BookmarkArchive_bookmarkId_key" ON "public"."BookmarkArchive"("bookmarkId");

-- AddForeignKey
ALTER TABLE "public"."BookmarkArchive" ADD CONSTRAINT "BookmarkArchive_bookmarkId_fkey" FOREIGN KEY ("bookmarkId") REFERENCES "public"."Bookmark"("id") ON DELETE CASCADE ON UPDATE CASCADE;
