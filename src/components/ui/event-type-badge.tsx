
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { EventType } from "@/types/enums";

const eventTypeBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none shadow-sm",
  {
    variants: {
      variant: {
        booking: "bg-blue-100 text-blue-800 dark:bg-blue-900/90 dark:text-blue-300 border border-blue-200 dark:border-blue-800",
        blocked: "bg-red-100 text-red-800 dark:bg-red-900/90 dark:text-red-300 border border-red-200 dark:border-red-800",
        maintenance: "bg-amber-100 text-amber-800 dark:bg-amber-900/90 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
        default: "bg-gray-100 text-gray-800 dark:bg-gray-800/90 dark:text-gray-300 border border-gray-200 dark:border-gray-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface EventTypeBadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  eventType: string;
}

export function EventTypeBadge({ className, eventType, ...props }: EventTypeBadgeProps) {
  // Determine variant based on event type
  const getVariant = () => {
    switch (eventType.toLowerCase()) {
      case EventType.BOOKING:
        return "booking";
      case EventType.BLOCKED:
        return "blocked";
      case EventType.MAINTENANCE:
        return "maintenance";
      default:
        return "default";
    }
  };

  return (
    <div
      className={cn(eventTypeBadgeVariants({ variant: getVariant() }), className)}
      {...props}
    >
      {eventType}
    </div>
  );
}
