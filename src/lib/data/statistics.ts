import "server-only";

import type { WorkMode } from "@prisma/client";
import { db } from "@/lib/db";
import {
  buildWhere,
  type ApplicationListQuery,
} from "@/lib/data/applications";
import {
  applicationStatuses,
  type ApplicationStatusValue,
} from "@/lib/validation/application-schema";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const WEEKS_TRACKED = 8;

const weekDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

export type ApplicationsPerWeek = {
  weekStart: Date;
  label: string;
  count: number;
};

export type DashboardInsights = {
  responseRate: number | null;
  offerRate: number | null;
  avgDaysToInterview: number | null;
  applicationsPerWeek: ApplicationsPerWeek[];
  applicationsByWorkMode: { mode: WorkMode; count: number }[];
  interviewToOfferRate: number | null;
  ghostedRate: number | null;
  applicationsThisMonth: number;
  activePipeline: number;
  averagePerWeek: number;
  applicationsByStatus: { status: ApplicationStatusValue; count: number }[];
};

function mondayOf(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
}

export async function getDashboardInsights(
  query: ApplicationListQuery,
): Promise<DashboardInsights> {
  const applications = await db.application.findMany({
    where: buildWhere(query),
    select: {
      appliedAt: true,
      createdAt: true,
      status: true,
      workMode: true,
      interviews: {
        select: { scheduledAt: true },
        orderBy: { scheduledAt: "asc" },
      },
    },
  });

  const submitted = applications.filter(
    (a) => a.status !== "SAVED" && a.status !== "NOT_APPLIED",
  );
  const withInterview = submitted.filter((a) => a.interviews.length > 0);
  const withOffer = submitted.filter((a) => a.status === "OFFER");

  const responseRate =
    submitted.length > 0
      ? Math.round((withInterview.length / submitted.length) * 100)
      : null;
  const offerRate =
    submitted.length > 0
      ? Math.round((withOffer.length / submitted.length) * 100)
      : null;

  let daysToInterviewSum = 0;
  let daysToInterviewCount = 0;
  for (const app of applications) {
    if (!app.appliedAt || app.interviews.length === 0) continue;
    const first = app.interviews[0].scheduledAt;
    const days = (first.getTime() - app.appliedAt.getTime()) / MS_PER_DAY;
    if (days < 0) continue;
    daysToInterviewSum += days;
    daysToInterviewCount += 1;
  }
  const avgDaysToInterview =
    daysToInterviewCount > 0
      ? Math.round(daysToInterviewSum / daysToInterviewCount)
      : null;

  const thisWeek = mondayOf(new Date());
  const applicationsPerWeek: ApplicationsPerWeek[] = [];
  for (let week = WEEKS_TRACKED - 1; week >= 0; week -= 1) {
    const weekStart = new Date(
      thisWeek.getFullYear(),
      thisWeek.getMonth(),
      thisWeek.getDate() - week * 7,
    );
    const weekEnd = new Date(
      weekStart.getFullYear(),
      weekStart.getMonth(),
      weekStart.getDate() + 7,
    );
    const count = applications.filter(
      (a) => a.appliedAt && a.appliedAt >= weekStart && a.appliedAt < weekEnd,
    ).length;
    applicationsPerWeek.push({
      weekStart,
      label: weekDateFormatter.format(weekStart),
      count,
    });
  }

  const workModeCounts = { REMOTE: 0, HYBRID: 0, OFFICE: 0, UNKNOWN: 0 };
  for (const app of applications) workModeCounts[app.workMode] += 1;
  const applicationsByWorkMode = (
    ["REMOTE", "HYBRID", "OFFICE", "UNKNOWN"] as const
  ).map((mode) => ({ mode: mode as WorkMode, count: workModeCounts[mode] }));

  const interviewed = submitted.filter((a) => a.interviews.length > 0);
  const interviewToOfferRate =
    interviewed.length > 0
      ? Math.round(
          (interviewed.filter((a) => a.status === "OFFER").length /
            interviewed.length) *
            100,
        )
      : null;

  const ghostedRate =
    submitted.length > 0
      ? Math.round(
          (submitted.filter((a) => a.status === "GHOSTED").length /
            submitted.length) *
            100,
        )
      : null;

  const closedStatuses = ["SAVED", "REJECTED", "WITHDRAWN", "GHOSTED"];
  const activePipeline = applications.filter(
    (a) => !closedStatuses.includes(a.status),
  ).length;

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const applicationsThisMonth = applications.filter(
    (a) => a.createdAt >= monthStart,
  ).length;

  const averagePerWeek = Math.round(
    applicationsPerWeek.reduce((sum, week) => sum + week.count, 0) /
      WEEKS_TRACKED,
  );

  const statusCounts = new Map<ApplicationStatusValue, number>();
  for (const status of applicationStatuses) statusCounts.set(status, 0);
  for (const app of applications) {
    statusCounts.set(
      app.status,
      (statusCounts.get(app.status) ?? 0) + 1,
    );
  }
  const applicationsByStatus = applicationStatuses.map((status) => ({
    status,
    count: statusCounts.get(status) ?? 0,
  }));

  return {
    responseRate,
    offerRate,
    avgDaysToInterview,
    applicationsPerWeek,
    applicationsByWorkMode,
    interviewToOfferRate,
    ghostedRate,
    applicationsThisMonth,
    activePipeline,
    averagePerWeek,
    applicationsByStatus,
  };
}