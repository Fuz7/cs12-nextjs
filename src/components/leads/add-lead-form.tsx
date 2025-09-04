"use client";

import React, { useState } from "react";
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
import {
  LEAD_STATUSES,
  LEAD_SOURCES,
  CreateLeadData,
  LeadStatus,
} from "@/types/leads";
import { useLeads } from "@/hooks/useLeads";
import { StatusBadge } from "@/lib/badge";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface AddLeadFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddLeadForm({
  open,
  onOpenChange,
  onSuccess,
}: AddLeadFormProps) {
  const { handleCreateLead } = useLeads();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [action, setAction] = useState<LeadStatus | false>(false);
  const [formData, setFormData] = useState<Omit<CreateLeadData, "location_id">>(
    {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      company: "",
      status: "new",
      source: "",
      notes: "",
    }
  );

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
      if (!formData.first_name) {
        toast.error("First name is required");
        setIsSubmitting(false);
        return;
      }
      if (!formData.last_name) {
        toast.error("Last name is required");
        setIsSubmitting(false);
        return;
      }

      if (formData.source === "") {
        toast.error("Source is required");
        setIsSubmitting(false);
        return;
      }

      // Create lead
      const success = await handleCreateLead({
        ...formData,
      });

      if (success) {
        // Reset form data
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          company: "",
          status: "new",
          source: "",
          notes: "",
        });

        onSuccess();
      }
    } catch (error) {
      console.error("Error creating lead:", error);
      toast.error("Failed to create lead. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
      <Dialog
        open={open}
        onOpenChange={(value) => {
          onOpenChange(value);
          setFormData({
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            company: "",
            status: "new",
            source: "",
            notes: "",
          });
        }}
      >
        <DialogContent className="sm:max-w-[600px] ">
          <DialogHeader className="relative pr-25">
            <DialogTitle>Add New Lead</DialogTitle>
            <DialogDescription className="">
              Create a new lead to track potential customers. Fields marked with
              * are required.
            </DialogDescription>
            <StatusBadge
              className="absolute right-5 top-9"
              status={formData.status}
              statusList={LEAD_STATUSES}
            />
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name *</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name *</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company || ""}
                  onChange={handleChange}
                  placeholder="Enter company name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <div className="flex gap-4">
                    {LEAD_STATUSES.filter((status) =>
                      status.entry.includes(formData.status as LeadStatus)
                    ).map((statusConfig) => (
                      <Button
                        type="button"
                        key={statusConfig.value + "key"}
                        size={"sm"}
                        onClick={() =>
                          setAction(statusConfig.value as LeadStatus)
                        }
                        className={cn(statusConfig.hover, statusConfig.color)}
                      >
                        {statusConfig.value === "lost" ? <X /> : <Check />}
                        {statusConfig.label}
                      </Button>
                    ))}
                  </div>
                  {}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source">Source *</Label>
                  <Select
                    value={formData.source || ""}
                    onValueChange={(value) =>
                      handleSelectChange("source", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      {LEAD_SOURCES.map((source) => (
                        <SelectItem key={source} value={source}>
                          {source}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  setFormData({
                    first_name: "",
                    last_name: "",
                    email: "",
                    phone: "",
                    company: "",
                    status: "new",
                    source: "",
                    notes: "",
                  });
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Lead"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
