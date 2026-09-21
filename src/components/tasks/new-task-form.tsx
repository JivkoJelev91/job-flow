"use client";

import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { TaskCategoryToggle } from "@/components/tasks/task-category-toggle";
import { createTask } from "@/lib/actions/tasks";
import {
  taskFormSchema,
  type TaskFormInput,
  type TaskFormValues,
} from "@/lib/validation/task-schema";

export function NewTaskForm() {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormInput, unknown, TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: { title: "", category: "NON_CODING" },
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
          <div className="flex flex-wrap items-center gap-2">
            <Input
              placeholder="Add a task that moves your job search forward…"
              autoComplete="off"
              aria-invalid={!!errors.title}
              className="min-w-40 flex-1"
              {...register("title")}
            />
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <TaskCategoryToggle
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
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