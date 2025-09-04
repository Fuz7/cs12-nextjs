"use client";

import React, { useMemo, useRef, useState } from "react";
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
import { currencyCharacter, Customer } from "@/types/database";
import { Check, Plus, Trash2, X } from "lucide-react";
import {
  ESTIMATE_STATUSES,
  EstimateAdd,
  EstimateStatus,
} from "@/types/estimates";
import NumberInput from "../ui/number-input";
import { createEstimate } from "@/services/estimates";
import { StatusBadge } from "@/lib/badge";
import { cn } from "@/lib/utils";

interface AddCustomerFormProps {
  customer: Customer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddEstimateForm({
  customer,
  open,
  onOpenChange,
  onSuccess,
}: AddCustomerFormProps) {
  // Get locations from useCustomers hook
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<EstimateAdd>({
    job_name: "",
    status: "draft",
    site_address: "",
    tasks: [{ description: "", price: "" }],
    notes: "",
  });
  const [autoFocusTaskIndex, setAutoFocusTaskIndex] = useState<number | null>(
    null
  );
  const [action, setAction] = useState<EstimateStatus | false>(false);

  const totalTaskPrice = useMemo(() => {
    return formData.tasks.reduce(
      (accumulator, task) => accumulator + Number(task.price),
      0
    );
  }, [formData.tasks]);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.job_name || !formData.status || !formData.tasks) {
        toast.error("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }

      // Create Estimate with proper error handling
      const response = await createEstimate(formData, Number(customer.id));

      if (response.status === "error") {
        throw new Error(response.message || "Failed to create estimate");
      }

      // Success! The estimate was created
      toast.success("Estimate created successfully");

      // Reset form data
      setFormData({
        job_name: "",
        site_address: "",
        status: "draft",
        tasks: [{ description: "", price: "" }],
        notes: "",
      });

      // Close the modal and refresh the page
      if (onSuccess) {
        onSuccess();
      }
      onOpenChange(false);
      router.refresh(); // Refresh the page to show the new estimate
    } catch (error) {
      console.error("Error creating estimate:", error);
      toast.error(
        typeof error === "object" && error !== null && "message" in error
          ? String(error.message)
          : "Failed to create estimate. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const taskContainerRef = useRef<HTMLDivElement | null>(null);

  const addTask = () => {
    if (!taskContainerRef.current) return;
    const inputs = Array.from(
      taskContainerRef.current?.getElementsByTagName("input")
    );
    const invalidInput = inputs.find((input) => !input.checkValidity());
    if (invalidInput) {
      invalidInput.reportValidity();
      return;
    }
    setFormData((form) => {
      return {
        ...form,
        tasks: [...form.tasks, { description: "", price: "" }],
      };
    });
    setAutoFocusTaskIndex(formData.tasks.length);
  };

  const removeTask = (indexToRemove: number) => {
    const removedTaskFormData = formData.tasks.filter(
      (_, index) => index !== indexToRemove
    );
    setFormData({ ...formData, tasks: removedTaskFormData });
  };

  return (
    <>
      {action && (
        <Dialog open={!!action} onOpenChange={() => setAction(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Mark as{" "}
                {action.charAt(0).toLocaleUpperCase() +
                  action.slice(1).toLowerCase()}
                ?
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to set the status to {action}?
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
          <DialogHeader className="pr-10 relative">
            <DialogTitle>Add New Estimate</DialogTitle>
            <DialogDescription>
              Enter the estimate details below. Fields marked with * are
              required.
            </DialogDescription>
            <StatusBadge
              statusList={ESTIMATE_STATUSES}
              className="absolute right-5 top-9"
              status={formData.status}
            />
          </DialogHeader>
          <form className=" relative" onSubmit={handleSubmit}>
            <div className="  grid gap-4 py-4">
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
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email </Label>
                  <Input
                    id="email"
                    name="email"
                    value={customer.email as string}
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
              <div
                ref={taskContainerRef}
                className="flex flex-col gap-2 
            "
              >
                <div className="space-y-1 flex justify-between items-center">
                  <Label htmlFor="task_description0" className="">
                    Tasks *
                  </Label>
                  <Button
                    onClick={addTask}
                    type="button"
                    className="flex items-center leading-none"
                    variant={"outline"}
                  >
                    <Plus />
                    <span className="mt-1">Add Tasks</span>
                  </Button>
                </div>
                <div
                  className="flex flex-col gap-2 pr-1
              max-h-[calc(95vh-695px)] overflow-y-auto
              "
                >
                  {formData.tasks.map((task, index) => (
                    <div
                      key={"task" + index}
                      className="bg-[#F1F1F1] rounded-sm  p-3 flex items-center"
                    >
                      <div className="flex  gap-8 flex-1">
                        <div className="flex flex-1  flex-col gap-0.5">
                          <Label
                            className="font-normal text-gray-600 text-[12px]"
                            htmlFor={`task_description${index}`}
                          >
                            Task Description
                          </Label>
                          <Input
                            autoFocus={autoFocusTaskIndex === index}
                            value={formData.tasks.at(index)?.description}
                            onChange={(e) => {
                              setFormData((formData) => {
                                const newFormDataDescription =
                                  formData.tasks.map((data, formIndex) => {
                                    if (formIndex === index) {
                                      return {
                                        ...data,
                                        description: e.target.value,
                                      };
                                    }
                                    return data;
                                  });
                                return {
                                  ...formData,
                                  tasks: newFormDataDescription,
                                };
                              });
                            }}
                            required
                            placeholder="Enter task description"
                            name={`task_description${index}`}
                            id={`task_description${index}`}
                            className="w-full border-neutral-400"
                          />
                        </div>
                        <div className="flex flex-col  gap-0.5">
                          <Label
                            className="font-normal text-gray-600 text-[12px]"
                            htmlFor="price1"
                          >
                            Price ({currencyCharacter})
                          </Label>
                          <NumberInput
                            allowFloat
                            value={String(formData.tasks.at(index)?.price)}
                            setValue={(value) => {
                              setFormData((formData) => {
                                const newFormDataPrice = formData.tasks.map(
                                  (data, formIndex) => {
                                    if (formIndex === index) {
                                      return { ...data, price: value };
                                    }
                                    return data;
                                  }
                                );
                                return { ...formData, tasks: newFormDataPrice };
                              });
                            }}
                            required
                            placeholder="0.00"
                            name={`task${index}`}
                            id={`task${index}`}
                            className="max-w-30 border-neutral-400"
                          />
                        </div>
                      </div>
                      {index === 0 && formData.tasks.length < 2 ? (
                        <div className="ml-10 mr-4 w-5"></div>
                      ) : (
                        <button
                          onClick={() => removeTask(index)}
                          type="button"
                          className="cursor-pointer"
                        >
                          <Trash2
                            size={20}
                            color="#E74640"
                            className="ml-10 mr-4"
                          />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <div
                  className="bg-[#D9E8FD] text-[#2560F2] text-sm rounded-md 
              px-4 pt-2.5 pb-2"
                >
                  Total Estimate:&nbsp;
                  <span className="font-medium">
                    {currencyCharacter +
                      totalTaskPrice.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <div className="flex gap-4">
                    {ESTIMATE_STATUSES.filter((status) =>
                      status.entry.includes(formData.status as EstimateStatus)
                    ).map((statusConfig) => (
                      <Button
                        type="button"
                        key={statusConfig.value + "key"}
                        size={"sm"}
                        onClick={() =>
                          setAction(statusConfig.value as EstimateStatus)
                        }
                        className={cn(statusConfig.hover, statusConfig.color)}
                      >
                        {statusConfig.value === "rejected" ? <X /> : <Check />}
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
                {isSubmitting ? "Creating..." : "Create Estimate"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
