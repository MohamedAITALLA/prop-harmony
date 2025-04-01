
import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ConflictSeverity } from "@/types/enums";

interface SeverityBadgeProps {
  severity: string;
  className?: string;
}

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const getVariant = (severity: string) => {
    switch (severity.toLowerCase()) {
      case ConflictSeverity.HIGH:
        return "destructive";
      case ConflictSeverity.MEDIUM:
        return "warning";
      case ConflictSeverity.LOW:
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <Badge
      variant={getVariant(severity)}
      className={cn("capitalize", className)}
    >
      {severity}
    </Badge>
  );
}
