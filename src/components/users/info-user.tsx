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
   <div></div>
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
