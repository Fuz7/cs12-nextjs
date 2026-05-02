import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Estimate } from "@/types/estimates";
import { useEstimates } from "@/hooks/useEstimates";

interface RejectEstimateFormProps {
  estimate: Estimate;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}
export default function RejectEstimateForm({
  estimate,
  open,
  onOpenChange,
  onSuccess,
}: RejectEstimateFormProps) {
  const [isRejecting, setIsRejecting] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [email, setEmail] = useState(estimate.customer.email || "");
  const { handleRejectEstimate } = useEstimates();
  const handleReject = async (e: FormEvent) => {
    e.preventDefault();
    setIsRejecting(true);
    try {
      const success = await handleRejectEstimate(estimate.id);
      if (success) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to convert estimate:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsRejecting(false);
    }
  };
  const now = new Date();

  const today = now.toISOString().split("T")[0]; // "YYYY-MM-DD"
  const maxDate = new Date(
    now.getFullYear() + 25, // add 5 years
    now.getMonth(),
    now.getDate(),
  )
    .toISOString()
    .split("T")[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reject Estimate</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Reject estimate{" "}
            <span className="font-bold">{estimate.job_name}</span>? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleReject}>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isRejecting}
            >
              Cancel
            </Button>
            <Button variant="destructive" type="submit" disabled={isRejecting}>
              {isRejecting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Rejecting...
                </>
              ) : (
                <>Reject Estimate</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
