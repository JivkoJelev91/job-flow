import "server-only";

import { db } from "@/lib/db";

export function getNoteById(id: string) {
  return db.note.findUnique({
    where: { id },
    include: {
      application: {
        include: { company: true },
      },
    },
  });
}