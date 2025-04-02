
import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ConflictType } from "@/types/enums";
import { AlertTriangle, AlertCircle, Clock } from "lucide-react";

const conflictTypeBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold transition-colors focus:outline-none shadow-sm gap-1.5",
  {
    variants: {
      variant: {
        overlap: "bg-red-100 text-red-800 dark:bg-red-900/90 dark:text-red-300 border border-red-200 dark:border-red-800",
        adjacent: "bg-amber-100 text-amber-800 dark:bg-amber-900/90 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
        turnover: "bg-blue-100 text-blue-800 dark:bg-blue-900/90 dark:text-blue-300 border border-blue-200 dark:border-blue-800",
        default: "bg-gray-100 text-gray-800 dark:bg-gray-800/90 dark:text-gray-300 border border-gray-200 dark:border-gray-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface ConflictTypeBadgeProps {
  type: string;
  className?: string;
  showIcon?: boolean;
}

export function ConflictTypeBadge({ 
  type, 
  className,
  showIcon = true
}: ConflictTypeBadgeProps) {
  const getVariant = (type: string) => {
    switch (type.toLowerCase()) {
      case ConflictType.OVERLAP:
        return "overlap";
      case ConflictType.ADJACENT:
        return "adjacent";
      case ConflictType.TURNOVER:
        return "turnover";
      default:
        return "default";
    }
  };

  const getLabel = (type: string) => {
    switch (type.toLowerCase()) {
      case ConflictType.OVERLAP:
        return "Overlap";
      case ConflictType.ADJACENT:
        return "Adjacent";
      case ConflictType.TURNOVER:
        return "Turnover";
      default:
        return type;
    }
  };
  
  const getIcon = (type: string) => {
    if (!showIcon) return null;
    
    switch (type.toLowerCase()) {
      case ConflictType.OVERLAP:
        return <AlertCircle className="h-3 w-3" />;
      case ConflictType.ADJACENT:
        return <AlertTriangle className="h-3 w-3" />;
      case ConflictType.TURNOVER:
        return <Clock className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <span
      className={cn(conflictTypeBadgeVariants({ variant: getVariant(type) }), className)}
    >
      {getIcon(type)}
      {getLabel(type)}
    </span>
  );
}
