/*
  Warnings:

  - You are about to drop the column `customRouteName` on the `route_calls` table. All the data in the column will be lost.
  - Made the column `title` on table `route_calls` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "route_calls" DROP COLUMN "customRouteName",
ALTER COLUMN "title" SET NOT NULL;
