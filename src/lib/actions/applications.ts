"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { getApplicationById } from "@/lib/data/applications";
import { getCompanies } from "@/lib/data/companies";
import {
  applicationFormSchema,
  parseDateOnly,
  type ApplicationFormValues,
} from "@/lib/validation/application-schema";

export type ApplicationActionResult = { error: string };

async function findOrCreateCompany(name: string) {
  const existing = await db.company.findFirst({
    where: { name: { equals: name, mode: "insensitive" } },
  });
  if (existing) return existing;
  return db.company.create({ data: { name } });
}

function scalarFields(data: ApplicationFormValues) {
  return {
    position: data.position,
    jobUrl: data.jobUrl || null,
    jobDescription: data.jobDescription || null,
    salaryMin: data.salaryMin === "" ? null : Number(data.salaryMin),
    salaryMax: data.salaryMax === "" ? null : Number(data.salaryMax),
    currency: data.currency || null,
    vacationDays: data.vacationDays === "" ? null : Number(data.vacationDays),
    location: data.location || null,
    workMode: data.workMode,
    employmentType: data.employmentType,
    status: data.status,
    appliedAt: parseDateOnly(data.appliedAt),
    nextAction: data.nextAction || null,
    nextActionDate: parseDateOnly(data.nextActionDate),
  };
}

export async function createApplication(
  input: unknown
): Promise<ApplicationActionResult | void> {
  const parsed = applicationFormSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid input. Please review your entries and try again." };
  }

  const data = parsed.data;

  try {
    const company = await findOrCreateCompany(data.companyName);

    await db.application.create({
      data: {
        companyId: company.id,
        ...scalarFields(data),
        ...(data.notes
          ? { notes: { create: [{ content: data.notes }] } }
          : {}),
      },
    });
  } catch {
    return { error: "Couldn't save the application. Please try again." };
  }

  revalidatePath("/");
}

export async function updateApplication(
  id: string,
  input: unknown
): Promise<ApplicationActionResult | void> {
  const parsed = applicationFormSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid input. Please review your entries and try again." };
  }

  const data = parsed.data;

  try {
    const company = await findOrCreateCompany(data.companyName);

    await db.application.update({
      where: { id },
      data: {
        companyId: company.id,
        ...scalarFields(data),
      },
    });
  } catch {
    return { error: "Couldn't save the application. Please try again." };
  }

  revalidatePath("/");
}

export async function deleteApplication(id: string) {
  try {
    await db.application.delete({ where: { id } });
  } catch {
    // Row was already removed — nothing to undo.
  }
  revalidatePath("/");
}

export async function fetchApplicationDialogData(id: string | null) {
  const [application, companies] = await Promise.all([
    id ? getApplicationById(id) : null,
    getCompanies(),
  ]);

  return {
    application,
    companies: companies.map((company) => ({
      id: company.id,
      name: company.name,
    })),
  };
}