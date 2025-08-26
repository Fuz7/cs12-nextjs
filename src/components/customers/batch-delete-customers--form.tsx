import { Button } from "../ui/button";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Customer } from "@/types/database";
import { deleteCustomers } from "@/services/customers";
type DeleteCustomersProps = {
  selectedIds?: Set<string>;
  onSuccess: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setData?: (setter: (data: Customer[]) => Customer[]) => void;
};

export default function DeleteCustomersByBatchForm({
  selectedIds,
  onSuccess,
  open,
  onOpenChange,
  setData,
}: DeleteCustomersProps) {
  const customersToDelete = selectedIds || new Set<string>();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeleting(true);

    try {
      // Create customer with proper error handling
      const response = await deleteCustomers(customersToDelete);

      if (response.status === "error") {
        throw new Error(response.message || "Failed to delete customers");
      }

      // Optimistacally Update
      if (setData) {
        setData((customers) =>
          customers.filter((customer) => !selectedIds?.has(String(customer.id)))
        );
      }
      // Success! The customer was created
      toast.success("Customer deleted successfully");

      // Close the modal and close the page
      onSuccess();
    } catch (error) {
      console.error("Error deleting customers:", error);
      toast.error(
        typeof error === "object" && error !== null && "message" in error
          ? String(error.message)
          : "Failed to delete customers. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete {customersToDelete.size}{" "}
            {customersToDelete.size > 1 ? "customers" : "customer"}?
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            customers and remove the data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Button variant={'ghost'}>Cancel</Button>
          </DialogClose>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            variant={"destructive"}
            className="bg-destructive"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
