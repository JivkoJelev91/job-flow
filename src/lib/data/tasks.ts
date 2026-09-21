import "server-only";

import { db } from "@/lib/db";

export type TaskSummary = {
  id: string;
  title: string;
  completed: boolean;
};

export async function getTasks(): Promise<TaskSummary[]> {
  const tasks = await db.task.findMany({
    orderBy: [{ completed: "asc" }, { createdAt: "asc" }],
  });
  return tasks.map(({ id, title, completed }) => ({ id, title, completed }));
}