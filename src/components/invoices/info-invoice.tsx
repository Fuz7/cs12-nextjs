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
  CreditCard,
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
import { Invoice, INVOICE_STATUSES } from "@/types/invoices";

type Setter<T> = React.Dispatch<SetStateAction<T>>;

interface InfoInvoiceProps {
  invoice: Invoice;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setIsDeleteInvoiceOpen: Setter<Invoice | false>;
  setIsEditInvoiceOpen: Setter<Invoice | false>;

  onButtonsClick: <T>(setter: Setter<T>, value: T) => void;
}

export function InfoInvoice({
  invoice,
  open,
  onOpenChange,
  setIsEditInvoiceOpen,
  setIsDeleteInvoiceOpen,
  onButtonsClick,
}: InfoInvoiceProps) {
  const totalAmount = invoice.tasks.reduce(
    (accumulator, task) => accumulator + Number(task.price),
    0
  );
  const remainingBalance =
    Number(invoice.tasks_total_price) - Number(invoice.paid_amount);
  const statusConfig = INVOICE_STATUSES.find((s) => s.value === invoice.status);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className=" max-h-[95vh]  sm:max-w-[600px] 
      "
      >
        <DialogHeader className="text-start gutter">
          <DialogTitle className="mb-4">Invoice Details </DialogTitle>
          <DialogDescription hidden>
            The info of {invoice.job_name}
          </DialogDescription>
          <div className="grid grid-cols-2 gap-4 relative">
            <div className="flex flex-col items-start ">
              <span className="text-sm font-regular text-neutral-600">
                Invoice ID
              </span>
              <span className="text-lg font-medium">EST-{invoice.id}</span>
            </div>
            <div className="flex flex-col items-start">
              <span
                className="text-sm font-regular text-neutral-600 flex 
              leading-none gap-1"
              >
                <Calendar size={14} color="#525252" />
                <span className="mt-0.5">Due Date</span>
              </span>
              <span className="text-lg mt-auto">
                {formatToPHDate(invoice.due_date)}
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
                  {invoice.customer.first_name +
                    " " +
                    invoice.customer.last_name}
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
                <span>{invoice.customer.email}</span>
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
                    <span className="">{invoice.job_name}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-2 pr-2">
                  <MapPin size={16} className="text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm text-neutral-600">Site Address</p>
                    <p className="">
                      {invoice.site_address ||
                        invoice.customer.property_address}
                    </p>
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
              Invoice Total
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
              {invoice.tasks.map((task, index) => (
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
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Paid Amount */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Paid Amount
                  </span>
                </div>
                <p className="text-xl font-bold text-green-900">
                  ₱{invoice.paid_amount.toLocaleString()}
                </p>
              </div>

              {/* Remaining Balance */}
              <div
                className={`p-4 rounded-lg border ${
                  remainingBalance > 0
                    ? "bg-red-50 border-red-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign
                    className={`w-4 h-4 ${
                      remainingBalance > 0 ? "text-red-600" : "text-gray-600"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      remainingBalance > 0 ? "text-red-800" : "text-gray-800"
                    }`}
                  >
                    {remainingBalance > 0 ? "Amount Due" : "Fully Paid"}
                  </span>
                </div>
                <p
                  className={`text-xl font-bold ${
                    remainingBalance > 0 ? "text-red-900" : "text-gray-900"
                  }`}
                >
                  ₱{remainingBalance.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          {/* Notes */}
          <div className="my-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <StickyNote className="w-4 h-4" />
              Notes
            </h3>
            <p className="text-muted-foreground bg-[#ebebeb] p-3 rounded-lg">
              {invoice.notes}
            </p>
          </div>
        </div>
        <DialogFooter className="flex sm:justify-between">
          <div className="flex gap-4 ">
            <Button
              onClick={() => setIsDeleteInvoiceOpen(invoice)}
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
            </Button>{" "}
            <Button
              onClick={() => onButtonsClick(setIsEditInvoiceOpen, invoice)}
              variant={"default"}
              className=""
            >
              Edit Invoice
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
