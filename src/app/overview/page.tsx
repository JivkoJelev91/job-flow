import {
  buildApplicationQuery,
  getNeedsAttention,
  parseApplicationListInput,
} from "@/lib/data/applications";
import { getDashboardInsights } from "@/lib/data/statistics";
import { DashboardInsights } from "@/components/dashboard/dashboard-insights";
import { NeedsAttention } from "@/components/dashboard/needs-attention";

export const instant = false;

export default async function OverviewPage() {
  const query = buildApplicationQuery(parseApplicationListInput({}));
  const [attentionItems, insights] = await Promise.all([
    getNeedsAttention(),
    getDashboardInsights(query),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8">
      <NeedsAttention items={attentionItems} />
      <DashboardInsights insights={insights} />
    </div>
  );
}