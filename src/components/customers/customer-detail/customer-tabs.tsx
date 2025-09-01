"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, FileText, Receipt } from "lucide-react";
import { useState } from "react";
import EstimateTab from "./estimate-tab";
import { Customer } from "@/types/database";
import useSWR from "swr";
import { getEstimatesById } from "@/services/estimates";
import { getJobsById } from "@/services/jobs";
import JobTab from "./job-tab";
import { getInvoicesById } from "@/services/invoices";
import InvoiceTab from "./invoice-tab";

type CustomerTabsProps = {
  category: string;
  id: string;
  cookieHeader: string;
  customer: Customer;
};

export function CustomerTabs({
  category,
  id,
  cookieHeader,
  customer,
}: CustomerTabsProps) {
  const tabs = [
    { value: "estimates", label: "Estimates", icon: FileText },
    { value: "jobs", label: "Jobs", icon: Calendar },
    { value: "invoices", label: "Invoices", icon: Receipt },
  ];
  const initialTab = tabs.some((t) => t.value === category)
    ? category
    : "estimates";
  const [activeTab, setActiveTab] = useState(initialTab);

  const {
    data: estimates,
    mutate: mutateEstimates,
    isValidating: isEstimateValidating,
  } = useSWR(`/api/estimates/${id}`, () =>
    getEstimatesById(Number(id), cookieHeader)
  );
  const {
    data: jobs,
    mutate: mutateJobs,
    isValidating: isJobValidating,
  } = useSWR(`/api/jobs/${id}`, () => getJobsById(Number(id), cookieHeader));
  const {
    data: invoices,
    mutate: mutateInvoices,
    isValidating: isInvoiceValidating,
  } = useSWR(`/api/invoices/${id}`, () =>
    getInvoicesById(Number(id), cookieHeader)
  );
  console.log(invoices);
  return (
    <div className="h-full flex flex-col">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="h-full flex flex-col relative"
      >
        <div className="border-b bg-white px-6 py-4">
          <TabsList className="w-full justify-start h-auto p-0 bg-transparent">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none border-b-2 border-transparent px-4 py-2 font-medium text-sm text-gray-600 data-[state=active]:text-primary hover:text-gray-900 transition-colors"
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList> 
        </div>
        <EstimateTab
          estimates={estimates ? estimates.data : estimates}
          mutate={mutateEstimates}
          customer={customer}
          isValidating={isEstimateValidating}
        />
        <JobTab
          jobs={jobs?.data}
          customer={customer}
          isValidating={isJobValidating}
          mutate={mutateJobs}
        />

        <InvoiceTab
          invoices={invoices?.data}
          customer={customer}
          isValidating={isInvoiceValidating}
          mutate={mutateInvoices}
        />
      </Tabs>
    </div>
  );
}
