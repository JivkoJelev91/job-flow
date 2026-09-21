"use client";

import { cn } from "cn";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { Card, CardContent } from "@/components/ui/card";

import { TaskRow } from "@/components/tasks/task-row";
import type { TaskSummary } from "@/lib/data/tasks";
import {
  taskCategoryStyles,
  type TaskCategoryValue,
} from "@/lib/validation/task-schema";

export function TaskColumn({
  title,
  category,
  tasks,
}: {
  title: string;
  category: TaskCategoryValue;
  tasks: TaskSummary[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: category });
  const style = taskCategoryStyles[category];

  return (
    <section
      ref={setNodeRef}
      className={cn(
        "flex flex-col gap-2 rounded-xl",
        isOver && "ring-2 ring-foreground/20",
      )}
    >
      <h2
        className={cn(
          "flex items-center gap-2 px-1 text-sm font-medium",
          style.labelClass,
        )}
      >
        <span
          aria-hidden
          className={cn("size-2 rounded-full", style.accentClass)}
        />
        {title}
        <span className="rounded-full bg-muted px-1.5 text-xs tabular-nums text-muted-foreground">
          {tasks.length}
        </span>
      </h2>

      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <ol className="flex flex-col gap-2">
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
        </ol>
      </SortableContext>

      {tasks.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-6 text-center text-sm text-muted-foreground">
            Nothing here yet.
          </CardContent>
        </Card>
      )}
    </section>
  );
}