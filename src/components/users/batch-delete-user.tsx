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
import { deleteUsers } from "@/services/users";
type DeleteUsersProps = {
  selectedIds?: Set<string>;
  onSuccess: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function DeleteUsersByBatchForm({

  selectedIds,
  onSuccess,
  open,
  onOpenChange,
}: DeleteUsersProps) {
  const userToDelete = selectedIds || new Set<string>();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeleting(true);

    try {
      // Create user with proper error handling
      const response = await deleteUsers(userToDelete);

      if (response.status === "error") {
        throw new Error(response.message || "Failed to delete user");
      }

      // Optimistacally Update

      // Success! The user was created
      toast.success("Estimate deleted successfully");

      // Close the modal and close the page
      onSuccess();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(
        typeof error === "object" && error !== null && "message" in error
          ? String(error.message)
          : "Failed to delete user. Please try again."
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
            Delete {userToDelete.size}{" "}
            {userToDelete.size > 1 ? "users" : "user"}?
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            user and remove the data from our servers.
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
