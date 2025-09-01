"use client";
import { getEstimatesById } from "@/services/estimates";
import { getInvoicesById } from "@/services/invoices";
import { Calendar, FileText, Receipt, MessageSquare } from "lucide-react";
import useSWR from "swr";

interface StatItemProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: string;
}

function StatItem({ icon, value, label, color }: StatItemProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
      <div className={`p-2 rounded-md ${color}`}>{icon}</div>
      <div>
        <p className="text-lg font-semibold text-gray-900">
          ${value.toLocaleString(undefined)}
        </p>
        <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      </div>
    </div>
  );
}

type CustomerStatsProps = {
  id: string;
  cookieHeader: string;
};

export function CustomerStats({ id, cookieHeader }: CustomerStatsProps) {
  const { data: estimates } = useSWR(`/api/estimates/${id}`, () =>
    getEstimatesById(Number(id), cookieHeader)
  );

  const { data: invoices } = useSWR(`/api/invoices/${id}`, () =>
    getInvoicesById(Number(id), cookieHeader)
  );

  const pastDue = invoices?.data
    ? invoices?.data.reduce((accumulator, invoice) => {
        if (invoice.status === "overdue")
          return (
            accumulator +
            (Number(invoice.tasks_total_price) - Number(invoice.paid_amount))
          );
        return accumulator;
      }, 0.0)
    : 0.0;

  const due = invoices?.data
    ? invoices?.data.reduce((accumulator, invoice) => {
        if (invoice.status !== "overdue")
          return (
            accumulator +
            (Number(invoice.tasks_total_price) - Number(invoice.paid_amount))
          );
        return accumulator;
      }, 0.0)
    : 0.0;
  const revenue = invoices?.data
    ? invoices?.data.reduce((accumulator, invoice) => {
        return accumulator + Number(invoice.paid_amount);
      }, 0.0)
    : 0.0;

  const approved = estimates?.data
    ? estimates?.data.reduce((accumulator, estimate) => {
        if (estimate.status === "approved")
          return accumulator + Number(estimate.tasks_total_price);
        return accumulator;
      }, 0.0)
    : 0.0;
  const stats = [
    {
      icon: <FileText className="h-4 w-4 text-red-600" />,
      value: pastDue,
      label: "Past Due (Invoices)",
      color: "bg-red-50",
    },
    {
      icon: <Calendar className="h-4 w-4 text-blue-600" />,
      value: due,
      label: "Due (Invoices)",
      color: "bg-blue-50",
    },
    {
      icon: <Receipt className="h-4 w-4 text-green-600" />,
      value: revenue,
      label: "Total Revenue",
      color: "bg-green-50",
    },
    {
      icon: <MessageSquare className="h-4 w-4 text-purple-600" />,
      value: approved,
      label: "Estimates",
      color: "bg-purple-50",
    },
  ];

  return (
    <div className="flex items-center gap-4">
      {stats.map((stat, index) => (
        <StatItem key={index} {...stat} />
      ))}
    </div>
  );
}
