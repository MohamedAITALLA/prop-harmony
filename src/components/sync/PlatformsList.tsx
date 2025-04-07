
import React from "react";
import { PlatformIcon } from "@/components/ui/platform-icon";
import { SyncStatusBadge } from "@/components/ui/sync-status-badge";
import { formatDistanceToNow } from "date-fns";
import { parseISO } from "date-fns";

interface PlatformsListProps {
  platforms?: string[];
  connections?: any[];
}

export function PlatformsList({ platforms, connections }: PlatformsListProps) {
  // If platforms array is provided, show simple platforms list
  if (platforms && platforms.length > 0) {
    return (
      <div className="flex flex-wrap gap-2">
        {platforms.map((platform, index) => (
          <div
            key={index}
            className="flex items-center gap-1.5 text-sm border rounded-md py-1 px-2"
          >
            <PlatformIcon platform={platform} size={14} />
            <span className="capitalize">{platform}</span>
          </div>
        ))}
      </div>
    );
  }

  // If connections array is provided, show detailed connections
  if (connections && connections.length > 0) {
    return (
      <div className="space-y-2">
        {connections.map((connection, index) => {
          const lastSyncTime = connection.last_synced
            ? formatDistanceToNow(parseISO(connection.last_synced), {
                addSuffix: true,
              })
            : "Never";

          return (
            <div
              key={index}
              className="flex items-center justify-between p-2 border-b last:border-b-0"
            >
              <div className="flex items-center gap-2">
                <PlatformIcon platform={connection.platform} size={16} />
                <span className="font-medium capitalize">
                  {connection.platform}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground">
                  {lastSyncTime}
                </span>
                <SyncStatusBadge status={connection.status} />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return <div className="text-muted-foreground">No platforms connected</div>;
}
