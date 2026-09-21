-- CreateEnum
CREATE TYPE "task_category" AS ENUM ('CODING', 'NON_CODING');

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "category" "task_category" NOT NULL DEFAULT 'NON_CODING';

-- CreateIndex
CREATE INDEX "tasks_category_idx" ON "tasks"("category");
