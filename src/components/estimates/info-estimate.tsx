import { Estimate } from "@/types/estimates";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Calendar } from "lucide-react";

interface InfoEstimateProps {
  estimate: Estimate;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InfoEstimate({
  estimate,
  open,
  onOpenChange,
}: InfoEstimateProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className=" max-h-[95vh]  sm:max-w-[600px]
      "
      >
        <DialogHeader>
          <DialogTitle className="mb-4">Estimate Details </DialogTitle>
          <DialogDescription hidden>
            The info of {estimate.job_name}
          </DialogDescription>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-start ">
              <span className="text-sm font-regular text-neutral-600">
                Estimate ID
              </span>
              <span className="text-lg font-medium">EST-{estimate.id}</span>
            </div>
            <div className="flex flex-col items-start">
              <span
                className="text-sm font-regular text-neutral-600 flex items-center
              leading-none gap-1"
              >
                <Calendar size={14} color="#525252" />
                <span className="mt-1">Created Date</span>
              </span>
              <span>{}</span>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
