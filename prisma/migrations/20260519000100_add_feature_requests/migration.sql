-- CreateEnum
CREATE TYPE "public"."FeatureRequestStatus" AS ENUM ('PENDING', 'REVIEWED', 'PLANNED', 'DONE', 'REJECTED');

-- CreateTable
CREATE TABLE "public"."FeatureRequest" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "source" TEXT,
    "status" "public"."FeatureRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "FeatureRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FeatureRequest_status_createdAt_idx" ON "public"."FeatureRequest"("status", "createdAt");

-- CreateIndex
CREATE INDEX "FeatureRequest_userId_createdAt_idx" ON "public"."FeatureRequest"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "public"."FeatureRequest" ADD CONSTRAINT "FeatureRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
