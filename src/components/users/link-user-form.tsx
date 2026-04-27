import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLeads } from "@/hooks/useLeads";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { User } from "@/types/users";
import Select from "react-select";
import { useCustomers } from "@/hooks/useCustomers";
import { Loader } from "../ui/loader";
import { useUsers } from "@/hooks/useUsers";
interface LinkUserFormProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}
export default function LinkUserForm({
  user,
  open,
  onOpenChange,
  onSuccess,
}: LinkUserFormProps) {
  const [isLinking, setIsLinking] = useState(false);
  const { fetchUnlinkedCustomer } = useCustomers();
  const [isLoading, setIsLoading] = useState(true);
  const [options, setOptions] = useState<{ value: string; label: string }[]>(
    [],
  );
  const { linkUser } = useUsers();

  useEffect(() => {
    (async () => {
      const fetchedCustomer = await fetchUnlinkedCustomer();
      if (fetchedCustomer !== null) {
        const updatedOptions = fetchedCustomer.map((customer) => {
          return {
            value: customer.id.toString(),
            label: customer.first_name + " " + customer.last_name,
          };
        });
        setOptions(updatedOptions);
        setIsLoading(false);
      }
    })();
  }, [fetchUnlinkedCustomer]);

  const [selected, setSelected] = useState<{
    value: string;
    label: string;
  } | null>(null);

  const handleLink = async (e: FormEvent) => {
    e.preventDefault();
    setIsLinking(true);
    try {
      const success = await linkUser(selected?.value || "", user.id);
      if (success) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to link user:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLinking(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Link user</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Link user
            <span className="font-bold">{" " + user.name}</span>? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleLink}>
          {isLoading ? (
            <div className="py-4">
              <Loader text="Loading customers..." />
            </div>
          ) : (
            <Select
              options={options}
              value={selected}
              onChange={setSelected}
              isClearable
              required
              placeholder="Select a customer to link"
            />
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLinking}
            >
              Cancel
            </Button>
            <Button variant="default" type="submit" disabled={isLinking}>
              {isLinking ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Linking...
                </>
              ) : (
                <>Link user</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
