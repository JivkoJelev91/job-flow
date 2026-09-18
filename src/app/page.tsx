import {
  buildApplicationQuery,
  getApplications,
  getApplicationStats,
  parseApplicationListInput,
} from "@/lib/data/applications";
import { getCompanies } from "@/lib/data/companies";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { ApplicationTable } from "@/components/applications/application-table";
import { ApplicationFilters } from "@/components/applications/application-filters";

export const instant = false;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const input = parseApplicationListInput(params);
  const query = buildApplicationQuery(input);
  const allStatsQuery = buildApplicationQuery(parseApplicationListInput({}));

  const [applications, stats, companies] = await Promise.all([
    getApplications(query),
    getApplicationStats(allStatsQuery),
    getCompanies(),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8">
      <ApplicationFilters companies={companies} input={input} />
      <DashboardStats stats={stats} activeStatus={query.status ?? null} />
      <div className="flex flex-col gap-3">
        <ApplicationTable
          applications={applications}
          sortBy={query.sortBy}
          sortDir={query.sortDir}
          searchParams={params}
        />
      </div>
    </div>
  );
}