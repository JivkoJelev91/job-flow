-- AlterEnum
-- PostgreSQL cannot remove values from an enum, so the type is rebuilt
-- without the removed variants and the column is repointed.
ALTER TYPE "application_status" RENAME TO "application_status_old";

CREATE TYPE "application_status" AS ENUM ('NOT_APPLIED', 'APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED', 'GHOSTED', 'CLOSED');

ALTER TABLE "applications" ALTER COLUMN "status" DROP DEFAULT;

UPDATE "applications" SET "status" = 'NOT_APPLIED'::"application_status_old"
WHERE "status" IN ('SAVED', 'SCREENING', 'WITHDRAWN');

ALTER TABLE "applications" ALTER COLUMN "status" TYPE "application_status"
USING ("status"::text::"application_status");

ALTER TABLE "applications" ALTER COLUMN "status" SET DEFAULT 'NOT_APPLIED'::"application_status";

DROP TYPE "application_status_old";