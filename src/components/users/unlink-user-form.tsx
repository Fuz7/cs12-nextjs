import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUsers } from "@/hooks/useUsers";
import { User } from "@/types/users";
import { useState } from "react";
import toast from "react-hot-toast";

interface UnlinkUserFormProps {
  user: User; // 🔥 renamed
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function UnlinkUserForm({
  user,
  open,
  onOpenChange,
  onSuccess,
}: UnlinkUserFormProps) {
  const [isUnlinking, setIsUnlinking] = useState(false);
  const { unlinkUser } = useUsers();
  const handleUnlink = async () => {
    setIsUnlinking(true);
    try {
      const sucess = await unlinkUser(user.id); // 🔥 renamed call

      if(sucess){

        onSuccess();
      }

    } catch (error) {
      console.error("Error unlinking user:", error);
      toast.error("Failed to unlink user. Please try again.");
    } finally {
      setIsUnlinking(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Unlink User</DialogTitle>
          <DialogDescription>
            Are you sure you want to unlink&nbsp;
            <span className="font-bold">{user.name}</span>? This will remove the
            connection between the user and the customer.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUnlinking}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={handleUnlink}
            disabled={isUnlinking}
          >
            {isUnlinking ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Unlinking...
              </>
            ) : (
              <>Unlink User</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
