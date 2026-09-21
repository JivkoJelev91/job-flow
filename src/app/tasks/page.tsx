import type { Metadata } from "next";
import { ClipboardList } from "lucide-react";

import { getTasks } from "@/lib/data/tasks";
import { TasksSection } from "@/components/tasks/tasks-section";

export const metadata: Metadata = {
  title: "Daily Tasks",
};

export const instant = false;

export default async function TasksPage() {
  const tasks = await getTasks();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8">
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
          <ClipboardList className="size-5" />
        </span>
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Daily Tasks</h1>
          <p className="text-sm text-muted-foreground">
            Small steps that keep the job search moving.
          </p>
        </div>
      </div>
      <TasksSection tasks={tasks} />
    </div>
  );
}