"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@radix-ui/react-tabs";
import { Calendar, FileText, MapPin, Plus } from "lucide-react";
import { EmptyState } from "./empty-state";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { currencyCharacter, Customer } from "@/types/database";
import { wait } from "@/utils/promise";

import { Loader } from "@/components/ui/loader";
import { Job, JOB_STATUSES } from "@/types/jobs";
import { AddJobForm } from "@/components/jobs/add-job-form";
import { InfoJob } from "@/components/jobs/info-job";
import { EditJobForm } from "@/components/jobs/edit-job-form";
import DeleteJobForm from "@/components/jobs/delete-job-form";
type JobTabProps = {
  customer: Customer;
  jobs: Job[] | null | undefined;
  mutate: () => void;
  isValidating: boolean;
};
export default function JobTab({
  customer,
  jobs,
  mutate,
  isValidating,
}: JobTabProps) {
  const [isInfoJobShown, setIsInfoJobShown] = useState<Job | false>(false);
  const [isAddJobOpen, setIsAddJobOpen] = useState<Customer | false>(false);
  const [isEditJobOpen, setIsEditJobOpen] = useState<Job | false>(false);
  const [isDeleteJobOpen, setIsDeleteJobOpen] = useState<Job | false>(false);

  const getStatusBadge = (status: string) => {
    const statusConfig = JOB_STATUSES.find((s) => s.value === status);
    if (!statusConfig) return <Badge variant="secondary">{status}</Badge>;

    return (
      <Badge variant="secondary" className={statusConfig.color + " text-xs"}>
        {statusConfig.label}
      </Badge>
    );
  };
  const reversedJob = jobs ? [...jobs].reverse() : [];
  return (
    <>
      {" "}
      {isAddJobOpen && (
        <AddJobForm
          customer={isAddJobOpen}
          open={!!isAddJobOpen}
          onOpenChange={() => setIsAddJobOpen(false)}
          onSuccess={() => {
            setIsAddJobOpen(false);
            mutate();
          }}
        />
      )}
      {isInfoJobShown && (
        <InfoJob
          job={isInfoJobShown}
          open={!!isInfoJobShown}
          setIsEditJobOpen={setIsEditJobOpen}
          setIsDeleteJobOpen={setIsDeleteJobOpen}
          onOpenChange={() => setIsInfoJobShown(false)}
          onButtonsClick={async (setModalOpen, value) => {
            setIsInfoJobShown(false);
            await wait(200);
            setModalOpen(value);
          }}
        />
      )}
      {isEditJobOpen && (
        <EditJobForm
          job={isEditJobOpen}
          open={!!isEditJobOpen}
          onOpenChange={() => setIsEditJobOpen(false)}
          onSuccess={() => {
            setIsEditJobOpen(false);
            mutate();
          }}
        />
      )}
      {isDeleteJobOpen && (
        <DeleteJobForm
          job={isDeleteJobOpen}
          open={!!isDeleteJobOpen}
          onOpenChange={() => setIsDeleteJobOpen(false)}
          onSuccess={() => {
            setIsDeleteJobOpen(false);
            setIsInfoJobShown(false);
            mutate()
          }}
        />
      )}
      <TabsContent
        value="jobs"
        className="flex-1 p-6 space-y-6 overflow-y-auto"
      >
        {isValidating && (
          <div
            className=" absolute inset-0 top-20 pb-30 flex items-center justify-center 
          backdrop-blur-sm min-h-[calc(100%-80px)]"
          >
            <Loader variant="spinner" size="xl" className="" />
          </div>
        )}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Jobs</h2>
            <p className="text-sm text-gray-500 mt-1">
              View and manage all jobs and quotes
            </p>
          </div>
          <Button onClick={() => setIsAddJobOpen(customer)} size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Create Job
          </Button>
        </div>

        <Card>
          <CardContent className="min-h-75 flex flex-col gap-3">
            {reversedJob?.map((job) => (
              <div
                key={job.id}
                onClick={() => setIsInfoJobShown(job)}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {job.job_name}
                      </h4>
                      {getStatusBadge(job.status)}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />

                        {job.site_address || job.customer.property_address}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Created:{" "}
                        {new Date(job.created_at).toLocaleDateString(undefined)}
                      </span>
                    </div>

                    {job.notes && (
                      <p className="text-xs text-gray-500 mt-2 italic">
                        Note: {job.notes}
                      </p>
                    )}
                  </div>
                  <div className="text-md font-medium">JOB-{job.id}</div>
                </div>
              </div>
            ))}
            {reversedJob.length === 0 && (
              <div>
                <EmptyState
                  icon={FileText}
                  title="No jobs yet"
                  description="Create jobs to provide quotes for your customer's projects."
                  action={{
                    label: "Create Job",
                    onClick: () => setIsAddJobOpen(customer),
                    icon: Plus,
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </>
  );
}
