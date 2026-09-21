"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import {
  taskCategories,
  taskFormSchema,
  type TaskCategoryValue,
} from "@/lib/validation/task-schema";

export type TaskActionResult = { error: string };

const TASKS_PATH = "/tasks";

export async function createTask(
  input: unknown,
): Promise<TaskActionResult | void> {
  const parsed = taskFormSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid task. Please check your entry." };
  }

  try {
    const last = await db.task.findFirst({
      where: { category: parsed.data.category },
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });
    await db.task.create({
      data: {
        title: parsed.data.title,
        category: parsed.data.category,
        sortOrder: (last?.sortOrder ?? 0) + 1,
      },
    });
  } catch {
    return { error: "Couldn't save the task. Please try again." };
  }

  revalidatePath(TASKS_PATH);
}

export async function updateTask(
  id: string,
  input: unknown,
): Promise<TaskActionResult | void> {
  const parsed = taskFormSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid task. Please check your entry." };
  }

  try {
    await db.task.update({
      where: { id },
      data: {
        title: parsed.data.title,
        category: parsed.data.category,
      },
    });
  } catch {
    return { error: "Couldn't save the task. Please try again." };
  }

  revalidatePath(TASKS_PATH);
}

export async function toggleTask(id: string, completed: boolean) {
  try {
    await db.task.update({ where: { id }, data: { completed } });
  } catch {
    // Already gone — nothing to undo.
  }
  revalidatePath(TASKS_PATH);
}

export async function deleteTask(id: string) {
  try {
    await db.task.delete({ where: { id } });
  } catch {
    // Already gone — nothing to undo.
  }
  revalidatePath(TASKS_PATH);
}

export async function reorderTasks(
  updates: { id: string; category: TaskCategoryValue; sortOrder: number }[],
) {
  if (updates.length === 0) return;

  const valid = updates.every((update) =>
    taskCategories.includes(update.category),
  );
  if (!valid) return;

  try {
    await db.$transaction(
      updates.map(({ id, category, sortOrder }) =>
        db.task.update({
          where: { id },
          data: { category, sortOrder },
        }),
      ),
    );
  } catch {
    // Reorder failed — the list refreshes from the server on the next render.
  }
  revalidatePath(TASKS_PATH);
}