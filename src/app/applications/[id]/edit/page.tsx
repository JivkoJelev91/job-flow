import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Briefcase } from "lucide-react";

import { getCompanies } from "@/lib/data/companies";
import { getApplicationById } from "@/lib/data/applications";
import { toDateInput } from "@/lib/validation/application-schema";
import type { ApplicationFormValues } from "@/lib/validation/application-schema";
import { ApplicationForm } from "@/components/applications/application-form";

export const metadata: Metadata = {
  title: "Edit Application",
};

export const instant = false;

function toInitialValues(
  application: NonNullable<Awaited<ReturnType<typeof getApplicationById>>>,
): ApplicationFormValues {
  return {
    companyName: application.company.name,
    position: application.position,
    jobUrl: application.jobUrl ?? "",
    jobDescription: application.jobDescription ?? "",
    salaryMin: application.salaryMin?.toString() ?? "",
    salaryMax: application.salaryMax?.toString() ?? "",
    vacationDays: application.vacationDays?.toString() ?? "",
    currency: application.currency ?? "",
    location: application.location ?? "",
    workMode: application.workMode,
    employmentType: application.employmentType,
    status: application.status,
    appliedAt: toDateInput(application.appliedAt),
    nextAction: application.nextAction ?? "",
    nextActionDate: toDateInput(application.nextActionDate),
    notes: "",
  };
}

export default async function EditApplicationPage({
  params,
}: PageProps<"/applications/[id]/edit">) {
  const { id } = await params;
  const [application, companies] = await Promise.all([
    getApplicationById(id),
    getCompanies(),
  ]);
  if (!application) notFound();

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8">
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400">
          <Briefcase className="size-5" />
        </span>
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Edit Application</h1>
          <p className="text-sm text-muted-foreground">
            {application.position} · {application.company.name}
          </p>
        </div>
      </div>
      <ApplicationForm
        companies={companies}
        applicationId={application.id}
        initialValues={toInitialValues(application)}
      />
    </div>
  );
}