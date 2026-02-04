/*
  Warnings:

  - A unique constraint covering the columns `[userId,routeId]` on the table `reviews` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "reviews_routeId_userId_key";

-- AlterTable
ALTER TABLE "reviews" ALTER COLUMN "comment" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "reviews_userId_routeId_key" ON "reviews"("userId", "routeId");
