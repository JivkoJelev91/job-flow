import "server-only";

import type {
  ApplicationStatus,
  EmploymentType,
  Prisma,
  WorkMode,
} from "@prisma/client";
import { db } from "@/lib/db";
import {
  applicationStatuses,
  employmentTypes,
  workModes,
} from "@/lib/validation/application-schema";

const sortByOptions = [
  "appliedAt",
  "interview",
  "salary",
  "vacation",
  "company",
  "position",
  "status",
  "workMode",
  "nextAction",
  "updatedAt",
] as const;
export type SortBy = (typeof sortByOptions)[number];

export type ApplicationListInput = {
  status?: string;
  workMode?: string;
  employmentType?: string;
  companyId?: string;
  appliedFrom?: string;
  appliedTo?: string;
  hasInterview: boolean;
  hasNextAction: boolean;
  search: string;
  sort: string;
  order: string;
};

export type ApplicationListQuery = {
  status?: ApplicationStatus;
  workMode?: WorkMode;
  employmentType?: EmploymentType;
  companyId?: string;
  appliedFrom?: Date;
  appliedTo?: Date;
  hasInterview: boolean;
  hasNextAction: boolean;
  search: string;
  sortBy: SortBy;
  sortDir: "asc" | "desc";
};

function firstParam(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function isDateString(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return !Number.isNaN(new Date(`${value}T00:00:00`).getTime());
}

export function parseApplicationListInput(
  searchParams: Record<string, string | string[] | undefined>,
): ApplicationListInput {
  const get = (key: keyof ApplicationListInput) => firstParam(searchParams[key]);
  return {
    status: get("status"),
    workMode: get("workMode"),
    employmentType: get("employmentType"),
    companyId: get("companyId"),
    appliedFrom: get("appliedFrom"),
    appliedTo: get("appliedTo"),
    hasInterview: searchParams.hasInterview != null,
    hasNextAction: searchParams.hasNextAction != null,
    search: firstParam(searchParams["q"]) ?? "",
    sort: get("sort") ?? "appliedAt",
    order: get("order") ?? "desc",
  };
}

export function buildApplicationQuery(
  input: ApplicationListInput,
): ApplicationListQuery {
  const status = applicationStatuses.includes(input.status as never)
    ? (input.status as ApplicationStatus)
    : undefined;
  const workMode = workModes.includes(input.workMode as never)
    ? (input.workMode as WorkMode)
    : undefined;
  const employmentType = employmentTypes.includes(input.employmentType as never)
    ? (input.employmentType as EmploymentType)
    : undefined;
  const sortBy = sortByOptions.includes(input.sort as never)
    ? (input.sort as SortBy)
    : "appliedAt";

  return {
    status,
    workMode,
    employmentType,
    companyId: input.companyId || undefined,
    appliedFrom:
      input.appliedFrom && isDateString(input.appliedFrom)
        ? new Date(`${input.appliedFrom}T00:00:00`)
        : undefined,
    appliedTo:
      input.appliedTo && isDateString(input.appliedTo)
        ? new Date(`${input.appliedTo}T23:59:59.999`)
        : undefined,
    hasInterview: input.hasInterview,
    hasNextAction: input.hasNextAction,
    search: input.search.trim(),
    sortBy,
    sortDir: input.order === "asc" ? "asc" : "desc",
  };
}

export function buildWhere(
  query: ApplicationListQuery,
): Prisma.ApplicationWhereInput {
  const where: Prisma.ApplicationWhereInput = {};
  if (query.status) where.status = query.status;
  if (query.workMode) where.workMode = query.workMode;
  if (query.employmentType) where.employmentType = query.employmentType;
  if (query.companyId) where.companyId = query.companyId;
  if (query.appliedFrom || query.appliedTo) {
    where.appliedAt = {
      ...(query.appliedFrom ? { gte: query.appliedFrom } : {}),
      ...(query.appliedTo ? { lte: query.appliedTo } : {}),
    };
  }
  if (query.hasInterview) where.interviews = { some: {} };

  const or: Prisma.ApplicationWhereInput[] = [];
  if (query.hasNextAction) {
    or.push(
      { nextAction: { not: null } },
      { nextActionDate: { not: null } },
    );
  }
  if (query.search) {
    or.push(
      { company: { name: { contains: query.search, mode: "insensitive" } } },
      { position: { contains: query.search, mode: "insensitive" } },
      { location: { contains: query.search, mode: "insensitive" } },
      { jobDescription: { contains: query.search, mode: "insensitive" } },
      {
        notes: {
          some: { content: { contains: query.search, mode: "insensitive" } },
        },
      },
    );
  }
  if (or.length > 0) where.OR = or;
  return where;
}

function buildOrderBy(
  query: ApplicationListQuery,
): Prisma.ApplicationOrderByWithRelationInput[] {
  const sort = query.sortDir;
  if (query.sortBy === "company") return [{ company: { name: sort } }];
  if (query.sortBy === "salary")
    return [{ salaryMax: { sort, nulls: "last" } }];
  if (query.sortBy === "vacation")
    return [{ vacationDays: { sort, nulls: "last" } }];
  if (query.sortBy === "position") return [{ position: sort }];
  if (query.sortBy === "status") return [{ status: sort }];
  if (query.sortBy === "workMode") return [{ workMode: sort }];
  if (query.sortBy === "nextAction")
    return [{ nextActionDate: { sort, nulls: "last" } }];
  if (query.sortBy === "updatedAt") return [{ updatedAt: sort }];
  if (query.sortBy === "interview") return [{ appliedAt: "desc" }];
  return [{ appliedAt: { sort, nulls: "last" } }, { createdAt: sort }];
}

type ApplicationWithInterviews = Prisma.ApplicationGetPayload<{
  include: { company: true; interviews: true };
}>;

export function nextInterviewAt(
  interviews: ApplicationWithInterviews["interviews"],
): Date | null {
  const now = new Date();
  let next: Date | null = null;
  for (const interview of interviews) {
    if (interview.scheduledAt >= now && (!next || interview.scheduledAt < next)) {
      next = interview.scheduledAt;
    }
  }
  return next;
}

export async function getApplications(query: ApplicationListQuery) {
  const where = buildWhere(query);
  const applications = await db.application.findMany({
    where,
    include: {
      company: true,
      interviews: true,
    },
    orderBy: buildOrderBy(query),
  });

  if (query.sortBy === "interview") {
    const sort = query.sortDir;
    applications.sort((a, b) => {
      const aAt = nextInterviewAt(a.interviews);
      const bAt = nextInterviewAt(b.interviews);
      if (aAt && bAt) {
        return sort === "asc" ? aAt.getTime() - bAt.getTime() : bAt.getTime() - aAt.getTime();
      }
      if (aAt) return -1;
      if (bAt) return 1;
      return 0;
    });
  }

  if (query.sortBy === "status") {
    const sort = query.sortDir;
    applications.sort((a, b) =>
      sort === "asc"
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status),
    );
  }

  return applications;
}

export function isDateDueOrOverdue(date: Date): boolean {
  const tomorrow = new Date();
  tomorrow.setHours(0, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return date.getTime() < tomorrow.getTime();
}

const APPROACHING_INTERVIEW_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

const attentionExcludedStatuses: ApplicationStatus[] = [
  "REJECTED",
  "GHOSTED",
  "CLOSED",
];

export type NeedsAttentionApplication = ApplicationWithInterviews & {
  nextInterview: Date | null;
};

export async function getNeedsAttention(): Promise<
  NeedsAttentionApplication[]
> {
  const applications = await db.application.findMany({
    where: { status: { notIn: attentionExcludedStatuses } },
    include: { company: true, interviews: true },
  });

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000 - 1);
  const interviewWindowEnd = new Date(now.getTime() + APPROACHING_INTERVIEW_WINDOW_MS);

  const items: NeedsAttentionApplication[] = [];
  for (const application of applications) {
    const nextInterview = nextInterviewAt(application.interviews);
    const actionDue =
      application.nextActionDate != null && application.nextActionDate <= endOfToday;
    const interviewApproaching =
      nextInterview != null && nextInterview <= interviewWindowEnd;
    if (!actionDue && !interviewApproaching) continue;
    items.push({ ...application, nextInterview });
  }

  items.sort((a, b) => {
    const aDue = a.nextActionDate?.getTime() ?? Number.POSITIVE_INFINITY;
    const bDue = b.nextActionDate?.getTime() ?? Number.POSITIVE_INFINITY;
    if (aDue !== bDue) return aDue - bDue;
    const aNext = a.nextInterview?.getTime() ?? Number.POSITIVE_INFINITY;
    const bNext = b.nextInterview?.getTime() ?? Number.POSITIVE_INFINITY;
    return aNext - bNext;
  });

  return items;
}

export function getApplicationById(id: string) {
  return db.application.findUnique({
    where: { id },
    include: {
      company: true,
      interviews: {
        orderBy: { scheduledAt: "asc" },
      },
      notes: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export async function getApplicationStats(query: ApplicationListQuery) {
  const grouped = await db.application.groupBy({
    by: ["status"],
    where: buildWhere(query),
    _count: { _all: true },
  });

  const countFor = (status: ApplicationStatus) =>
    grouped.find((group) => group.status === status)?._count._all ?? 0;

  const byStatus = Object.fromEntries(
    applicationStatuses.map((status) => {
      const value = status as ApplicationStatus;
      return [value, countFor(value)];
    }),
  ) as Record<ApplicationStatus, number>;

  return {
    total: grouped.reduce((sum, group) => sum + group._count._all, 0),
    byStatus,
    notApplied: countFor("NOT_APPLIED"),
    ghosted: countFor("GHOSTED"),
    applied: countFor("APPLIED"),
    interviews: countFor("INTERVIEW"),
    offers: countFor("OFFER"),
    rejected: countFor("REJECTED"),
    closed: countFor("CLOSED"),
  };
}