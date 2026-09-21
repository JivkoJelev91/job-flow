import "server-only";

import { db } from "@/lib/db";
import type { TaskCategoryValue } from "@/lib/validation/task-schema";

export type TaskSummary = {
  id: string;
  title: string;
  category: TaskCategoryValue;
  completed: boolean;
};

export async function getTasks(): Promise<TaskSummary[]> {
  const tasks = await db.task.findMany({
    orderBy: [{ completed: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return tasks.map(({ id, title, category, completed }) => ({
    id,
    title,
    category,
    completed,
  }));
}