"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { taskFormSchema } from "@/lib/validation/task-schema";

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
    await db.task.create({ data: { title: parsed.data.title } });
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
      data: { title: parsed.data.title },
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