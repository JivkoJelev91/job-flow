import type { ApplicationStatus } from "@prisma/client";

export const statusDot: Record<ApplicationStatus, string> = {
  NOT_APPLIED: "bg-lime-600",
  APPLIED: "bg-sky-600",
  INTERVIEW: "bg-violet-600",
  OFFER: "bg-emerald-600",
  REJECTED: "bg-rose-600",
  GHOSTED: "bg-gray-400",
  CLOSED: "bg-stone-600",
};

export const statusBar: Record<ApplicationStatus, string> = {
  NOT_APPLIED: "bg-lime-500",
  APPLIED: "bg-sky-500",
  INTERVIEW: "bg-violet-500",
  OFFER: "bg-emerald-500",
  REJECTED: "bg-rose-500",
  GHOSTED: "bg-gray-300",
  CLOSED: "bg-stone-500",
};

export const statusPill: Record<ApplicationStatus, string> = {
  NOT_APPLIED: "bg-lime-500/10 text-lime-700 dark:text-lime-400",
  APPLIED: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
  INTERVIEW: "bg-violet-500/10 text-violet-700 dark:text-violet-400",
  OFFER: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  REJECTED: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
  GHOSTED: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
  CLOSED: "bg-stone-500/10 text-stone-700 dark:text-stone-400",
};

export const statusRowTint: Record<ApplicationStatus, string> = {
  NOT_APPLIED: "bg-lime-500/[0.05]",
  APPLIED: "bg-sky-500/[0.06]",
  INTERVIEW: "bg-violet-500/[0.06]",
  OFFER: "bg-emerald-500/[0.06]",
  REJECTED: "bg-rose-500/[0.055]",
  GHOSTED: "bg-gray-500/[0.035]",
  CLOSED: "bg-stone-500/[0.04]",
};