import Link from "next/link";
import { cn } from "cn";

import { ApplicationStatusBadge } from "@/components/applications/application-status-badge";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate, formatDateTime } from "@/lib/format";
import {
  isDateDueOrOverdue,
  type NeedsAttentionApplication,
} from "@/lib/data/applications";

function dayLabel(date: Date): string {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const days = Math.round(
    (target.getTime() - startOfToday.getTime()) / (24 * 60 * 60 * 1000),
  );
  if (days === 0) return "today";
  if (days === 1) return "tomorrow";
  if (days < 0) return `${-days} day${-days === 1 ? "" : "s"} overdue`;
  return `in ${days} days`;
}

export function NeedsAttention({
  items,
}: {
  items: NeedsAttentionApplication[];
}) {
  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
        <span aria-hidden="true" className="size-2 rounded-full bg-amber-500" />
        Needs Attention
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
          {items.length}
        </span>
      </h2>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const overDue =
            item.nextActionDate != null &&
            isDateDueOrOverdue(item.nextActionDate);

          return (
            <li key={item.id}>
              <Card
                  size="sm"
                  className={cn(
                    "h-full",
                    overDue
                      ? "bg-gradient-to-br from-rose-500/10 via-card to-transparent"
                      : "bg-gradient-to-br from-sky-500/10 via-card to-transparent",
                  )}
                >
                <CardHeader>
                  <CardTitle>
                    <Link
                      href={`/applications/${item.id}`}
                      className="underline-offset-4 hover:underline"
                    >
                      {item.position}
                    </Link>
                    <span className="text-sm font-normal text-muted-foreground">
                      {" "}
                      · {item.company.name}
                    </span>
                  </CardTitle>
                  <CardAction>
                    <ApplicationStatusBadge status={item.status} />
                  </CardAction>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  {item.nextActionDate && (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs text-muted-foreground">
                        Next action
                      </span>
                      <span
                        className={
                          overDue
                            ? "font-medium text-destructive"
                            : "font-medium"
                        }
                      >
                        {item.nextAction || "Follow up"}
                      </span>
                      <span
                        className={
                          overDue
                            ? "text-xs font-medium text-destructive"
                            : "text-xs text-muted-foreground"
                        }
                      >
                        {formatDate(item.nextActionDate)} · {dayLabel(item.nextActionDate)}
                      </span>
                    </div>
                  )}
                  {item.nextInterview && (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs text-muted-foreground">
                        Interview
                      </span>
                      <span className="font-medium">
                        {formatDateTime(item.nextInterview)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {dayLabel(item.nextInterview)}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}