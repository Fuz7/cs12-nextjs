import { ChartAreaInteractive } from "@/components/layouts/admin/chart-area-interactive";
import { SectionCards } from "@/components/layouts/section-cards";

import { getChartLeadGeneration } from "@/services/leads";
import { headers } from "next/headers";

export default async function Home() {
  const cookieHeader = (await headers()).get("cookie") ?? ""; // browser cookies
  const chartData = await getChartLeadGeneration(cookieHeader);
  console.log(chartData);
  return (
    <>
      <SectionCards cookieHeader={cookieHeader} />
      <div className="flex flex-col gap-3 px-4 lg:px-6">
        <ChartAreaInteractive chartLead={chartData.data} />
      </div>
    </>
  );
}
