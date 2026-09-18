import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getNoteById } from "@/lib/data/notes";
import type { NoteFormValues } from "@/lib/validation/note-schema";
import { NoteForm } from "@/components/notes/note-form";

export const metadata: Metadata = {
  title: "Edit Note",
};

export const instant = false;

export default async function EditNotePage({
  params,
}: PageProps<"/applications/[id]/notes/[noteId]/edit">) {
  const { id, noteId } = await params;
  const note = await getNoteById(noteId);
  if (!note || note.application.id !== id) notFound();

  const initialValues: NoteFormValues = { content: note.content };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Edit Note</h1>
        <p className="text-sm text-muted-foreground">
          {note.application.position} · {note.application.company.name}
        </p>
      </div>
      <NoteForm
        applicationId={note.application.id}
        noteId={note.id}
        initialValues={initialValues}
      />
    </div>
  );
}