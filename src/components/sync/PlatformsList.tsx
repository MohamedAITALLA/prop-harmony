
import React from "react";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { PropertySyncConnection } from "@/types/api-responses/sync-types";
import { SyncStatusBadge } from "@/components/ui/sync-status-badge";
import { CalendarDays, Clock, AlertTriangle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { PlatformIcon } from "@/components/ui/platform-icon";

interface PlatformsListProps {
  connections?: PropertySyncConnection[];
  platforms?: string[];
}

export function PlatformsList({ connections, platforms }: PlatformsListProps) {
  // If platforms array is provided, render a simple list of platform badges
  if (platforms && platforms.length > 0) {
    return (
      <div className="flex flex-wrap gap-1">
        {platforms.map((platform, index) => (
          <Badge key={`${platform}-${index}`} variant="outline" className="flex items-center gap-1">
            <PlatformIcon platform={platform} size={12} />
            <span className="capitalize">{platform}</span>
          </Badge>
        ))}
      </div>
    );
  }
  
  // If connections are provided, render the detailed list
  if (connections && connections.length > 0) {
    return (
      <div className="space-y-4">
        {connections.map((connection, index) => (
          <div 
            key={connection.id} 
            className={`p-3 rounded-md ${
              connection.status === 'error' 
                ? 'bg-red-50 border border-red-100' 
                : connection.status === 'active' 
                  ? 'bg-green-50 border border-green-100' 
                  : 'bg-gray-50 border border-gray-100'
            }`}
          >
            <div className="flex justify-between mb-2">
              <h3 className="font-medium capitalize">{connection.platform}</h3>
              <SyncStatusBadge 
                status={connection.status} 
                lastSync={connection.last_synced}
                message={connection.error_message}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Last Sync: </span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="font-medium">
                        {formatRelativeTime(connection.last_synced)}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      {formatDate(connection.last_synced) || "Never synced"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Next Sync: </span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="font-medium">
                        {formatRelativeTime(connection.next_sync)}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      {formatDate(connection.next_sync) || "No scheduled sync"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              {connection.status === 'error' && connection.error_message && (
                <div className="flex items-start gap-1.5 col-span-2 mt-1 text-red-600">
                  <AlertTriangle className="h-3.5 w-3.5 mt-0.5" />
                  <span>{connection.error_message}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // If neither connections nor platforms are provided
  return (
    <div className="text-center py-4 text-muted-foreground">
      No connections configured
    </div>
  );
}

// Helper functions
const formatDate = (dateString: string | null) => {
  if (!dateString) return null;
  try {
    return format(parseISO(dateString), "MMM d, yyyy HH:mm");
  } catch (e) {
    return dateString;
  }
};

const formatRelativeTime = (dateString: string | null) => {
  if (!dateString) return "Never";
  try {
    return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
  } catch (e) {
    return "Unknown";
  }
};
