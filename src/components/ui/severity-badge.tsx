
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { NotificationSeverity } from "@/types/enums";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";

const severityBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold transition-colors focus:outline-none shadow-sm gap-1.5",
  {
    variants: {
      severity: {
        critical: "bg-red-100 text-red-800 dark:bg-red-900/90 dark:text-red-300 border border-red-200 dark:border-red-800",
        warning: "bg-amber-100 text-amber-800 dark:bg-amber-900/90 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
        info: "bg-blue-100 text-blue-800 dark:bg-blue-900/90 dark:text-blue-300 border border-blue-200 dark:border-blue-800",
        default: "bg-gray-100 text-gray-800 dark:bg-gray-800/90 dark:text-gray-300 border border-gray-200 dark:border-gray-700",
      },
    },
    defaultVariants: {
      severity: "default",
    },
  }
);

interface SeverityBadgeProps {
  severity: NotificationSeverity | string;
  className?: string;
  showIcon?: boolean;
}

export function SeverityBadge({ 
  severity,
  className,
  showIcon = true
}: SeverityBadgeProps) {
  // Map severities to appropriate variants
  const getSeverity = () => {
    switch (severity) {
      case NotificationSeverity.CRITICAL:
        return "critical";
      case NotificationSeverity.WARNING:
        return "warning";
      case NotificationSeverity.INFO:
        return "info";
      default:
        return "default";
    }
  };

  // Get appropriate label
  const getLabel = () => {
    switch (severity) {
      case NotificationSeverity.CRITICAL:
        return "Critical";
      case NotificationSeverity.WARNING:
        return "Warning";
      case NotificationSeverity.INFO:
        return "Info";
      default:
        return severity;
    }
  };
  
  // Get icon based on severity
  const getIcon = () => {
    if (!showIcon) return null;
    
    switch (severity) {
      case NotificationSeverity.CRITICAL:
        return <AlertCircle className="h-3 w-3" />;
      case NotificationSeverity.WARNING:
        return <AlertTriangle className="h-3 w-3" />;
      case NotificationSeverity.INFO:
        return <Info className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <span
      className={cn(severityBadgeVariants({ severity: getSeverity() }), className)}
    >
      {getIcon()}
      {getLabel()}
    </span>
  );
}
