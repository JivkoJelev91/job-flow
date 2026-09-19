import { z } from "zod";

import { isValidUrl, normalizeUrl } from "@/lib/url";

export const applicationStatuses = [
  "NOT_APPLIED",
  "APPLIED",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
  "GHOSTED",
  "CLOSED",
] as const;
export type ApplicationStatusValue = (typeof applicationStatuses)[number];

export const workModes = ["REMOTE", "HYBRID", "OFFICE", "UNKNOWN"] as const;
export type WorkModeValue = (typeof workModes)[number];

export const employmentTypes = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "FREELANCE",
  "INTERNSHIP",
  "UNKNOWN",
] as const;
export type EmploymentTypeValue = (typeof employmentTypes)[number];

export const applicationStatusLabels: Record<ApplicationStatusValue, string> = {
  NOT_APPLIED: "Not Applied",
  APPLIED: "Applied",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
  GHOSTED: "Ghosted",
  CLOSED: "Closed",
};

export const workModeLabels: Record<WorkModeValue, string> = {
  REMOTE: "Remote",
  HYBRID: "Hybrid",
  OFFICE: "Office",
  UNKNOWN: "Unknown",
};

export const employmentTypeLabels: Record<EmploymentTypeValue, string> = {
  FULL_TIME: "Full time",
  PART_TIME: "Part time",
  CONTRACT: "Contract",
  FREELANCE: "Freelance",
  INTERNSHIP: "Internship",
  UNKNOWN: "Unknown",
};

export const currencySuggestions = [
  "USD",
  "EUR",
  "GBP",
  "PLN",
  "CAD",
  "AUD",
  "CHF",
  "JPY",
  "INR",
  "UAH",
];

function isValidDateString(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return !Number.isNaN(new Date(`${value}T12:00:00`).getTime());
}

const dateOrEmpty = z
  .string()
  .trim()
  .refine((value) => value === "" || isValidDateString(value), "Enter a valid date");

const salaryOrEmpty = z
  .string()
  .trim()
  .regex(/^\d{0,7}$/, "Whole number up to 1,000,000");

const vacationDaysOrEmpty = z
  .string()
  .trim()
  .regex(/^\d{0,3}$/, "Whole number up to 999");

const urlOrEmpty = z
  .string()
  .trim()
  .max(500, "URL is too long")
  .transform(normalizeUrl)
  .refine(
    (value) => value === "" || isValidUrl(value),
    "Enter a valid URL, e.g. https://example.com/jobs/123",
  );

const currency = z
  .string()
  .trim()
  .toUpperCase()
  .max(3, "At most 3 letters")
  .refine((value) => value === "" || /^[A-Z]{3}$/.test(value), "Use a 3-letter code (e.g. USD)")
  .default("EUR");

export const applicationFormSchema = z
  .object({
    companyName: z
      .string()
      .trim()
      .min(1, "Company name is required")
      .max(200, "At most 200 characters"),
    position: z
      .string()
      .trim()
      .min(1, "Position is required")
      .max(200, "At most 200 characters"),
    jobUrl: urlOrEmpty,
    jobDescription: z.string().trim().max(50_000, "Description is too long"),
    salaryMin: salaryOrEmpty,
    salaryMax: salaryOrEmpty,
    currency,
    vacationDays: vacationDaysOrEmpty,
    location: z.string().trim().max(200, "At most 200 characters"),
    workMode: z.enum(workModes).default("UNKNOWN"),
    employmentType: z.enum(employmentTypes).default("FULL_TIME"),
    status: z.enum(applicationStatuses).default("NOT_APPLIED"),
    appliedAt: dateOrEmpty,
    nextAction: z.string().trim().max(300, "At most 300 characters"),
    nextActionDate: dateOrEmpty,
    notes: z.string().trim().max(20_000, "Notes are too long"),
  })
  .superRefine((data, context) => {
    if (
      data.salaryMin &&
      data.salaryMax &&
      Number(data.salaryMax) < Number(data.salaryMin)
    ) {
      context.addIssue({
        code: "custom",
        path: ["salaryMax"],
        message: "Max salary can't be lower than min salary",
      });
    }
  });

export type ApplicationFormValues = z.infer<typeof applicationFormSchema>;
export type ApplicationFormInput = z.input<typeof applicationFormSchema>;

export function parseDateOnly(value: string): Date | null {
  if (!value) return null;
  return new Date(`${value}T12:00:00`);
}

export function toDateInput(date: Date | null | undefined): string {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}