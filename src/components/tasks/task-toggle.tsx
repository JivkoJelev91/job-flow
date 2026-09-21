"use client";

import { useTransition } from "react";
import { cn } from "cn";

import { toggleTask } from "@/lib/actions/tasks";

export function TaskToggle({
  id,
  completed,
  accentClass,
}: {
  id: string;
  completed: boolean;
  accentClass: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <input
      type="checkbox"
      checked={completed}
      disabled={isPending}
      onChange={(event) =>
        startTransition(() => toggleTask(id, event.target.checked))
      }
      className={cn(
        "size-4 shrink-0 transition-opacity disabled:opacity-50",
        accentClass,
      )}
      aria-label={completed ? "Mark as incomplete" : "Mark as complete"}
    />
  );
}