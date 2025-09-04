import { Badge } from "@/components/ui/badge";
import { cn } from "./utils";

type StatusBadge = {
  status?: string;
  statusList: readonly { value: string; color: string; label: string }[];
  className?: string;
};

export const StatusBadge = ({ status, statusList, className }: StatusBadge) => {
  const statusConfig = statusList.find((s) => s.value === status);
  if (!statusConfig) return <Badge variant="secondary">{status}</Badge>;

  return (
    <Badge variant="secondary" className={cn(statusConfig.color, className)}>
      {statusConfig.label}
    </Badge>
  );
};
