"use client";

import React, { useMemo, useRef, useState } from "react";
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
import { CustomerAdd } from "@/types/customers";
import { createCustomer } from "@/services/customers";
import { currencyCharacter, Customer } from "@/types/database";
import { Plus, Trash2 } from "lucide-react";
import {
  ESTIMATE_STATUSES,
  EstimateAdd,
  EstimateStatus,
} from "@/types/estimates";
import NumberInput from "../ui/number-input";
import { createEstimate } from "@/services/estimates";

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
    tasks: [{ description: "", price: "" }],
    notes: "",
  });
  const [autoFocusTaskIndex, setAutoFocusTaskIndex] = useState<number | null>(
    null
  );
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

  const handleSelectChange = (name: string, value: string) => {
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
        status: "" as EstimateStatus,
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className=" max-h-[95vh]  sm:max-w-[600px]
      "
      >
        <DialogHeader>
          <DialogTitle>Add New Estimate</DialogTitle>
          <DialogDescription>
            Enter the estimate details below. Fields marked with * are required.
          </DialogDescription>
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

            <div className="space-y-2">
              <Label htmlFor="company_name">Job Name *</Label>
              <Input
                id="job_name"
                name="job_name"
                value={formData.job_name || ""}
                onChange={handleChange}
              />
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
                className="flex flex-col gap-2
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
                              const newFormDataDescription = formData.tasks.map(
                                (data, formIndex) => {
                                  if (formIndex === index) {
                                    return {
                                      ...data,
                                      description: e.target.value,
                                    };
                                  }
                                  return data;
                                }
                              );
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
                    {index === 0 ? (
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
                  {currencyCharacter + totalTaskPrice.toFixed(2)}
                </span>
              </div>
            </div>

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
            <div className="grid grid-cols-2 gap-4">
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
                    {ESTIMATE_STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
  );
}
