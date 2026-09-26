"use client";

import {
  useApplicationDialogs,
  type ApplicationDialogKind,
} from "@/components/applications/application-dialogs";

export function ApplicationDialogButton({
  kind,
  applicationId,
  className,
  children,
}: {
  kind: ApplicationDialogKind;
  applicationId?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { open } = useApplicationDialogs();

  return (
    <button
      type="button"
      className={className}
      onClick={() => open(kind, applicationId)}
    >
      {children}
    </button>
  );
}
