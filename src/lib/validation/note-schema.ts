import { z } from "zod";

export const noteFormSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Note is required")
    .max(20_000, "Note is too long"),
});

export type NoteFormValues = z.infer<typeof noteFormSchema>;
export type NoteFormInput = z.input<typeof noteFormSchema>;