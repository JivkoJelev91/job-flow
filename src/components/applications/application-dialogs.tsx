"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase } from "lucide-react";

import { ApplicationDetails } from "@/components/applications/application-details";
import { ApplicationForm } from "@/components/applications/application-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { fetchApplicationDialogData } from "@/lib/actions/applications";
import { toDateInput } from "@/lib/validation/application-schema";

export type ApplicationDialogKind = "new" | "edit" | "details";

type Target = {
  kind: ApplicationDialogKind;
  id: string;
};

type DialogData = Awaited<ReturnType<typeof fetchApplicationDialogData>>;

const ApplicationDialogsContext = createContext<{
  open: (kind: ApplicationDialogKind, id?: string) => void;
} | null>(null);

export function useApplicationDialogs() {
  const value = useContext(ApplicationDialogsContext);
  if (!value) {
    throw new Error(
      "useApplicationDialogs must be used inside <ApplicationDialogs>.",
    );
  }
  return value;
}

function toFormValues(application: NonNullable<DialogData["application"]>) {
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

export function ApplicationDialogs({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [target, setTarget] = useState<Target | null>(null);
  const [loaded, setLoaded] = useState<{ key: string; data: DialogData } | null>(
    null,
  );

  const close = () => setTarget(null);

  const open = (kind: ApplicationDialogKind, id?: string) => {
    if (kind !== "new" && !id) return;
    setTarget({ kind, id: id ?? "" });
  };

  const key = target ? `${target.kind}:${target.id}` : null;
  const data = target && loaded?.key === key ? loaded.data : null;
  const isLoading = target !== null && data === null;

  useEffect(() => {
    if (!target) return;

    let cancelled = false;

    fetchApplicationDialogData(target.kind === "new" ? null : target.id).then(
      (result) => {
        if (cancelled) return;
        if (target.kind !== "new" && !result.application) {
          setTarget(null);
          return;
        }
        setLoaded({ key: `${target.kind}:${target.id}`, data: result });
      },
    );

    return () => {
      cancelled = true;
    };
  }, [target]);

  const application = data?.application ?? null;

  return (
    <ApplicationDialogsContext value={{ open }}>
      {children}

      <Dialog
        open={target !== null}
        onOpenChange={(next) => {
          if (!next) close();
        }}
      >
        <DialogContent className="flex max-h-[85vh] flex-col gap-4 sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Briefcase className="size-4 text-violet-600 dark:text-violet-400" />
              {target?.kind === "new"
                ? "New Application"
                : target?.kind === "edit"
                  ? "Edit Application"
                  : "Application"}
            </DialogTitle>
            {application && (
              <DialogDescription>
                {application.position} · {application.company.name}
              </DialogDescription>
            )}
          </DialogHeader>

          <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Spinner />
              </div>
            ) : data && target ? (
              target.kind === "details" ? (
                <ApplicationDetails
                  application={data.application!}
                  onEdit={() => setTarget({ kind: "edit", id: target.id })}
                  onChanged={() => {
                    setTarget({ kind: "details", id: target.id });
                    router.refresh();
                  }}
                  onNavigate={close}
                />
              ) : (
                <ApplicationForm
                  key={target.kind === "new" ? "new" : target.id}
                  companies={data.companies}
                  applicationId={target.kind === "edit" ? target.id : undefined}
                  initialValues={
                    data.application ? toFormValues(data.application) : undefined
                  }
                  defaultAppliedAt={toDateInput(new Date())}
                  onCancel={close}
                  onSaved={() => {
                    close();
                    router.refresh();
                  }}
                />
              )
            ) : null}
          </div>

          {application && target?.kind === "details" && (
            <DialogFooter>
              <Button variant="ghost" onClick={close}>
                Close
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </ApplicationDialogsContext>
  );
}
