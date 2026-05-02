import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Clock,
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
import { Job, JOB_STATUSES } from "@/types/jobs";

type Setter<T> = React.Dispatch<SetStateAction<T>>;

interface InfoJobProps {
  job: Job;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setIsDeleteJobOpen: Setter<Job | false>;
  setIsEditJobOpen: Setter<Job | false>;

  onButtonsClick: <T>(setter: Setter<T>, value: T) => void;
}

export function InfoJob({
  job,
  open,
  onOpenChange,
  setIsEditJobOpen,
  setIsDeleteJobOpen,
  onButtonsClick,
}: InfoJobProps) {
  const statusConfig = JOB_STATUSES.find((s) => s.value === job.status);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className=" max-h-[95vh]  sm:max-w-[600px] 
      "
      >
        <DialogHeader className="text-start gutter">
          <DialogTitle className="mb-4">Job Details </DialogTitle>
          <DialogDescription hidden>
            The info of {job.job_name}
          </DialogDescription>
          <div className="grid grid-cols-2 gap-4 relative">
            <div className="flex flex-col items-start ">
              <span className="text-sm font-regular text-neutral-600">
                Job ID
              </span>
              <span className="text-lg font-medium">JOB-{job.id}</span>
            </div>
            <div className="flex flex-col items-start">
              <span
                className="text-sm font-regular text-neutral-600 flex 
              leading-none gap-1"
              >
                <Clock size={14} color="#525252" />
                <span className="mt-0.5">End Date</span>
              </span>
              <span className="text-lg mt-auto">
                {formatToPHDate(job?.created_at as Date)}
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
                  {job.customer.first_name + " " + job.customer.last_name}
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
                <span>{job.customer.email}</span>
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
                    <span className="">{job.job_name}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-2 pr-2">
                  <MapPin size={16} className="text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm text-neutral-600">Site Address</p>
                    <p className="">
                      {job.site_address || job.customer.property_address}
                    </p>
                  </div>
                </div>
              </div>
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
              {job.notes}
            </p>
          </div>
        </div>
        <DialogFooter className="flex sm:justify-between">
          <div className="flex gap-4 ">
            <Button onClick={() => setIsDeleteJobOpen(job)} variant={"outline"}>
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
            </Button>{" "}
            <Button
              onClick={() => onButtonsClick(setIsEditJobOpen, job)}
              variant={"default"}
              className=""
            >
              Edit Job
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
