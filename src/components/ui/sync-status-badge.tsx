
import React from "react";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { CheckCircle, AlertCircle, Clock, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface SyncStatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: string;
  lastSync?: string | null;
  message?: string | null;
}

// Badge configuration type
interface BadgeConfig {
  icon: React.ReactNode;
  variant: "outline";
  className: string;
  text: string;
}

/**
 * Get badge configuration based on status
 */
export function getSyncBadgeConfig(status: string): BadgeConfig {
  const statusLower = status.toLowerCase();
  
  if (statusLower === "active" || statusLower === "success" || statusLower === "synced") {
    return {
      icon: <CheckCircle className="h-3 w-3" />,
      variant: "outline",
      className: "border-green-500 text-green-500 bg-green-50",
      text: "Active"
    };
  }
  
  if (statusLower === "warning" || statusLower === "partial") {
    return {
      icon: <Clock className="h-3 w-3" />,
      variant: "outline",
      className: "border-yellow-500 text-yellow-500 bg-yellow-50",
      text: "Partial Sync"
    };
  }
  
  if (statusLower === "error" || statusLower === "failed") {
    return {
      icon: <AlertCircle className="h-3 w-3" />,
      variant: "outline",
      className: "border-red-500 text-red-500 bg-red-50",
      text: "Sync Failed"
    };
  }
  
  if (statusLower === "pending" || statusLower === "processing") {
    return {
      icon: <Clock className="h-3 w-3" />,
      variant: "outline",
      className: "border-blue-500 text-blue-500 bg-blue-50",
      text: "Pending"
    };
  }
  
  return {
    icon: <HelpCircle className="h-3 w-3" />,
    variant: "outline",
    className: "border-gray-500 text-gray-500 bg-gray-50",
    text: status
  };
}

/**
 * Format last sync time as relative time
 */
function formatLastSyncTime(lastSync: string | null): string {
  if (!lastSync) return "Never synced";
  
  try {
    const date = parseISO(lastSync);
    return `Last synced ${formatDistanceToNow(date, { addSuffix: true })}`;
  } catch (error) {
    return "Last sync date unknown";
  }
}

/**
 * Format last sync time as absolute date/time
 */
function formatTooltipDateTime(lastSync: string | null): string {
  if (!lastSync) return "No sync recorded";
  
  try {
    const date = parseISO(lastSync);
    return format(date, "PPpp");
  } catch (error) {
    return lastSync;
  }
}

export function SyncStatusBadge({ 
  status, 
  lastSync, 
  message, 
  className, 
  ...props 
}: SyncStatusBadgeProps) {
  const config = getSyncBadgeConfig(status);
  
  return (
    <div className={cn("inline-block", className)} {...props}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant={config.variant} 
              className={cn("flex items-center gap-1", config.className)}
            >
              {config.icon}
              <span>{config.text}</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <div className="space-y-1 text-sm">
              <p className="font-medium">{config.text}</p>
              <p>{formatLastSyncTime(lastSync)}</p>
              {message && <p className="text-xs opacity-80">{message}</p>}
              {lastSync && (
                <p className="text-xs opacity-70">{formatTooltipDateTime(lastSync)}</p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
