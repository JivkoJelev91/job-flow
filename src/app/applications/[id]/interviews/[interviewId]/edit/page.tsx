import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getInterviewById } from "@/lib/data/interviews";
import { toDateTimeLocal } from "@/lib/validation/interview-schema";
import type { InterviewFormValues } from "@/lib/validation/interview-schema";
import { InterviewForm } from "@/components/interviews/interview-form";

export const metadata: Metadata = {
  title: "Edit Interview",
};

export const instant = false;

export default async function EditInterviewPage({
  params,
}: PageProps<"/applications/[id]/interviews/[interviewId]/edit">) {
  const { id, interviewId } = await params;
  const interview = await getInterviewById(interviewId);
  if (!interview || interview.application.id !== id) notFound();

  const initialValues: InterviewFormValues = {
    scheduledAt: toDateTimeLocal(interview.scheduledAt),
    type: interview.type,
    location: interview.location ?? "",
    notes: interview.notes ?? "",
    result: interview.result ?? "",
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Edit Interview</h1>
        <p className="text-sm text-muted-foreground">
          {interview.application.position} · {interview.application.company.name}
        </p>
      </div>
      <InterviewForm
        applicationId={interview.application.id}
        interviewId={interviewId}
        initialValues={initialValues}
      />
    </div>
  );
}