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
import { deleteInvoices } from "@/services/invoices";
type DeleteInvoicesProps = {
  selectedIds?: Set<string>;
  onSuccess: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function DeleteInvoicesByBatchForm({

  selectedIds,
  onSuccess,
  open,
  onOpenChange,
}: DeleteInvoicesProps) {
  const invoiceToDelete = selectedIds || new Set<string>();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeleting(true);

    try {
      // Create invoice with proper error handling
      const response = await deleteInvoices(invoiceToDelete);

      if (response.status === "error") {
        throw new Error(response.message || "Failed to delete invoice");
      }

      // Optimistacally Update

      // Success! The invoice was created
      toast.success("Estimate deleted successfully");

      // Close the modal and close the page
      onSuccess();
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error(
        typeof error === "object" && error !== null && "message" in error
          ? String(error.message)
          : "Failed to delete invoice. Please try again."
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
            Delete {invoiceToDelete.size}{" "}
            {invoiceToDelete.size > 1 ? "invoices" : "invoice"}?
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            invoice and remove the data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"ghost"}>Cancel</Button>
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
