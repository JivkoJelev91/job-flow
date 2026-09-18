import type { ApplicationStatus } from "@prisma/client";
import { cn } from "cn";

import { Badge } from "@/components/ui/badge";
import {
  applicationStatusLabels,
  type ApplicationStatusValue,
} from "@/lib/validation/application-schema";
import { statusDot, statusPill } from "@/lib/status-style";

export function ApplicationStatusBadge({
  status,
}: {
  status: ApplicationStatus;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "border-transparent gap-1.5 transition-colors",
        statusPill[status],
      )}
    >
      <span
        aria-hidden="true"
        className={cn("size-1.5 shrink-0 rounded-full", statusDot[status])}
      />
      {applicationStatusLabels[status as ApplicationStatusValue]}
    </Badge>
  );
}