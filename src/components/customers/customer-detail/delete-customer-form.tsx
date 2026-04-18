import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteCustomers } from "@/services/customers";
import { Customer } from "@/types/database";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface DeleteCustomerFormProps {
  customer: Customer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}
export default function DeleteCustomerForm({
  customer,
  open,
  onOpenChange,
  onSuccess,
}: DeleteCustomerFormProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await deleteCustomers(new Set([String(customer.id)]));
      if (response.status === "success") {
        toast.success("Customer deleted successfully");
        router.push("/admin/dashboard/customers");
        onSuccess();
      } else {
        toast.error(response.message || "Failed to delete customer");
      }
      setIsDeleting(false);
    } catch (error) {
      console.error("Failed to delete customer:", error);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Customer</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete&nbsp;
            <b>
              {customer.first_name} {customer.last_name}
            </b>
            ? This action cannot be undone and will permanently remove all
            customer data.
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
              <>Delete Customer</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
