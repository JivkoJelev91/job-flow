"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus } from "lucide-react";
import { cn } from "cn";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { DeleteButton } from "@/components/ui/delete-button";

import {
  createTask,
  deleteTask,
  toggleTask,
  updateTask,
} from "@/lib/actions/tasks";
import {
  taskFormSchema,
  type TaskFormInput,
  type TaskFormValues,
} from "@/lib/validation/task-schema";
import type { TaskSummary } from "@/lib/data/tasks";

export function TasksSection({ tasks }: { tasks: TaskSummary[] }) {
  return (
    <div className="flex flex-col gap-3">
      <NewTaskForm />

      {tasks.length > 0 && (
        <ol className="flex flex-col gap-2">
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
        </ol>
      )}

      {tasks.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-1 py-8 text-center">
            <p className="text-sm font-medium">No tasks yet</p>
            <p className="text-sm text-muted-foreground">
              Add your first task above to start moving your job search forward.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function NewTaskForm() {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormInput, unknown, TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: { title: "" },
  });

  const onSubmit = (values: TaskFormValues) => {
    setServerError(null);
    startTransition(async () => {
      const result = await createTask(values);
      if (result?.error) {
        setServerError(result.error);
      } else {
        reset();
      }
    });
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          {serverError && (
            <p className="text-sm font-normal text-destructive">
              {serverError}
            </p>
          )}
          <div className="flex items-center gap-2">
            <Input
              placeholder="Add a task that moves your job search forward…"
              autoComplete="off"
              aria-invalid={!!errors.title}
              {...register("title")}
            />
            <Button type="submit" disabled={isPending}>
              <Plus data-icon="inline-start" />
              {isPending ? "Adding…" : "Add"}
            </Button>
          </div>
          <FieldError>{errors.title?.message}</FieldError>
        </form>
      </CardContent>
    </Card>
  );
}

function TaskRow({ task }: { task: TaskSummary }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    setError(null);
    startTransition(async () => {
      const result = await updateTask(task.id, { title: draft });
      if (result?.error) {
        setError(result.error);
        return;
      }
      setEditing(false);
    });
  };

  if (editing) {
    return (
      <Card>
        <CardContent>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleSave();
            }}
            className="flex flex-col gap-2"
          >
            {error && (
              <p className="text-sm font-normal text-destructive">{error}</p>
            )}
            <div className="flex items-center gap-2">
              <Input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                maxLength={500}
                autoFocus
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
    );
  }

  return (
    <Card>
      <CardContent className="flex items-center gap-3 py-3">
        <ToggleTask id={task.id} completed={task.completed} />
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
  );
}

function ToggleTask({ id, completed }: { id: string; completed: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <input
      type="checkbox"
      checked={completed}
      disabled={isPending}
      onChange={(event) =>
        startTransition(() => toggleTask(id, event.target.checked))
      }
      className="size-4 shrink-0 accent-violet-600 transition-opacity disabled:opacity-50"
      aria-label={completed ? "Mark as incomplete" : "Mark as complete"}
    />
  );
}