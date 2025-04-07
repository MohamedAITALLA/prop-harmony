
import React from 'react';
import { Clock } from 'lucide-react';
import { ICalConnection } from "@/types/api-responses";

interface ConnectionStatusBadgeProps {
  connection: ICalConnection;
}

export function ConnectionStatusBadge({ connection }: ConnectionStatusBadgeProps) {
  return (
    <div className="bg-muted/30 rounded-lg p-3 border mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="font-medium text-sm">{connection.platform}</div>
        <div className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
          {connection.status}
        </div>
      </div>
      {connection.last_synced && (
        <div className="flex items-center text-xs text-muted-foreground gap-1.5">
          <Clock className="h-3 w-3" />
          <span>Last synced: {new Date(connection.last_synced).toLocaleString()}</span>
        </div>
      )}
    </div>
  );
}
