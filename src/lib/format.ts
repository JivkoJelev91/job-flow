import type { InterviewType, WorkMode } from "@prisma/client";
import { interviewTypeLabels } from "@/lib/validation/interview-schema";
import { workModeLabels } from "@/lib/validation/application-schema";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function formatDate(date: Date | null | undefined): string {
  return date ? dateFormatter.format(date) : "—";
}

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export function formatDateTime(date: Date | null | undefined): string {
  return date ? dateTimeFormatter.format(date) : "—";
}

export function formatWorkMode(mode: WorkMode): string {
  return mode === "UNKNOWN" ? "—" : workModeLabels[mode];
}

export function formatInterviewType(type: InterviewType): string {
  return interviewTypeLabels[type];
}

const salaryFormatters = new Map<string, Intl.NumberFormat>();

function salaryFormatter(currency: string): Intl.NumberFormat {
  let formatter = salaryFormatters.get(currency);
  if (!formatter) {
    formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: 0,
    });
    salaryFormatters.set(currency, formatter);
  }
  return formatter;
}

export function formatSalary(
  min?: number | null,
  max?: number | null,
  currency?: string | null,
): string {
  if (min == null && max == null) return "—";
  const code = currency ?? "USD";
  const format = (value: number) => salaryFormatter(code).format(value);
  if (min != null && max != null) return `${format(min)}–${format(max)}`;
  if (min != null) return `from ${format(min)}`;
  return `up to ${format(max!)}`;
}

export function formatVacation(value?: number | null): string {
  return value == null ? "—" : `${value} days`;
}