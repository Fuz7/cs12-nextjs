import { SectionCards } from "@/components/layouts/section-cards";
import { getLastMonthRevenue } from "@/services/invoices";
import { headers } from "next/headers";

export default async function Home() {
  const cookieHeader = (await headers()).get("cookie") as string; // browser cookies
  return (
    <>
      <SectionCards cookieHeader={cookieHeader} />
    </>
  );
}
