import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

import Select from "react-select";
import { useCustomers } from "@/hooks/useCustomers";
import { Loader } from "../ui/loader";
import { Customer } from "@/types/database";
interface SearchCustomerFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (customer: Customer) => void;
}
export default function SearchCustomerForm({
  open,
  onOpenChange,
  onSuccess,
}: SearchCustomerFormProps) {
  const [isSearching, setIsSearching] = useState(false);
  const { fetchCustomers } = useCustomers();
  const [isLoading, setIsLoading] = useState(true);
  const [options, setOptions] = useState<
    { data: Customer; value: string; label: string }[]
  >([]);

  useEffect(() => {
    (async () => {
      const fetchedCustomer = await fetchCustomers();
      if (fetchedCustomer !== null) {
        const updatedOptions = fetchedCustomer.map((customer) => {
          return {
            data: customer,
            value: customer.id.toString(),
            label: customer.first_name + " " + customer.last_name,
          };
        });
        setOptions(updatedOptions);
        setIsLoading(false);
      }
    })();
  }, [fetchCustomers]);

  const [selected, setSelected] = useState<{
    data: Customer;
    value: string;
    label: string;
  } | null>(null);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    try {
      if (selected && selected.data !== null) {
        onSuccess(selected.data);
      }
    } catch (error) {
      console.error("Failed to Search customer:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Search customer</DialogTitle>
          <DialogDescription className="text-muted-foreground"></DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSearch}>
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
              placeholder="Select a customer to Search"
            />
          )}

          <DialogFooter>
            <Button
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
                <>Search customer</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
