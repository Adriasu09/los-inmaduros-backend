/*
  Warnings:

  - You are about to drop the column `isApproved` on the `photos` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PhotoContext" AS ENUM ('ROUTE_CALL_COVER', 'ROUTE_GALLERY', 'ROUTE_CALL_GALLERY');

-- CreateEnum
CREATE TYPE "PhotoStatus" AS ENUM ('ACTIVE', 'FLAGGED', 'REJECTED', 'DELETED');

-- AlterTable
ALTER TABLE "photos" DROP COLUMN "isApproved",
ADD COLUMN     "context" "PhotoContext" NOT NULL DEFAULT 'ROUTE_GALLERY',
ADD COLUMN     "moderatedAt" TIMESTAMP(3),
ADD COLUMN     "moderatedBy" TEXT,
ADD COLUMN     "moderationNotes" TEXT,
ADD COLUMN     "routeCallId" TEXT,
ADD COLUMN     "status" "PhotoStatus" NOT NULL DEFAULT 'ACTIVE';

-- AddForeignKey
ALTER TABLE "photos" ADD CONSTRAINT "photos_routeCallId_fkey" FOREIGN KEY ("routeCallId") REFERENCES "route_calls"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photos" ADD CONSTRAINT "photos_moderatedBy_fkey" FOREIGN KEY ("moderatedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
