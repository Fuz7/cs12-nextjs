"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Job, JOB_STATUSES, JobAdd } from "@/types/jobs";
import {  editJob } from "@/services/jobs";

interface EditJobFormProps {
  job: Job;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditJobForm({
  job,
  open,
  onOpenChange,
  onSuccess,
}: EditJobFormProps) {
  // Get locations from useCustomers hook
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  console.log(job.due_date)
  const [formData, setFormData] = useState<JobAdd>({
    job_name: job.job_name,
    status: job.status,
    site_address: job.site_address,
    due_date: job.due_date,
    notes: job.notes,
  });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.job_name || !formData.status || !formData.due_date) {
        toast.error("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }

      // Edit Job with proper error handling
      const response = await editJob(formData, Number(job.id),);

      if (response.status === "error") {
        throw new Error(response.message || "Failed to edit job");
      }

      // Success! The job was edited
      toast.success("Job edited successfully");

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
      console.error("Error editing job:", error);
      toast.error(
        typeof error === "object" && error !== null && "message" in error
          ? String(error.message)
          : "Failed to edit job. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  const now = new Date();

  const today = now.toISOString().split("T")[0]; // "YYYY-MM-DD"
  const maxDate = new Date(
    now.getFullYear() + 25, // Edit 5 years
    now.getMonth(),
    now.getDate()
  )
    .toISOString()
    .split("T")[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className=" max-h-[95vh]  sm:max-w-[600px]
      "
      >
        <DialogHeader>
          <DialogTitle>Edit Job</DialogTitle>
          <DialogDescription>
            Enter the job details below. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <form className=" relative" onSubmit={handleSubmit}>
          <div className="  grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">Customer Name </Label>
                <Input
                  id="customer_name"
                  name="customer_name"
                  value={job.customer.first_name + " " + job.customer.last_name}
                  disabled
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email </Label>
                <Input
                  id="email"
                  name="email"
                  value={job.customer.email as string}
                  disabled
                  required
                />
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
                <Label htmlFor="due_date">Due Date *</Label>
                <Input
                  min={today}
                  name="due_date"
                  id="due_date"
                  onChange={handleChange}
                  value={formData.due_date}
                  required
                  max={maxDate}
                  className="w-fit"
                  type="date"
                ></Input>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status || "new"}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              {isSubmitting ? "Editing..." : "Edit Job"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
