
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
import { deleteEstimates } from "@/services/estimates";
type DeleteEstimatesProps = {
  selectedIds?: Set<string>;
  onSuccess: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function DeleteEstimatesByBatchForm({
  selectedIds,
  onSuccess,
  open,
  onOpenChange,
}: DeleteEstimatesProps) {
  const esimatesToDelete = selectedIds || new Set<string>();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeleting(true);

    try {
      // Create estimate with proper error handling
      const response = await deleteEstimates(esimatesToDelete);

      if (response.status === "error") {
        throw new Error(response.message || "Failed to delete esimates");
      }

      // Optimistacally Update
   
      // Success! The estimate was created
      toast.success("Estimate deleted successfully");

      // Close the modal and close the page
      onSuccess();
    } catch (error) {
      console.error("Error deleting esimates:", error);
      toast.error(
        typeof error === "object" && error !== null && "message" in error
          ? String(error.message)
          : "Failed to delete esimates. Please try again."
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
            Delete {esimatesToDelete.size}{" "}
            {esimatesToDelete.size > 1 ? "esimates" : "estimate"}?
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            esimates and remove the data from our servers.
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
