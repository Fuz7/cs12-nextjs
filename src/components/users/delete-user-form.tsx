import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteInvoice } from "@/services/invoices";
import { Invoice } from "@/types/invoices";
import { useState } from "react";
import toast from "react-hot-toast";

interface DeleteInvoiceFormProps {
  invoice: Invoice;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}
export default function DeleteInvoiceForm({
  invoice,
  open,
  onOpenChange,
  onSuccess,
}: DeleteInvoiceFormProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await deleteInvoice(invoice.id);
      if (response.status === "error") {
        throw new Error(response.message || "Failed to update invoice");
      }
      toast.success("Invoice deleted successfully");
      onSuccess();
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error("Failed to delete invoice. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Invoice</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &nbsp;
            <span className="font-bold">{invoice.job_name}</span>? This action
            cannot be undone and will permanently remove all invoice data.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Deleting...
              </>
            ) : (
              <>Delete Invoice</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
