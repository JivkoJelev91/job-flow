"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import {
  interviewFormSchema,
  parseInterviewDateTime,
  type InterviewFormValues,
} from "@/lib/validation/interview-schema";

export type InterviewActionResult = { error: string };

function scalarFields(data: InterviewFormValues) {
  return {
    scheduledAt: parseInterviewDateTime(data.scheduledAt),
    type: data.type,
    location: data.location || null,
    notes: data.notes || null,
    result: data.result || null,
  };
}

export async function createInterview(
  applicationId: string,
  input: unknown,
): Promise<InterviewActionResult | void> {
  const parsed = interviewFormSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid input. Please review your entries and try again." };
  }

  try {
    await db.interview.create({
      data: {
        applicationId,
        ...scalarFields(parsed.data),
      },
    });
  } catch {
    return { error: "Couldn't save the interview. Please try again." };
  }

  revalidatePath(`/applications/${applicationId}`);
  redirect(`/applications/${applicationId}`);
}

export async function updateInterview(
  id: string,
  applicationId: string,
  input: unknown,
): Promise<InterviewActionResult | void> {
  const parsed = interviewFormSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid input. Please review your entries and try again." };
  }

  try {
    await db.interview.update({
      where: { id },
      data: scalarFields(parsed.data),
    });
  } catch {
    return { error: "Couldn't save the interview. Please try again." };
  }

  revalidatePath(`/applications/${applicationId}`);
  redirect(`/applications/${applicationId}`);
}

export async function deleteInterview(id: string, applicationId: string) {
  try {
    await db.interview.delete({ where: { id } });
  } catch {
    // Already gone — nothing to undo.
  }
  revalidatePath(`/applications/${applicationId}`);
}