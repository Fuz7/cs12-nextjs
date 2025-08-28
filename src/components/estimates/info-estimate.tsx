import { Estimate, ESTIMATE_STATUSES } from "@/types/estimates";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Calendar,
  DollarSign,
  FileText,
  Mail,
  MapPin,
  StickyNote,
  Trash2,
  User,
} from "lucide-react";
import { formatToPHDate } from "@/utils/date";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { SetStateAction } from "react";

type Setter<T> = React.Dispatch<SetStateAction<T>>;

interface InfoEstimateProps {
  estimate: Estimate;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setIsDeleteEstimateOpen: Setter<Estimate | false>;
  setIsEditEstimateOpen: Setter<Estimate | false>;
  onButtonsClick: <T>(setter: Setter<T>, value: T) => void;
}

export function InfoEstimate({
  estimate,
  open,
  onOpenChange,
  setIsEditEstimateOpen,
  setIsDeleteEstimateOpen,
  onButtonsClick,
}: InfoEstimateProps) {
  const totalAmount = estimate.tasks.reduce(
    (accumulator, task) => accumulator + Number(task.price),
    0
  );
  const statusConfig = ESTIMATE_STATUSES.find(
    (s) => s.value === estimate.status
  );
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className=" max-h-[95vh]  sm:max-w-[600px] 
      "
      >
        <DialogHeader className="text-start gutter">
          <DialogTitle className="mb-4">Estimate Details </DialogTitle>
          <DialogDescription hidden>
            The info of {estimate.job_name}
          </DialogDescription>
          <div className="grid grid-cols-2 gap-4 relative">
            <div className="flex flex-col items-start ">
              <span className="text-sm font-regular text-neutral-600">
                Estimate ID
              </span>
              <span className="text-lg font-medium">EST-{estimate.id}</span>
            </div>
            <div className="flex flex-col items-start">
              <span
                className="text-sm font-regular text-neutral-600 flex 
              leading-none gap-1"
              >
                <Calendar size={14} color="#525252" />
                <span className="mt-0.5">Created Date</span>
              </span>
              <span className="text-lg mt-auto">
                {formatToPHDate(estimate?.created_at as Date)}
              </span>
            </div>
            <Badge
              variant={"secondary"}
              className={cn(statusConfig?.color, "absolute right-4 top-0")}
            >
              {statusConfig?.label}
            </Badge>
          </div>
        </DialogHeader>
        <Separator className="my-1 overflow-hidden gutter" />
        <div className="max-h-[60vh] overflow-y-auto gutter pr-1">
          <div className="mt-6 flex flex-col gap-4">
            <h2 className="font-medium text-lg">Customer Information</h2>
            <div className="flex gap-2 items-center">
              <User size={16} color="#525252" />
              <div className="flex flex-col">
                <span
                  className="text-sm font-regular text-neutral-600 flex 
              leading-none gap-1"
                >
                  Customer Name
                </span>
                <span>
                  {estimate.customer.first_name +
                    " " +
                    estimate.customer.last_name}
                </span>
              </div>
            </div>{" "}
            <div className="flex gap-2 items-center">
              <Mail size={16} color="#525252" />
              <div className="flex flex-col">
                <span
                  className="text-sm font-regular text-neutral-600 flex 
              leading-none gap-1"
                >
                  Email
                </span>
                <span>{estimate.customer.email}</span>
              </div>
            </div>
          </div>
          <Separator />
          <div className="flex flex-col gap-4">
            <h2 className="font-medium text-lg">Job Information</h2>
            <div className="grid grid-cols-2">
              <div className="flex flex-col gap-4">
                <div className="flex gap-2 items-center">
                  <FileText size={16} color="#525252" />
                  <div className="flex flex-col gap-1">
                    <span
                      className="text-sm font-regular text-neutral-600 flex 
              leading-none gap-1"
                    >
                      Job Name
                    </span>
                    <span className="">{estimate.job_name}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-2 pr-2">
                  <MapPin size={16} className="text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm text-neutral-600">Site Address</p>
                    <p className="">{estimate.site_address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Separator />
          {/* Total Cost Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Estimate Total
            </h3>
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-blue-800">
                  Total Amount
                </span>
                <p className="text-2xl font-semibold text-blue-900">
                  ₱{totalAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <Separator />
          {/* Tasks Breakdown */}
          <div>
            <h3 className="text-lg font-medium mb-3">Tasks Breakdown</h3>
            <div className="space-y-3">
              {estimate.tasks.map((task, index) => (
                <div
                  key={task.id}
                  className="flex justify-between items-center p-3 bg-[#f1f1f1] rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium">{task.description}</p>
                    <p className="text-sm text-muted-foreground">
                      Task #{index + 1}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ₱{Number(task.price).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Separator />
          {/* Notes */}
          <div className="my-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <StickyNote className="w-4 h-4" />
              Notes
            </h3>
            <p className="text-muted-foreground bg-[#ebebeb] p-3 rounded-lg">
              {estimate.notes}
            </p>
          </div>
        </div>
        <DialogFooter className="flex sm:justify-between">
          <div className="flex gap-4 ">
            <Button
              onClick={() => onButtonsClick(setIsEditEstimateOpen, estimate)}
              variant={"outline"}
              className=""
            >
              Edit Estimate
            </Button>
            <Button
              onClick={() => setIsDeleteEstimateOpen(estimate)}
              variant={"outline"}
            >
              <Trash2 color="#FF2828" />
            </Button>
          </div>
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="button" className="bg-primary">
              {/* {isSubmitting ? "Creating..." : "Create Estimate"} */}
              Approve Estimate
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Separator({ className }: { className?: string }) {
  return (
    <div className={cn(`min-h-1 my-6 w-full`, className)}>
      <div
        className={cn(`min-h-[1px] max-h-[1px]  w-full  bg-neutral-300`)}
      ></div>
    </div>
  );
}
