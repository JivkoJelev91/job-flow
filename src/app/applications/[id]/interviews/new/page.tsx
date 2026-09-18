import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getApplicationById } from "@/lib/data/applications";
import { InterviewForm } from "@/components/interviews/interview-form";

export const metadata: Metadata = {
  title: "Add Interview",
};

export const instant = false;

export default async function NewInterviewPage({
  params,
}: PageProps<"/applications/[id]/interviews/new">) {
  const { id } = await params;
  const application = await getApplicationById(id);
  if (!application) notFound();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Add Interview</h1>
        <p className="text-sm text-muted-foreground">
          {application.position} · {application.company.name}
        </p>
      </div>
      <InterviewForm applicationId={application.id} />
    </div>
  );
}