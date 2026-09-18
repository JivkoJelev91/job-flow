import "server-only";

import { db } from "@/lib/db";

export function getInterviewById(id: string) {
  return db.interview.findUnique({
    where: { id },
    include: {
      application: {
        include: { company: true },
      },
    },
  });
}