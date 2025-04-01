
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { EventType } from "@/types/enums";

const eventTypeBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        booking: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        blocked: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        maintenance: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
        default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
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
