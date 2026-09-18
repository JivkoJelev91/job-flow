"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { noteFormSchema } from "@/lib/validation/note-schema";

export type NoteActionResult = { error: string };

export async function createNote(
  applicationId: string,
  input: unknown,
): Promise<NoteActionResult | void> {
  const parsed = noteFormSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid note. Please check your entry." };
  }

  try {
    await db.note.create({
      data: { applicationId, content: parsed.data.content },
    });
  } catch {
    return { error: "Couldn't save the note. Please try again." };
  }

  revalidatePath(`/applications/${applicationId}`);
  redirect(`/applications/${applicationId}`);
}

export async function updateNote(
  id: string,
  applicationId: string,
  input: unknown,
): Promise<NoteActionResult | void> {
  const parsed = noteFormSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid note. Please check your entry." };
  }

  try {
    await db.note.update({
      where: { id },
      data: { content: parsed.data.content },
    });
  } catch {
    return { error: "Couldn't save the note. Please try again." };
  }

  revalidatePath(`/applications/${applicationId}`);
  redirect(`/applications/${applicationId}`);
}

export async function deleteNote(id: string, applicationId: string) {
  try {
    await db.note.delete({ where: { id } });
  } catch {
    // Already gone — nothing to undo.
  }
  revalidatePath(`/applications/${applicationId}`);
}