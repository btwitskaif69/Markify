/*
  Warnings:

  - A unique constraint covering the columns `[userId,title]` on the table `Bookmark` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Bookmark" ADD COLUMN     "collectionId" TEXT,
ALTER COLUMN "tags" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Collection_userId_name_key" ON "Collection"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_userId_title_key" ON "Bookmark"("userId", "title");

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE SET NULL ON UPDATE CASCADE;
