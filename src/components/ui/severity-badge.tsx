
import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ConflictSeverity } from "@/types/enums";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";

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

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case ConflictSeverity.HIGH:
        return <AlertCircle className="h-3 w-3 mr-1" />;
      case ConflictSeverity.MEDIUM:
        return <AlertTriangle className="h-3 w-3 mr-1" />;
      case ConflictSeverity.LOW:
        return <Info className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  const variant = getVariant(severity);
  const icon = getSeverityIcon(severity);

  return (
    <Badge
      variant={variant as "default" | "destructive" | "outline" | "secondary"}
      className={cn("capitalize flex items-center", className)}
    >
      {icon}
      {severity.toLowerCase()}
    </Badge>
  );
}
