"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  FileText,
  DollarSign,
  Briefcase,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";
import { InfoJob } from "@/components/users/info-job";
import { InfoEstimate } from "@/components/users/info-estimate";
import { InfoInvoice } from "@/components/users/info-invoice";
import { Estimate, ESTIMATE_STATUSES } from "@/types/estimates";
import { Invoice } from "@/types/invoices";
import { Job } from "@/types/jobs";
import { useAuth } from "@/hooks/auth";
import { getEstimatesByUserId } from "@/services/estimates";
import ApproveEstimateForm from "@/components/estimates/approve-estimate-form";
import { wait } from "@/utils/promise";
import { Badge } from "@/components/ui/badge";
import RejectEstimateForm from "@/components/estimates/reject-estimate-form";
import { getActiveJobsByUserId } from "@/services/jobs";
import { getInvoicesByUserId } from "@/services/invoices";


export default function DashboardPage() {
  const [selectedEstimate, setSelectedEstimate] = useState<Estimate | false>(
    false,
  );
  const [isEstimateModalOpen, setIsEstimateModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isRejectEstimateOpen, setIsRejectEstimateOpen] = useState<
    Estimate | false
  >(false);
  const [isApproveEstimateOpen, setIsApproveEstimateOpen] = useState<
    Estimate | false
  >(false);
  const { user } = useAuth({ middleware: "auth" });
  const [userEstimates, setUserEstimates] = useState<Estimate[]>([]);
  const [userActiveJobs, setUserActiveJobs] = useState<Job[]>([]);
  const [userInvoices, setUserInvoices] = useState<Invoice[]>([]);
  
  console.log(user);
  const fetchEstimates = useCallback(async () => {
    if (user?.id === undefined) return;
    const res = await getEstimatesByUserId(user?.id as number);
    if (res.status === "success") {
      setUserEstimates(res.data as Estimate[]);
    }
  }, [user]);
  const fetchActiveJobs = useCallback(async () => {
    if (user?.id === undefined) return;
    const res = await getActiveJobsByUserId(user?.id as number);
    if (res.status === "success") {
      setUserActiveJobs(res.data as Job[]);
    }
  }, [user]);
  const fetchInvoices = useCallback(async () => {
    if (user?.id === undefined) return;
    const res = await getInvoicesByUserId(user?.id as number);
    if (res.status === "success") {
      console.log(res.data);
      setUserInvoices(res.data as Invoice[])
    }
  }, [user]);

  useEffect(() => {
    fetchEstimates();
  }, [fetchEstimates]);
  useEffect(() => {
    fetchActiveJobs();
  }, [fetchActiveJobs]);
  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const openEstimateModal = (estimate: Estimate) => {
    setSelectedEstimate(estimate);
    setIsEstimateModalOpen(true);
  };

  // const openInvoiceModal = (invoice: Invoice) => {
  //   setSelectedInvoice(invoice);
  //   setIsInvoiceModalOpen(true);
  

  // const openJobModal = (job: Job) => {
  //   setSelectedJob(job);
  //   setIsJobModalOpen(true);
  // };
  
  const totalEstimateValue = userEstimates.reduce(
    (sum, e) => sum + parseFloat(e.tasks_total_price as string),
    0,
  );
  const totalInvoiceValue = userInvoices.reduce(
    (sum, i) => sum + parseFloat(i.tasks_total_price as string),
    0,
  );
  const totalPaidAmount = userInvoices.reduce(
    (sum, i) => sum + parseFloat(i.paid_amount as string),
    0,
  );
  const totalDueAmount = totalInvoiceValue - totalPaidAmount;
  const getStatusBadge = (status: string) => {
    const statusConfig = ESTIMATE_STATUSES.find((s) => s.value === status);
    if (!statusConfig) return <Badge variant="secondary">{status}</Badge>;

    return (
      <Badge variant="secondary" className={statusConfig.color}>
        {statusConfig.label}
      </Badge>
    );
  };
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s your business overview.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Estimates
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₱{totalEstimateValue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {userEstimates.length} estimates
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Invoiced
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₱{totalInvoiceValue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {userInvoices.length} invoices
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Amount Paid</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₱{totalPaidAmount.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground text-green-600">
                {((totalPaidAmount / totalInvoiceValue) * 100).toFixed(0)}%
                collected
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Amount Due</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₱{totalDueAmount.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Pending collection
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Estimates */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Estimates
            </h2>
            <div className="space-y-3">
              {userEstimates.map((estimate) => (
                <Card
                  key={estimate.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => openEstimateModal(estimate)}
                >
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-sm">
                          {estimate.job_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {estimate.customer.first_name}{" "}
                          {estimate.customer.last_name}
                        </p>
                      </div>
                      {getStatusBadge(estimate.status)}
                    </div>
                    <p className="font-bold text-sm">
                      ₱{estimate.tasks_total_price.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Jobs */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Active Jobs
            </h2>
            <div className="space-y-3">
              {userActiveJobs.map((job) => (
                <Card
                  key={job.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  // onClick={() => openJobModal(job)}
                >
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-sm">{job.job_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {job?.customer?.first_name} {job?.customer?.last_name}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          job.status === "in_progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Invoices */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Recent Invoices
            </h2>
            <div className="space-y-3">
              {userInvoices.map((invoice) => (
                <Card
                  key={invoice.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  // onClick={() => openInvoiceModal(invoice)}
                >
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-sm">
                          {invoice.job_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {invoice?.customer?.first_name}{" "}
                          {invoice?.customer?.last_name}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          invoice.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Total:</span>
                        <span className="font-medium">
                          ₱{invoice.tasks_total_price.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Paid:</span>
                        <span className="text-green-600 font-medium">
                          ₱{invoice.paid_amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Modals */}
        <InfoEstimate
          setIsRejectEstimateOpen={setIsRejectEstimateOpen}
          setIsApproveEstimateOpen={setIsApproveEstimateOpen}
          estimate={selectedEstimate}
          open={isEstimateModalOpen}
          onOpenChange={setIsEstimateModalOpen}
          onButtonsClick={async (setModalOpen, value) => {
            setIsEstimateModalOpen(false);
            await wait(200);
            setModalOpen(value);
          }}
        />
        {isApproveEstimateOpen && (
          <ApproveEstimateForm
            estimate={isApproveEstimateOpen}
            open={!!isApproveEstimateOpen}
            onOpenChange={setIsApproveEstimateOpen as (open: boolean) => void}
            onSuccess={() => {
              setIsApproveEstimateOpen(false);
              fetchEstimates();
            }}
          />
        )}
        {isRejectEstimateOpen && (
          <RejectEstimateForm
            estimate={isRejectEstimateOpen}
            open={!!isRejectEstimateOpen}
            onOpenChange={setIsRejectEstimateOpen as (open: boolean) => void}
            onSuccess={() => {
              setIsRejectEstimateOpen(false);
              fetchEstimates();
            }}
          />
        )}
        {/* <InfoInvoice

          invoice={selectedInvoice}
          open={isInvoiceModalOpen}
          onOpenChange={setIsInvoiceModalOpen}
        />
        <InfoJob 
          job={selectedJob}

          open={isJobModalOpen}
          onOpenChange={setIsJobModalOpen}
        /> */}
      </div>
    </div>
  );
}
