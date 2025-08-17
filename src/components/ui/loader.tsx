import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type LoaderVariant = "spinner" | "dots" | "pulse" | "ring";
type LoaderSize = "sm" | "md" | "lg" | "xl";

interface LoaderProps {
  variant?: LoaderVariant;
  size?: LoaderSize;
  color?: string;
  className?: string;
  text?: string;
}

export const Loader = ({
  variant = "spinner",
  size = "md",
  color = "text-primary",
  className,
  text,
}: LoaderProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  const renderLoader = () => {
    switch (variant) {
      case "dots":
        return (
          <div className="flex space-x-2">
            {[0, 1, 2].map((dot) => (
              <div
                key={dot}
                className={cn(
                  "rounded-full",
                  sizeClasses[size].split(" ")[0].replace("h-", "h-2 w-"),
                  color.replace("text-", "bg-"),
                  "animate-pulse"
                )}
                style={{ animationDelay: `${dot * 0.15}s` }}
              />
            ))}
          </div>
        );

      case "pulse":
        return (
          <div
            className={cn(
              "rounded-full animate-pulse",
              sizeClasses[size],
              color.replace("text-", "bg-")
            )}
          />
        );

      case "ring":
        return (
          <div
            className={cn(
              "rounded-full border-4 border-t-transparent animate-spin",
              sizeClasses[size],
              color.replace("text-", "border-")
            )}
          />
        );

      case "spinner":
      default:
        return (
          <Loader2
            className={cn("animate-spin", sizeClasses[size], color)}
            aria-hidden="true"
          />
        );
    }
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3",
        text ? "flex-col" : "",
        className
      )}
      role="status"
      aria-label="Loading"
    >
      {renderLoader()}
      {text && <p className={cn("text-sm font-medium", color)}>{text}</p>}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

