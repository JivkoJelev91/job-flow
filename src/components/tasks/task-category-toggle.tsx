"use client";

import { cn } from "cn";

import {
  taskCategories,
  taskCategoryLabels,
  taskCategoryStyles,
  type TaskCategoryValue,
} from "@/lib/validation/task-schema";

export function TaskCategoryToggle({
  value,
  onChange,
}: {
  value: TaskCategoryValue;
  onChange: (value: TaskCategoryValue) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Category"
      className="flex shrink-0 items-center rounded-lg bg-muted p-0.5"
    >
      {taskCategories.map((category) => {
        const active = category === value;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            aria-pressed={active}
            className={cn(
              "rounded-md px-2.5 py-1 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              active
                ? cn("shadow-xs", taskCategoryStyles[category].chipClass)
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {taskCategoryLabels[category]}
          </button>
        );
      })}
    </div>
  );
}