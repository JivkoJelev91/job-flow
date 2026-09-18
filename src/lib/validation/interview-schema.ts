import { z } from "zod";

export const interviewTypes = [
  "PHONE",
  "VIDEO",
  "ONSITE",
  "TECHNICAL",
  "HR",
  "OTHER",
] as const;
export type InterviewTypeValue = (typeof interviewTypes)[number];

export const interviewTypeLabels: Record<InterviewTypeValue, string> = {
  PHONE: "Phone",
  VIDEO: "Video",
  ONSITE: "Onsite",
  TECHNICAL: "Technical",
  HR: "HR",
  OTHER: "Other",
};

export const interviewFormSchema = z.object({
  scheduledAt: z
    .string()
    .trim()
    .min(1, "Date and time are required")
    .refine(
      (value) => !Number.isNaN(Date.parse(value)),
      "Enter a valid date and time",
    ),
  type: z.enum(interviewTypes).default("VIDEO"),
  location: z.string().trim().max(200, "At most 200 characters"),
  notes: z.string().trim().max(20_000, "Notes are too long"),
  result: z.string().trim().max(200, "At most 200 characters"),
});

export type InterviewFormValues = z.infer<typeof interviewFormSchema>;
export type InterviewFormInput = z.input<typeof interviewFormSchema>;

export function parseInterviewDateTime(value: string): Date {
  return new Date(value);
}

export function toDateTimeLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}