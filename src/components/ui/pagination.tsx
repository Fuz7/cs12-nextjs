"use client";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "./input";
function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}
function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}
function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}
type PaginationButtonProps = {
  isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"button">;
function PaginationButton({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationButtonProps) {
  return (
    <Button
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-button"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "default" : "default",
          size,
        }),
        !isActive && "bg-white text-black hover:bg-accent",
        className
      )}
      {...props}
    />
  );
}
function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationButton>) {
  return (
    <PaginationButton
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">Previous</span>
    </PaginationButton>
  );
}
function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationButton>) {
  return (
    <PaginationButton
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon />
    </PaginationButton>
  );
}

type PaginationEllipsisProps = React.ComponentProps<"button"> & {
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  maxPage: number;
};
function PaginationEllipsis({
  className,
  onBlur,
  maxPage,
  ...props
}: PaginationEllipsisProps) {
  const [isClicked, setIsClicked] = useState(false);
  const [input, setInput] = useState("");
  return isClicked ? (
    <Input
      value={input}
      onBlur={(e) => {
        setIsClicked(false);
        onBlur?.(e);
      }}
      onChange={(e) => {
        const value = e.target.value;

        if (value === "") {
          setInput(value);
          return;
        }

        // If it doesn't match the pattern, exit early
        if (!/^[1-9][0-9]*$/.test(value)) return;

        const numericValue = parseInt(value, 10);
        if (numericValue > maxPage) {
          setInput(String(maxPage));
        } else {
          setInput(value);
        }
      }}
      onKeyDownCapture={(e) => {
        if (e.key === "Enter") {
          (e.target as HTMLInputElement).blur();
        }
      }}
      className="w-14"
      autoFocus
    ></Input>
  ) : (
    <button
      onClick={() => setIsClicked(true)}
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </button>
  );
}
export {
  Pagination,
  PaginationContent,
  PaginationButton,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
