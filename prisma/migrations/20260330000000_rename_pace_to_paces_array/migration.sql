-- Migration: Change pace (single RoutePace) to paces (RoutePace array) in route_calls
-- Preserves existing data by wrapping the current value in an array

ALTER TABLE "route_calls" ADD COLUMN "paces" "RoutePace"[] NOT NULL DEFAULT '{}';
UPDATE "route_calls" SET "paces" = ARRAY["pace"::"RoutePace"];
ALTER TABLE "route_calls" ALTER COLUMN "paces" DROP DEFAULT;
ALTER TABLE "route_calls" DROP COLUMN "pace";
