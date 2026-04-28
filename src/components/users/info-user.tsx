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
  UserIcon,
} from "lucide-react";
import { formatToPHDate } from "@/utils/date";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { SetStateAction } from "react";
import { User } from "@/types/users";

type Setter<T> = React.Dispatch<SetStateAction<T>>;

interface InfoUserProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setIsDeleteUserOpen: Setter<User | false>;
  setIsLinkedUserOpen: Setter<User | false>;
  setIsUnLinkedUserOpen: Setter<User | false>;
  is_user_linked: boolean;
  onButtonsClick: <T>(setter: Setter<T>, value: T) => void;
}

export function InfoUser({
  user,
  open,
  onOpenChange,
  setIsLinkedUserOpen,
  setIsDeleteUserOpen,
  setIsUnLinkedUserOpen,
  is_user_linked,
  onButtonsClick,
}: InfoUserProps) {
  const StatusBadge = ({ is_linked }: { is_linked: boolean }) => {
    return is_linked ? (
      <Badge
        variant="secondary"
        className="bg-green-100 text-green-800 hover:bg-green-100/90
         hover:text-green-800/90 absolute right-4 top-0"
      >
        Verified
      </Badge>
    ) : (
      <Badge
        variant="secondary"
        className="bg-red-100 text-red-800 hover:bg-red-100/90
         hover:text-red-800/90 absolute right-4 top-0"
      >
        Unverified
      </Badge>
    );
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className=" max-h-[95vh]  sm:max-w-[600px] 
      "
      >
        <DialogHeader className="text-start gutter">
          <DialogTitle className="mb-4">User Details </DialogTitle>
          <DialogDescription hidden>The info of {user.name}</DialogDescription>
          <div className="grid grid-cols-2 gap-4 relative">
            <div className="flex flex-col items-start ">
              <span className="text-sm font-regular text-neutral-600">
                User ID
              </span>
              <span className="text-lg font-medium">USER-{user.id}</span>
            </div>
            <div className="flex flex-col items-start">
              <span
                className="text-sm font-regular text-neutral-600 flex 
              leading-none gap-1"
              >
                <Clock size={14} color="#525252" />
                <span className="mt-0.5">Created Date</span>
              </span>
              <span className="text-lg mt-auto">
                {formatToPHDate(user.created_at)}
              </span>
            </div>
            <StatusBadge is_linked={user.is_linked} />
          </div>
        </DialogHeader>
        <Separator className="my-1 overflow-hidden gutter" />
        <div className="max-h-[60vh] overflow-y-auto gutter pr-1">
          <div className="mt-6 flex flex-col gap-4">
            <h2 className="font-medium text-lg">User Information</h2>
            <div className="flex gap-2 items-center">
              <UserIcon size={16} color="#525252" />
              <div className="flex flex-col">
                <span
                  className="text-sm font-regular text-neutral-600 flex 
              leading-none gap-1"
                >
                  User Name
                </span>
                <span>{user.name}</span>
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
                <span>{user.email}</span>
              </div>
            </div>
          </div>
        </div>
        <Separator />{" "}
        <div className="max-h-[60vh] overflow-y-auto gutter pr-1">
          <div className="flex flex-col gap-4">
            <h2 className="font-medium text-lg">Linked Customer Information</h2>

            <div className="flex gap-2 items-center">
              <UserIcon size={16} color="#525252" />
              <div className="flex flex-col">
                <span className="text-sm font-regular text-neutral-600 leading-none">
                  Customer Name
                </span>
                <span>
                  {user.customer
                    ? `${user.customer.first_name} ${user.customer.last_name}`
                    : "None"}
                </span>
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <Mail size={16} color="#525252" />
              <div className="flex flex-col">
                <span className="text-sm font-regular text-neutral-600 leading-none">
                  Email
                </span>
                <span>{user.customer ? user.customer.email : "None"}</span>
              </div>
            </div>
          </div>
        </div>
        <Separator />
        <DialogFooter className="flex sm:justify-between">
          <div className="flex gap-4 ">
            <Button
              onClick={() => setIsDeleteUserOpen(user)}
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
            {is_user_linked ? (
              <Button
                onClick={() => onButtonsClick(setIsUnLinkedUserOpen, user)}
                variant="destructive"
              >
                Unlink User
              </Button>
            ) : (
              <Button
                onClick={() => onButtonsClick(setIsLinkedUserOpen, user)}
                variant="default"
              >
                Link User
              </Button>
            )}
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
