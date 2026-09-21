-- DropIndex
DROP INDEX "tasks_category_idx";

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "tasks_category_sortOrder_idx" ON "tasks"("category", "sortOrder");
