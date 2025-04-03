
import React from 'react';

interface ConnectionsFooterProps {
  totalConnections: number;
  activeConnections: number;
}

export function ConnectionsFooter({ totalConnections, activeConnections }: ConnectionsFooterProps) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="flex items-center">
        <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium">
          {totalConnections} connection{totalConnections !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="flex items-center">
        <span className="px-2.5 py-1 bg-green-500/10 text-green-600 rounded-md text-xs font-medium">
          {activeConnections} active
        </span>
      </div>
      <div className="ml-auto text-xs text-muted-foreground">
        Connections refresh every 24 hours
      </div>
    </div>
  );
}
