import "server-only";

import { db } from "@/lib/db";

export function getCompanies() {
  return db.company.findMany({
    orderBy: { name: "asc" },
  });
}

export function getCompanyById(id: string) {
  return db.company.findUnique({
    where: { id },
  });
}