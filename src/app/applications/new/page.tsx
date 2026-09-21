import type { Metadata } from "next";
import { Briefcase } from "lucide-react";

import { getCompanies } from "@/lib/data/companies";
import { ApplicationForm } from "@/components/applications/application-form";
import { toDateInput } from "@/lib/validation/application-schema";

export const metadata: Metadata = {
  title: "New Application",
};

export const instant = false;

export default async function NewApplicationPage() {
  const companies = await getCompanies();
  const today = toDateInput(new Date());

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8">
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400">
          <Briefcase className="size-5" />
        </span>
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">New Application</h1>
          <p className="text-sm text-muted-foreground">
            Only Company and Position are required — everything else can be added
            later.
          </p>
        </div>
      </div>
      <ApplicationForm companies={companies} defaultAppliedAt={today} />
    </div>
  );
}