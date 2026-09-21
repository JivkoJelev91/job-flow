import { z } from "zod";

export const taskFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Task is required")
    .max(500, "Task is too long"),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;
export type TaskFormInput = z.input<typeof taskFormSchema>;