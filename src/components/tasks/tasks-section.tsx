"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { cn } from "cn";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";

import { Card, CardContent } from "@/components/ui/card";

import { NewTaskForm } from "@/components/tasks/new-task-form";
import { TaskColumn } from "@/components/tasks/task-column";
import { reorderTasks } from "@/lib/actions/tasks";
import type { TaskSummary } from "@/lib/data/tasks";
import {
  taskCategories,
  taskCategoryLabels,
  taskCategoryStyles,
  type TaskCategoryValue,
} from "@/lib/validation/task-schema";

const columns: { title: string; category: TaskCategoryValue }[] =
  taskCategories.map((category) => ({
    title: taskCategoryLabels[category],
    category,
  }));

export function TasksSection({ tasks }: { tasks: TaskSummary[] }) {
  const [items, setItems] = useState(tasks);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const persistRef = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  useEffect(() => {
    if (!activeId && !persistRef.current) {
      setItems(tasks);
    }
  }, [tasks, activeId]);

  const activeTask = items.find((task) => task.id === activeId) ?? null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const activeIdValue = String(active.id);
    setActiveId(null);
    if (!over || activeIdValue === String(over.id)) return;

    const overId = String(over.id);
    const isColumnOver = (
      taskCategories as readonly string[]
    ).includes(overId);

    const activeTask = items.find((task) => task.id === activeIdValue);
    if (!activeTask) return;

    const without = items.filter((task) => task.id !== activeIdValue);
    const groups = new Map<TaskCategoryValue, TaskSummary[]>(
      taskCategories.map((category) => [
        category,
        without.filter((task) => task.category === category),
      ]),
    );

    const overTask = without.find((task) => task.id === overId);
    const targetCategory: TaskCategoryValue = isColumnOver
      ? (overId as TaskCategoryValue)
      : (overTask?.category ?? activeTask.category);

    const targetGroup = groups.get(targetCategory) ?? [];
    const insertAt = isColumnOver
      ? targetGroup.length
      : Math.max(
          0,
          targetGroup.findIndex((task) => task.id === overId),
        );
    targetGroup.splice(insertAt, 0, {
      ...activeTask,
      category: targetCategory,
    });
    groups.set(targetCategory, targetGroup);

    const next = taskCategories.flatMap(
      (category) => groups.get(category) ?? [],
    );

    const updates = taskCategories.flatMap((category) =>
      (groups.get(category) ?? []).map((task, index) => ({
        id: task.id,
        category,
        sortOrder: index + 1,
      })),
    );

    setItems(next);

    persistRef.current = true;
    startTransition(async () => {
      await reorderTasks(updates);
      persistRef.current = false;
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <NewTaskForm />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
        onDragEnd={handleDragEnd}
      >
        <div className="grid items-start gap-3 md:grid-cols-3">
          {columns.map((column) => (
            <TaskColumn
              key={column.category}
              title={column.title}
              category={column.category}
              tasks={items.filter(
                (task) => task.category === column.category,
              )}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <Card
              className={cn(
                "w-full cursor-grabbing shadow-xl",
                taskCategoryStyles[activeTask.category].cardTint,
              )}
            >
              <CardContent className="flex items-center gap-3 py-3">
                <span
                  aria-hidden
                  className={cn(
                    "size-2 shrink-0 rounded-full",
                    taskCategoryStyles[activeTask.category].accentClass,
                  )}
                />
                <span className="text-sm leading-snug">
                  {activeTask.title}
                </span>
              </CardContent>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}