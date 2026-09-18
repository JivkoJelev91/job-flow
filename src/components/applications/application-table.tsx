import type { Prisma } from "@prisma/client";
import Link from "next/link";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ApplicationStatusBadge } from "@/components/applications/application-status-badge";
import { DeleteButton } from "@/components/ui/delete-button";
import { Button } from "@/components/ui/button";
import { deleteApplication } from "@/lib/actions/applications";
import { cn } from "cn";
import { statusRowTint } from "@/lib/status-style";
import { formatDate, formatSalary, formatVacation, formatWorkMode } from "@/lib/format";
import {
  nextInterviewAt,
  type SortBy,
} from "@/lib/data/applications";

export type ApplicationRow = Prisma.ApplicationGetPayload<{
  include: { company: true; interviews: true };
}>;

type SearchParams = Record<string, string | string[] | undefined>;

const dateSortKeys: SortBy[] = ["appliedAt", "interview", "nextAction"];

function sortHref(
  searchParams: SearchParams,
  sort: SortBy,
  order: "asc" | "desc",
): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (value == null) continue;
    for (const item of Array.isArray(value) ? value : [value]) {
      if (item !== "") params.append(key, item);
    }
  }
  if (sort !== "appliedAt" || order !== "desc") {
    params.set("sort", sort);
    params.set("order", order);
  }
  const query = params.toString();
  return query ? `/?${query}` : "/";
}

function SortableHeader({
  label,
  sortKey,
  sortBy,
  sortDir,
  searchParams,
}: {
  label: string;
  sortKey: SortBy;
  sortBy: SortBy;
  sortDir: "asc" | "desc";
  searchParams: SearchParams;
}) {
  const active = sortBy === sortKey;
  const nextOrder: "asc" | "desc" = active
    ? sortDir === "asc"
      ? "desc"
      : "asc"
    : dateSortKeys.includes(sortKey)
      ? "desc"
      : "asc";
  const Arrow = active
    ? sortDir === "asc"
      ? ArrowUp
      : ArrowDown
    : ChevronsUpDown;

  return (
    <Link
      href={sortHref(searchParams, sortKey, nextOrder)}
      className={cn(
        "group/sort inline-flex items-center gap-1 leading-none hover:text-foreground",
        active && "text-primary",
      )}
      title={
        active
          ? `Sorted by ${label} ${
              sortDir === "asc" ? "ascending" : "descending"
            }`
          : `Sort by ${label}`
      }
    >
      {label}
      <Arrow
        className={cn(
          "size-3.5 shrink-0",
          active
            ? undefined
            : "text-muted-foreground/50 opacity-0 transition-opacity group-hover/sort:opacity-100",
        )}
      />
    </Link>
  );
}

export function ApplicationTable({
  applications,
  sortBy,
  sortDir,
  searchParams,
}: {
  applications: ApplicationRow[];
  sortBy: SortBy;
  sortDir: "asc" | "desc";
  searchParams: SearchParams;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/40">
          <TableHead>
            <SortableHeader
              label="Company"
              sortKey="company"
              sortBy={sortBy}
              sortDir={sortDir}
              searchParams={searchParams}
            />
          </TableHead>
          <TableHead>
            <SortableHeader
              label="Position"
              sortKey="position"
              sortBy={sortBy}
              sortDir={sortDir}
              searchParams={searchParams}
            />
          </TableHead>
          <TableHead>
            <SortableHeader
              label="Status"
              sortKey="status"
              sortBy={sortBy}
              sortDir={sortDir}
              searchParams={searchParams}
            />
          </TableHead>
          <TableHead>
            <SortableHeader
              label="Work Mode"
              sortKey="workMode"
              sortBy={sortBy}
              sortDir={sortDir}
              searchParams={searchParams}
            />
          </TableHead>
          <TableHead>
            <SortableHeader
              label="Salary"
              sortKey="salary"
              sortBy={sortBy}
              sortDir={sortDir}
              searchParams={searchParams}
            />
          </TableHead>
          <TableHead>
            <SortableHeader
              label="Vacation"
              sortKey="vacation"
              sortBy={sortBy}
              sortDir={sortDir}
              searchParams={searchParams}
            />
          </TableHead>
          <TableHead>
            <SortableHeader
              label="Applied"
              sortKey="appliedAt"
              sortBy={sortBy}
              sortDir={sortDir}
              searchParams={searchParams}
            />
          </TableHead>
          <TableHead>
            <SortableHeader
              label="Interview"
              sortKey="interview"
              sortBy={sortBy}
              sortDir={sortDir}
              searchParams={searchParams}
            />
          </TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={9}
              className="py-12 text-center"
            >
              <div className="flex flex-col items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  No applications yet.
                </span>
                <Button
                  render={<Link href="/applications/new" />}
                  variant="default"
                  size="sm"
                >
                  Add your first application
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ) : (
          applications.map((application) => (
            <TableRow
              key={application.id}
              className={cn("group transition-colors", statusRowTint[application.status])}
            >
              <TableCell className="font-medium">
                <Link
                  href={`/applications/${application.id}`}
                  className="text-primary underline-offset-4 hover:underline"
                >
                  {application.company.name}
                </Link>
              </TableCell>
              <TableCell>
                <Link
                  href={`/applications/${application.id}`}
                  className="underline-offset-4 hover:underline"
                >
                  {application.position}
                </Link>
              </TableCell>
              <TableCell>
                <ApplicationStatusBadge status={application.status} />
              </TableCell>
              <TableCell>{formatWorkMode(application.workMode)}</TableCell>
              <TableCell>
                {formatSalary(
                  application.salaryMin,
                  application.salaryMax,
                  application.currency,
                )}
              </TableCell>
              <TableCell>{formatVacation(application.vacationDays)}</TableCell>
              <TableCell>{formatDate(application.appliedAt)}</TableCell>
              <TableCell>{formatDate(nextInterviewAt(application.interviews))}</TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1 opacity-60 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
                  <Button
                    render={
                      <Link href={`/applications/${application.id}/edit`} />
                    }
                    variant="ghost"
                    size="sm"
                  >
                    Edit
                  </Button>
                  <DeleteButton
                      action={deleteApplication}
                      args={[application.id]}
                      confirmText="Delete this application? This cannot be undone."
                      variant="ghost"
                      size="sm"
                    />
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}