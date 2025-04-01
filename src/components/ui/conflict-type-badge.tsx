
import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ConflictType } from "@/types/enums";

interface ConflictTypeBadgeProps {
  type: string;
  className?: string;
}

export function ConflictTypeBadge({ type, className }: ConflictTypeBadgeProps) {
  const getVariant = (type: string) => {
    switch (type.toLowerCase()) {
      case ConflictType.OVERLAP:
        return "destructive";
      case ConflictType.ADJACENT:
        return "warning";
      case ConflictType.TURNOVER:
        return "default";
      default:
        return "outline";
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

  return (
    <Badge
      variant={getVariant(type)}
      className={cn("capitalize", className)}
    >
      {getLabel(type)}
    </Badge>
  );
}
