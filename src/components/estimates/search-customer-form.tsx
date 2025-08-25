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
import NumberInput from "../ui/number-input";
import { useCustomers } from "@/hooks/useCustomers";
import { Customer } from "@/types/database";

interface ConvertLeadFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (customer: Customer) => void;
}
export default function SearchCustomerForm({
  open,
  onOpenChange,
  onSuccess,
}: ConvertLeadFormProps) {
  const [isSearching, setIsSearching] = useState(false);
  const { handleSearchCustomer } = useCustomers();
  const [customerId, setCustomerId] = useState("");
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSearching(true);

    try {
      if (customerId.trim() === "") {
        toast.error("customer id is required");
        setIsSearching(false);
        return;
      }
      const customer = await handleSearchCustomer(Number(customerId));
      if (customer) {
        onSuccess(customer);
      } else {
        toast.error("Customer does not exist");
        setCustomerId("");
      }
    } catch (error) {
      console.error("Failed to search customer:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Add Estimate</DialogTitle>
          <DialogDescription className="text-muted-foreground data-[state=closed]:duration-[0ms]">
            Please enter customer id to add estimate.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="customerId">Customer ID *</Label>
            <NumberInput
              id="customerId"
              name="customerId"
              value={customerId || ""}
              setValue={setCustomerId}
              placeholder="Enter Customer ID"
              className="resize-none"
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSearching}
            >
              Cancel
            </Button>
            <Button variant="default" type="submit" disabled={isSearching}>
              {isSearching ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Searching...
                </>
              ) : (
                <>Search</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
