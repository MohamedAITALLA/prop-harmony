
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
      },
      size: {
        sm: "text-xs px-1.5 py-0.5",
        md: "text-xs px-2.5 py-0.5",
        lg: "text-sm px-3 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  status: string;
}

function StatusBadge({ className, status, variant, size, ...props }: StatusBadgeProps) {
  // Map status strings to variants
  const getVariant = () => {
    switch (status.toLowerCase()) {
      case "active":
      case "success":
      case "completed":
      case "synced":
        return "success";
      case "warning":
      case "pending":
      case "partial":
        return "warning";
      case "error":
      case "failed":
      case "inactive":
        return "error";
      case "info":
      case "processing":
        return "info";
      default:
        return "default";
    }
  };

  const actualVariant = variant || getVariant();

  return (
    <div
      className={cn(statusBadgeVariants({ variant: actualVariant, size }), className)}
      {...props}
    >
      {status}
    </div>
  );
}

export { StatusBadge, statusBadgeVariants };
