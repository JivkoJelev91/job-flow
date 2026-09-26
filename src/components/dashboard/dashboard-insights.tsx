import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "cn";
import type { DashboardInsights as Insights } from "@/lib/data/statistics";
import { statusBar } from "@/lib/status-style";
import {
  applicationStatusLabels,
  workModeLabels,
  type WorkModeValue,
} from "@/lib/validation/application-schema";

function percent(value: number | null): string {
  return value == null ? "—" : `${value}%`;
}

function dayCount(value: number | null): string {
  return value == null ? "—" : `${value} days`;
}

export function DashboardInsights({ insights }: { insights: Insights }) {
  const maxCount = Math.max(
    1,
    ...insights.applicationsPerWeek.map((week) => week.count),
  );

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold tracking-tight">Insights</h2>

      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">
            By status
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
          {insights.applicationsByStatus.map(({ status, count }) => {
            const total =
              insights.applicationsByStatus.reduce((sum, s) => sum + s.count, 0) ||
              1;
            return (
              <div key={status} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-sm">
                  <span>{applicationStatusLabels[status]}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {count}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full transition-[width] duration-500",
                      statusBar[status],
                    )}
                    style={{ width: `${((count / total) * 100).toFixed(0)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card size="sm" className="bg-sky-500/[0.05]">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Response rate
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <span className="text-2xl font-semibold tabular-nums text-sky-600 dark:text-sky-400">
              {percent(insights.responseRate)}
            </span>
            <span className="text-xs text-muted-foreground">
              Share of submitted applications that led to an interview
            </span>
          </CardContent>
        </Card>

        <Card size="sm" className="bg-emerald-500/[0.05]">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Offer rate
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <span className="text-2xl font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
              {percent(insights.offerRate)}
            </span>
            <span className="text-xs text-muted-foreground">
              Share of submitted applications that became offers
            </span>
          </CardContent>
        </Card>

        <Card size="sm" className="bg-violet-500/[0.05]">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Time to interview
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <span className="text-2xl font-semibold tabular-nums text-violet-600 dark:text-violet-400">
              {dayCount(insights.avgDaysToInterview)}
            </span>
            <span className="text-xs text-muted-foreground">
              Average from application to first interview
            </span>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Card size="sm" className="bg-emerald-500/[0.05]">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Interview → offer
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <span className="text-2xl font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
              {percent(insights.interviewToOfferRate)}
            </span>
            <span className="text-xs text-muted-foreground">
              Share of interviewed applications that became offers
            </span>
          </CardContent>
        </Card>

        <Card size="sm" className="bg-rose-500/[0.05]">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Ghosted rate
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <span className="text-2xl font-semibold tabular-nums text-rose-600 dark:text-rose-400">
              {percent(insights.ghostedRate)}
            </span>
            <span className="text-xs text-muted-foreground">
              Submitted applications that never got a response
            </span>
          </CardContent>
        </Card>

        <Card size="sm" className="bg-stone-500/[0.05]">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Closed rate
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <span className="text-2xl font-semibold tabular-nums text-stone-600 dark:text-stone-400">
              {percent(insights.closedRate)}
            </span>
            <span className="text-xs text-muted-foreground">
              Submitted applications that expired without an outcome
            </span>
          </CardContent>
        </Card>

        <Card size="sm" className="bg-amber-500/[0.05]">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              This month
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <span className="text-2xl font-semibold tabular-nums text-amber-600 dark:text-amber-400">
              {insights.applicationsThisMonth}
            </span>
            <span className="text-xs text-muted-foreground">
              Applications added in the current month
            </span>
          </CardContent>
        </Card>

        <Card size="sm" className="bg-sky-500/[0.05]">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Active pipeline
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <span className="text-2xl font-semibold tabular-nums text-sky-600 dark:text-sky-400">
              {insights.activePipeline}
            </span>
            <span className="text-xs text-muted-foreground">
              Applications still in play from applied to offer
            </span>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <Card size="sm" className="bg-violet-500/[0.04] lg:col-span-2">
          <CardHeader>
            <div className="flex items-baseline justify-between gap-2">
              <CardTitle className="text-sm text-muted-foreground">
                Applications per week
              </CardTitle>
              <span className="text-xs text-muted-foreground">
                Average {insights.averagePerWeek}/wk
              </span>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <div className="flex h-28 items-stretch gap-1.5">
              {insights.applicationsPerWeek.map((week) => (
                <div
                  key={week.weekStart.toISOString()}
                  className="flex h-full flex-1 flex-col justify-end gap-1 text-center"
                >
                  {week.count > 0 && (
                    <span className="text-[11px] font-medium tabular-nums text-muted-foreground">
                      {week.count}
                    </span>
                  )}
                  <div
                    className="w-full rounded-t-md bg-sky-400"
                    style={{
                      height: `${((week.count / maxCount) * 100).toFixed(0)}%`,
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-1.5">
              {insights.applicationsPerWeek.map((week) => (
                <span
                  key={week.weekStart.toISOString()}
                  className="flex-1 truncate text-center text-[11px] text-muted-foreground"
                >
                  {week.label}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card size="sm" className="bg-emerald-500/[0.04]">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              By work mode
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2.5">
            {insights.applicationsByWorkMode.map(({ mode, count }) => {
              const total =
                insights.applicationsByWorkMode.reduce((sum, m) => sum + m.count, 0) || 1;
              return (
                <div key={mode} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{workModeLabels[mode as WorkModeValue]}</span>
                    <span className="tabular-nums text-muted-foreground">{count}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${((count / total) * 100).toFixed(0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}