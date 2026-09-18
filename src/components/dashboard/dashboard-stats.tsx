import { BadgeCheck, Bookmark, Briefcase, CalendarDays, Ghost, Send, ThumbsDown } from "lucide-react";
import Link from "next/link";
import { cn } from "cn";
import type { ApplicationStatus } from "@prisma/client";

import { Card, CardContent } from "@/components/ui/card";

export type DashboardStatsData = {
  total: number;
  byStatus: Record<ApplicationStatus, number>;
  notApplied: number;
  ghosted: number;
  applied: number;
  interviews: number;
  offers: number;
  rejected: number;
};

type StatDefinition = {
  key: Exclude<keyof DashboardStatsData, "byStatus">;
  label: string;
  href: string;
  status?: ApplicationStatus;
  icon: typeof Briefcase;
  chipClass: string;
  valueClass: string;
  cardTint: string;
  activeTint: string;
};

const cards: StatDefinition[] = [
  {
    key: "total",
    label: "Total Applications",
    href: "/",
    icon: Briefcase,
    chipClass: "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
    valueClass: "text-violet-600 dark:text-violet-400",
    cardTint: "bg-violet-500/[0.05]",
    activeTint: "bg-violet-500/15",
  },
  {
    key: "notApplied",
    label: "Not Applied",
    href: "/?status=NOT_APPLIED",
    status: "NOT_APPLIED",
    icon: Bookmark,
    chipClass: "bg-lime-100 text-lime-600 dark:bg-lime-500/15 dark:text-lime-400",
    valueClass: "text-lime-600 dark:text-lime-400",
    cardTint: "bg-lime-500/[0.05]",
    activeTint: "bg-lime-500/15",
  },
  {
    key: "applied",
    label: "Applied",
    href: "/?status=APPLIED",
    status: "APPLIED",
    icon: Send,
    chipClass: "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400",
    valueClass: "text-sky-600 dark:text-sky-400",
    cardTint: "bg-sky-500/[0.05]",
    activeTint: "bg-sky-500/15",
  },
  {
    key: "interviews",
    label: "Interviews",
    href: "/?status=INTERVIEW",
    status: "INTERVIEW",
    icon: CalendarDays,
    chipClass: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
    valueClass: "text-amber-600 dark:text-amber-400",
    cardTint: "bg-amber-500/[0.05]",
    activeTint: "bg-amber-500/15",
  },
  {
    key: "offers",
    label: "Offer",
    href: "/?status=OFFER",
    status: "OFFER",
    icon: BadgeCheck,
    chipClass: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
    valueClass: "text-emerald-600 dark:text-emerald-400",
    cardTint: "bg-emerald-500/[0.05]",
    activeTint: "bg-emerald-500/15",
  },
  {
    key: "rejected",
    label: "Rejected",
    href: "/?status=REJECTED",
    status: "REJECTED",
    icon: ThumbsDown,
    chipClass: "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400",
    valueClass: "text-rose-600 dark:text-rose-400",
    cardTint: "bg-rose-500/[0.05]",
    activeTint: "bg-rose-500/15",
  },
  {
    key: "ghosted",
    label: "Ghosted",
    href: "/?status=GHOSTED",
    status: "GHOSTED",
    icon: Ghost,
    chipClass: "bg-gray-100 text-gray-600 dark:bg-gray-500/15 dark:text-gray-400",
    valueClass: "text-gray-600 dark:text-gray-400",
    cardTint: "bg-gray-500/[0.05]",
    activeTint: "bg-gray-500/15",
  },
];

export function DashboardStats({
  stats,
  activeStatus,
}: {
  stats: DashboardStatsData;
  activeStatus?: ApplicationStatus | null;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
      {cards.map((card) => {
        const Icon = card.icon;
        const active = card.status
          ? card.status === activeStatus
          : activeStatus == null;
        return (
          <Link
            key={card.key}
            href={card.href}
            title={card.href === "/" ? "Show all applications" : `Show ${card.label}`}
            className="block h-full transition-transform duration-150 hover:-translate-y-0.5"
          >
            <Card
              size="sm"
              className={cn(
                "h-full bg-card transition-[transform,box-shadow]",
                active
                  ? cn(card.activeTint, "shadow-sm")
                  : cn(card.cardTint, "hover:bg-accent/40"),
              )}
            >
              <CardContent className="flex items-center gap-3">
                <span
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-xl",
                    card.chipClass,
                  )}
                >
                  <Icon className="size-4" />
                </span>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-xs text-muted-foreground">
                    {card.label}
                  </span>
                  <span
                    className={cn(
                      "text-xl font-semibold tabular-nums",
                      card.valueClass,
                    )}
                  >
                    {stats[card.key]}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}