"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { Customer } from "@/types/database";
import { JOB_STATUSES, JobAdd, JobStatus } from "@/types/jobs";
import { createJob } from "@/services/jobs";
import { StatusBadge } from "@/lib/badge";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface AddJobFormProps {
  customer: Customer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddJobForm({
  customer,
  open,
  onOpenChange,
  onSuccess,
}: AddJobFormProps) {
  // Get locations from useCustomers hook
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<JobAdd>({
    job_name: "",
    status: "pending",
    site_address: "",
    due_date: "",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [action, setAction] = useState<JobStatus | false>(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      console.log(formData);
      if (!formData.job_name || !formData.status || !formData.due_date) {
        toast.error("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }

      // Create Job with proper error handling
      const response = await createJob(formData, Number(customer.id));

      if (response.status === "error") {
        throw new Error(response.message || "Failed to create job");
      }

      // Success! The job was created
      toast.success("Job created successfully");

      // Reset form data
      setFormData({
        job_name: "",
        site_address: "",
        status: "pending",
        due_date: "",
        notes: "",
      });

      // Close the modal and refresh the page
      if (onSuccess) {
        onSuccess();
      }
      onOpenChange(false);
      router.refresh(); // Refresh the page to show the new job
    } catch (error) {
      console.error("Error creating job:", error);
      toast.error(
        typeof error === "object" && error !== null && "message" in error
          ? String(error.message)
          : "Failed to create job. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  const now = new Date();

  const today = now.toISOString().split("T")[0]; // "YYYY-MM-DD"
  const maxDate = new Date(
    now.getFullYear() + 25, // add 5 years
    now.getMonth(),
    now.getDate()
  )
    .toISOString()
    .split("T")[0];

  return (
    <>
      {action && (
        <Dialog open={!!action} onOpenChange={() => setAction(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Mark as{" "}
                {action !== "in_progress"
                  ? action.charAt(0).toLocaleUpperCase() +
                    action.slice(1).toLowerCase()
                  : "In Progress"}
                ?
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to set the status to{" "}
                {action !== "in_progress" ? action : "in progress"}?
              </DialogDescription>
            </DialogHeader>{" "}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setAction(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setFormData((formData) => {
                    return { ...formData, status: action };
                  });
                  setAction(false);
                }}
                type="button"
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className=" max-h-[95vh]  sm:max-w-[600px]
      "
        >
          <DialogHeader>
            <DialogTitle className="relative pr-10">Add New Job</DialogTitle>
            <DialogDescription>
              Enter the job details below. Fields marked with * are required.
            </DialogDescription>
            <StatusBadge
              statusList={JOB_STATUSES}
              className="absolute right-5 top-9"
              status={formData.status}
            />
          </DialogHeader>
          <form className=" relative" onSubmit={handleSubmit}>
            <div className="  grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">Customer Name </Label>
                  <Input
                    id="customer_name"
                    name="customer_name"
                    value={customer.first_name + " " + customer.last_name}
                    disabled
                    required
                  />
                </div>{" "}
                <div className="space-y-2">
                  <Label htmlFor="due_date">End Date *</Label>
                  <Input
                    min={today}
                    name="due_date"
                    id="due_date"
                    onChange={handleChange}
                    required
                    max={maxDate}
                    className="w-fit"
                    type="date"
                  ></Input>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 ">
                  <Label htmlFor="job_name">Job Name *</Label>
                  <Input
                    id="job_name"
                    name="job_name"
                    value={formData.job_name || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2 ">
                  <Label htmlFor="site_address">Site Address </Label>
                  <Input
                    id="site_address"
                    name="site_address"
                    value={formData.site_address || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <div className="flex gap-4">
                    {JOB_STATUSES.filter((status) =>
                      status.entry.includes(formData.status as JobStatus)
                    ).map((statusConfig) => (
                      <Button
                        type="button"
                        key={statusConfig.value + "key"}
                        size={"sm"}
                        onClick={() =>
                          setAction(statusConfig.value as JobStatus)
                        }
                        className={cn(statusConfig.hover, statusConfig.color)}
                      >
                        {statusConfig.value === "cancelled" ? <X /> : <Check />}
                        {statusConfig.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>{" "}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes || ""}
                  onChange={handleChange}
                  placeholder="Enter any additional notes"
                  className="resize-none"
                />
              </div>
            </div>
            <DialogFooter className="">
              <Button
                disabled={isSubmitting}
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary"
              >
                {isSubmitting ? "Creating..." : "Create Job"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
