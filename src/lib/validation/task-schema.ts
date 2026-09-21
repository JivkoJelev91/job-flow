import { z } from "zod";

export const taskCategories = ["CODING", "LEARNING", "NON_CODING"] as const;
export type TaskCategoryValue = (typeof taskCategories)[number];

export const taskCategoryLabels: Record<TaskCategoryValue, string> = {
  CODING: "Coding",
  LEARNING: "Learning",
  NON_CODING: "Job Prep",
};

export type TaskCategoryStyle = {
  chipClass: string;
  labelClass: string;
  cardTint: string;
  accentClass: string;
  checkboxClass: string;
};

export const taskCategoryStyles: Record<
  TaskCategoryValue,
  TaskCategoryStyle
> = {
  CODING: {
    chipClass:
      "bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400",
    labelClass: "text-violet-700 dark:text-violet-400",
    cardTint: "bg-violet-500/[0.06]",
    accentClass: "bg-violet-500",
    checkboxClass: "accent-violet-600",
  },
  LEARNING: {
    chipClass:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
    labelClass: "text-emerald-700 dark:text-emerald-400",
    cardTint: "bg-emerald-500/[0.06]",
    accentClass: "bg-emerald-500",
    checkboxClass: "accent-emerald-600",
  },
  NON_CODING: {
    chipClass:
      "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
    labelClass: "text-amber-700 dark:text-amber-400",
    cardTint: "bg-amber-500/[0.06]",
    accentClass: "bg-amber-500",
    checkboxClass: "accent-amber-600",
  },
};

export const taskFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Task is required")
    .max(500, "Task is too long"),
  category: z.enum(taskCategories),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;
export type TaskFormInput = z.input<typeof taskFormSchema>;