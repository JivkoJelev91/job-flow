import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getApplicationById } from "@/lib/data/applications";
import { ApplicationDetails } from "@/components/applications/application-details";

export const instant = false;

export async function generateMetadata({
  params,
}: PageProps<"/applications/[id]">): Promise<Metadata> {
  const { id } = await params;
  const application = await getApplicationById(id);
  if (!application) return { title: "Application" };
  return { title: `${application.position} · ${application.company.name}` };
}

export default async function ApplicationDetailsPage({
  params,
}: PageProps<"/applications/[id]">) {
  const { id } = await params;
  const application = await getApplicationById(id);
  if (!application) notFound();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col px-4 py-8">
      <ApplicationDetails application={application} />
    </div>
  );
}