import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getLastMonthRevenue } from "@/services/invoices";
import { getNewCustomers } from "@/services/customers";
import { getConvertionRate, getNewLeads } from "@/services/leads";

type SectionCardsProps = {
  cookieHeader: string;
};

export async function SectionCards({ cookieHeader }: SectionCardsProps) {
  const [revenue, newCustomers, newLeads, convertionRate] = await Promise.all([
    getLastMonthRevenue(cookieHeader),
    getNewCustomers(cookieHeader),
    getNewLeads(cookieHeader),
    getConvertionRate(cookieHeader),
  ]);
  console.log(convertionRate);
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            ${Number(revenue.data?.last_month).toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {Number(revenue?.data?.percentage_difference) > 0 ? (
                <>
                  <IconTrendingUp />+
                </>
              ) : (
                <>
                  <IconTrendingDown />
                </>
              )}
              {revenue.data?.percentage_difference}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          {" "}
          {Number(newLeads?.data?.growth_rate_percent) > 0 ? (
            <>
              <div className="line-clamp-1 flex gap-2 font-medium">
                Trending up this month <IconTrendingUp className="size-4" />
              </div>
            </>
          ) : (
            <>
              <div className="line-clamp-1 flex gap-2 font-medium">
                Trending down this month <IconTrendingDown className="size-4" />
              </div>
            </>
          )}
          <div className="text-muted-foreground">
            Revenue for the last month
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>New Customers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {newCustomers.data?.last_month_customers}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {" "}
              {Number(newCustomers.data?.growth_rate_percent) > 0 ? (
                <>
                  <IconTrendingUp />+
                </>
              ) : (
                <>
                  <IconTrendingDown />
                </>
              )}
              {newCustomers.data?.growth_rate_percent}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          {Number(newCustomers?.data?.growth_rate_percent) > 0 ? (
            <>
              <div className="line-clamp-1 flex gap-2 font-medium">
                Up {newCustomers.data?.growth_rate_percent}% this period{" "}
                <IconTrendingUp className="size-4" />
              </div>
            </>
          ) : (
            <>
              <div className="line-clamp-1 flex gap-2 font-medium">
                Down {newCustomers.data?.growth_rate_percent} this period{" "}
                <IconTrendingDown className="size-4" />
              </div>
            </>
          )}
          <div className="text-muted-foreground">
            {Number(newCustomers?.data?.growth_rate_percent) > 0 ? (
              <>Strong onboarding momentum</>
            ) : (
              <>Onboarding below target</>
            )}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>New Leads</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {newLeads.data?.last_month_leads}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {" "}
              {Number(newLeads.data?.growth_rate_percent) > 0 ? (
                <>
                  <IconTrendingUp />+
                </>
              ) : (
                <>
                  <IconTrendingDown />
                </>
              )}
              {newLeads.data?.growth_rate_percent}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          {Number(newLeads?.data?.growth_rate_percent) > 0 ? (
            <>
              <div className="line-clamp-1 flex gap-2 font-medium">
                Healthy growth pace maintained
                <IconTrendingUp className="size-4" />
              </div>
            </>
          ) : (
            <>
              <div className="line-clamp-1 flex gap-2 font-medium">
                Below expected growth
                <IconTrendingDown className="size-4" />
              </div>
            </>
          )}
          <div className="text-muted-foreground">
            {Number(newCustomers?.data?.growth_rate_percent) > 0 ? (
              <>Healthy inflow of leads</>
            ) : (
              <>Lead pipeline weak</>
            )}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Convertion Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {convertionRate.data?.last_month_conversion_rate}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {Number(convertionRate.data?.growth_rate_percent) > 0 ? (
                <>
                  <IconTrendingUp />+
                </>
              ) : (
                <>
                  <IconTrendingDown />
                </>
              )}
              {convertionRate.data?.growth_rate_percent}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          {" "}
          {Number(convertionRate?.data?.growth_rate_percent) > 0 ? (
            <>
              <div className="line-clamp-1 flex gap-2 font-medium">
                Steady performance increase
                <IconTrendingUp className="size-4" />
              </div>
            </>
          ) : (
            <>
              <div className="line-clamp-1 flex gap-2 font-medium">
                Downward performance trend
                <IconTrendingDown className="size-4" />
              </div>
            </>
          )}
            <div className="text-muted-foreground">
            {Number(convertionRate?.data?.growth_rate_percent) > 0 ? (
              <>Meets convertion projections</>
            ) : (
              <>Below convertion projections</>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
