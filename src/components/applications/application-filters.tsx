"use client";

import { useState, type ChangeEvent } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "cn";

import type { ApplicationListInput } from "@/lib/data/applications";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  applicationStatusLabels,
  applicationStatuses,
  employmentTypeLabels,
  employmentTypes,
  workModeLabels,
  workModes,
} from "@/lib/validation/application-schema";

const selectClass =
  "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30";

function submitOnChange(
  event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
) {
  event.currentTarget.form?.requestSubmit();
}

function activeFilterCount(input: ApplicationListInput): number {
  let count = 0;
  if (input.status) count += 1;
  if (input.workMode) count += 1;
  if (input.employmentType) count += 1;
  if (input.companyId) count += 1;
  if (input.appliedFrom) count += 1;
  if (input.appliedTo) count += 1;
  if (input.hasInterview) count += 1;
  if (input.hasNextAction) count += 1;
  if (input.search) count += 1;
  return count;
}

export function ApplicationFilters({
  companies,
  input,
}: {
  companies: { id: string; name: string }[];
  input: ApplicationListInput;
}) {
  const [open, setOpen] = useState(false);
  const activeCount = activeFilterCount(input);
  const panelId = "application-filters";
  const filterKey = JSON.stringify([
    input.status,
    input.workMode,
    input.employmentType,
    input.companyId,
    input.appliedFrom,
    input.appliedTo,
    input.hasInterview,
    input.hasNextAction,
    input.search,
  ]);

  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        variant="default"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="w-max"
      >
        <ChevronDown
          data-icon="inline-start"
          className={cn(
            "transition-transform duration-200",
            open && "rotate-180",
          )}
        />
        Filters
        {activeCount > 0 && (
          <span className="ml-1 inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-medium tabular-nums text-primary-foreground">
            {activeCount}
          </span>
        )}
      </Button>

      <form
        key={filterKey}
        id={panelId}
        method="get"
        action="/"
        className={cn(
          "grid transition-all duration-300 ease-out",
          open
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-3 rounded-xl border bg-muted/30 p-4">
            <div className="flex flex-col gap-3 border-b pb-3">
              <Field>
                <FieldLabel htmlFor="filter-search">Search</FieldLabel>
                <div className="flex items-center gap-2">
                  <input
                    id="filter-search"
                    type="search"
                    name="q"
                    defaultValue={input.search}
                    placeholder="Company, position, location, notes…"
                    className={`${selectClass} h-9`}
                  />
                  <Button type="submit" size="sm">
                    Search
                  </Button>
                </div>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              <Field>
                <FieldLabel htmlFor="filter-status">Status</FieldLabel>
                <select
                  id="filter-status"
                  name="status"
                  defaultValue={input.status ?? ""}
                  onChange={submitOnChange}
                  className={selectClass}
                >
                  <option value="">All</option>
                  {applicationStatuses.map((status) => (
                    <option key={status} value={status}>
                      {applicationStatusLabels[status]}
                    </option>
                  ))}
                </select>
              </Field>

              <Field>
                <FieldLabel htmlFor="filter-work-mode">Work mode</FieldLabel>
                <select
                  id="filter-work-mode"
                  name="workMode"
                  defaultValue={input.workMode ?? ""}
                  onChange={submitOnChange}
                  className={selectClass}
                >
                  <option value="">All</option>
                  {workModes.map((mode) => (
                    <option key={mode} value={mode}>
                      {workModeLabels[mode]}
                    </option>
                  ))}
                </select>
              </Field>

              <Field>
                <FieldLabel htmlFor="filter-employment-type">
                  Employment
                </FieldLabel>
                <select
                  id="filter-employment-type"
                  name="employmentType"
                  defaultValue={input.employmentType ?? ""}
                  onChange={submitOnChange}
                  className={selectClass}
                >
                  <option value="">All</option>
                  {employmentTypes.map((type) => (
                    <option key={type} value={type}>
                      {employmentTypeLabels[type]}
                    </option>
                  ))}
                </select>
              </Field>

              <Field>
                <FieldLabel htmlFor="filter-company">Company</FieldLabel>
                <select
                  id="filter-company"
                  name="companyId"
                  defaultValue={input.companyId ?? ""}
                  onChange={submitOnChange}
                  className={selectClass}
                >
                  <option value="">All</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field>
                <FieldLabel htmlFor="filter-from">Applied from</FieldLabel>
                <input
                  id="filter-from"
                  type="date"
                  name="appliedFrom"
                  defaultValue={input.appliedFrom}
                  className={selectClass}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="filter-to">Applied to</FieldLabel>
                <input
                  id="filter-to"
                  type="date"
                  name="appliedTo"
                  defaultValue={input.appliedTo}
                  className={selectClass}
                />
              </Field>

              <Field orientation="horizontal">
                <FieldLabel htmlFor="filter-has-interview">
                  Has interview
                </FieldLabel>
                <input
                  id="filter-has-interview"
                  type="checkbox"
                  name="hasInterview"
                  value="1"
                  defaultChecked={input.hasInterview}
                  onChange={submitOnChange}
                />
              </Field>

              <Field orientation="horizontal">
                <FieldLabel htmlFor="filter-has-next-action">
                  Has next action
                </FieldLabel>
                <input
                  id="filter-has-next-action"
                  type="checkbox"
                  name="hasNextAction"
                  value="1"
                  defaultChecked={input.hasNextAction}
                  onChange={submitOnChange}
                />
              </Field>
            </div>

            <div className="flex items-end justify-end border-t pt-3">
              <Button render={<Link href="/" />} variant="outline">
                Reset
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}