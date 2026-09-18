import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getApplicationById } from "@/lib/data/applications";
import { NoteForm } from "@/components/notes/note-form";

export const metadata: Metadata = {
  title: "Add Note",
};

export const instant = false;

export default async function NewNotePage({
  params,
}: PageProps<"/applications/[id]/notes/new">) {
  const { id } = await params;
  const application = await getApplicationById(id);
  if (!application) notFound();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Add Note</h1>
        <p className="text-sm text-muted-foreground">
          {application.position} · {application.company.name}
        </p>
      </div>
      <NoteForm applicationId={application.id} />
    </div>
  );
}