import type { Prisma } from "@prisma/client";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";

import { ApplicationStatusBadge } from "@/components/applications/application-status-badge";
import { DeleteButton } from "@/components/ui/delete-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { employmentTypeLabels } from "@/lib/validation/application-schema";
import {
  deleteApplication,
} from "@/lib/actions/applications";
import { deleteInterview } from "@/lib/actions/interviews";
import { deleteNote } from "@/lib/actions/notes";
import {
  formatDate,
  formatDateTime,
  formatInterviewType,
  formatSalary,
  formatVacation,
  formatWorkMode,
} from "@/lib/format";

export type ApplicationDetailsData = Prisma.ApplicationGetPayload<{
  include: {
    company: true;
    interviews: { orderBy: { scheduledAt: "asc" } };
    notes: { orderBy: { createdAt: "asc" } };
  };
}>;

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function DetailGrid({ children }: { children: React.ReactNode }) {
  return (
    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {children}
    </dl>
  );
}

export function ApplicationDetails({
  application,
}: {
  application: ApplicationDetailsData;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {application.position}
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {application.company.name}
            </span>
            <ApplicationStatusBadge status={application.status} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            render={<Link href="/" />}
            variant="ghost"
          >
            <ArrowLeft data-icon="inline-start" />
            Back
          </Button>
          <Button
            render={
              <Link href={`/applications/${application.id}/edit`} />
            }
            variant="default"
          >
            <Pencil data-icon="inline-start" />
            Edit
          </Button>
          <DeleteButton
            action={deleteApplication}
            args={[application.id]}
            confirmText="Delete this application? This cannot be undone."
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job</CardTitle>
        </CardHeader>
        <CardContent>
          <DetailGrid>
            <DetailRow label="Company">{application.company.name}</DetailRow>
            <DetailRow label="Location">{application.location || "—"}</DetailRow>
            <DetailRow label="Work mode">
              {formatWorkMode(application.workMode)}
            </DetailRow>
            <DetailRow label="Employment type">
              {employmentTypeLabels[application.employmentType]}
            </DetailRow>
            <DetailRow label="Salary">
              {formatSalary(
                application.salaryMin,
                application.salaryMax,
                application.currency,
              )}
            </DetailRow>
            <DetailRow label="Vacation days">
              {formatVacation(application.vacationDays)}
            </DetailRow>
            <DetailRow label="Job URL">
              {application.jobUrl ? (
                <a
                  href={application.jobUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  {application.jobUrl}
                </a>
              ) : (
                "—"
              )}
            </DetailRow>
          </DetailGrid>
          {application.jobDescription && (
            <div className="mt-6 border-t pt-4">
              <span className="text-xs text-muted-foreground">Description</span>
              <p className="mt-1.5 whitespace-pre-wrap break-words text-sm leading-relaxed">
                {application.jobDescription}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Application</CardTitle>
        </CardHeader>
        <CardContent>
          <DetailGrid>
            <DetailRow label="Status">
              <ApplicationStatusBadge status={application.status} />
            </DetailRow>
            <DetailRow label="Applied on">
              {formatDate(application.appliedAt)}
            </DetailRow>
            <DetailRow label="Next action">
              {application.nextAction || "—"}
            </DetailRow>
            <DetailRow label="Next action date">
              {formatDate(application.nextActionDate)}
            </DetailRow>
          </DetailGrid>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Interviews</CardTitle>
          <CardAction>
            <Button
              render={
                <Link href={`/applications/${application.id}/interviews/new`} />
              }
              size="sm"
            >
              Add Interview
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {application.interviews.length === 0 ? (
            <p className="text-muted-foreground">No interviews yet.</p>
          ) : (
            <ol className="flex flex-col gap-4">
              {application.interviews.map((interview) => (
                <li
                  key={interview.id}
                  className="flex flex-col gap-1 rounded-lg border bg-muted/30 p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">
                      {formatDateTime(interview.scheduledAt)}
                    </span>
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">
                      {formatInterviewType(interview.type)}
                    </span>
                    <div className="ml-auto flex items-center gap-1">
                      <Button
                        render={
                          <Link
                            href={`/applications/${application.id}/interviews/${interview.id}/edit`}
                          />
                        }
                        variant="ghost"
                        size="sm"
                      >
                        Edit
                      </Button>
                      <DeleteButton
                          action={deleteInterview}
                          args={[interview.id, application.id]}
                          confirmText="Delete this interview?"
                          variant="ghost"
                          size="sm"
                        />
                    </div>
                  </div>
                  {interview.location && (
                    <span className="text-sm text-muted-foreground">
                      {interview.location}
                    </span>
                  )}
                  {interview.notes && (
                    <span className="text-sm">{interview.notes}</span>
                  )}
                  {interview.result && (
                    <span className="text-sm font-medium">
                      Result: {interview.result}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
          <CardAction>
            <Button
              render={
                <Link href={`/applications/${application.id}/notes/new`} />
              }
              size="sm"
            >
              Add Note
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {application.notes.length === 0 ? (
            <p className="text-muted-foreground">No notes yet.</p>
          ) : (
            <ol className="flex flex-col gap-4">
              {application.notes.map((note) => (
                <li
                  key={note.id}
                  className="flex flex-col gap-1 rounded-lg border bg-muted/30 p-4"
                >
                  <span className="text-sm">{note.content}</span>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(note.createdAt)}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        render={
                          <Link
                            href={`/applications/${application.id}/notes/${note.id}/edit`}
                          />
                        }
                        variant="ghost"
                        size="sm"
                      >
                        Edit
                      </Button>
                      <DeleteButton
                          action={deleteNote}
                          args={[note.id, application.id]}
                          confirmText="Delete this note?"
                          variant="ghost"
                          size="sm"
                        />
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>
    </div>
  );
}