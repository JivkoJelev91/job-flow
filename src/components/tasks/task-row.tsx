"use client";

import { useState, useTransition } from "react";
import { Pencil } from "lucide-react";
import { cn } from "cn";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DeleteButton } from "@/components/ui/delete-button";

import { TaskCategoryToggle } from "@/components/tasks/task-category-toggle";
import { TaskToggle } from "@/components/tasks/task-toggle";
import { deleteTask, updateTask } from "@/lib/actions/tasks";
import type { TaskSummary } from "@/lib/data/tasks";
import { taskCategoryStyles } from "@/lib/validation/task-schema";

export function TaskRow({ task }: { task: TaskSummary }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);
  const [draftCategory, setDraftCategory] = useState(task.category);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = taskCategoryStyles[task.category];

  const handleSave = () => {
    setError(null);
    startTransition(async () => {
      const result = await updateTask(task.id, {
        title: draft,
        category: draftCategory,
      });
      if (result?.error) {
        setError(result.error);
        return;
      }
      setEditing(false);
    });
  };

  if (editing) {
    return (
      <li ref={setNodeRef}>
        <Card className={cn("relative", style.cardTint)}>
          <CardContent>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                handleSave();
              }}
              className="flex flex-col gap-2"
            >
              {error && (
                <p className="text-sm font-normal text-destructive">
                  {error}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  maxLength={500}
                  className="min-w-40 flex-1"
                  autoFocus
                />
                <TaskCategoryToggle
                  value={draftCategory}
                  onChange={setDraftCategory}
                />
                <Button type="submit" size="sm" disabled={isPending}>
                  {isPending ? "Saving…" : "Save"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isPending}
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </li>
    );
  }

  return (
    <li
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex flex-col gap-2",
        isDragging && "z-10 opacity-70",
      )}
    >
      <Card
        className={cn(
          "relative",
          task.completed ? "bg-muted/40" : style.cardTint,
        )}
      >
        <span
          aria-hidden
          className={cn(
            "absolute inset-y-0 left-0 w-1",
            task.completed ? "bg-muted" : style.accentClass,
          )}
        />
        <CardContent className="flex items-center gap-3 py-3">
          <TaskToggle
            id={task.id}
            completed={task.completed}
            accentClass={style.checkboxClass}
          />
          <span
            aria-hidden
            className={cn(
              "size-2 shrink-0 rounded-full transition-colors",
              task.completed ? "bg-muted" : style.accentClass,
            )}
          />
          <span
            className={cn(
              "flex-1 text-sm leading-snug",
              task.completed && "text-muted-foreground line-through",
            )}
          >
            {task.title}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setDraft(task.title);
              setDraftCategory(task.category);
              setEditing(true);
            }}
          >
            <Pencil data-icon="inline-start" />
            Edit
          </Button>
          <DeleteButton
            action={deleteTask}
            args={[task.id]}
            confirmText="Delete this task?"
            variant="ghost"
            size="sm"
          />
        </CardContent>
      </Card>
    </li>
  );
}