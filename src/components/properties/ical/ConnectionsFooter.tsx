
import React from 'react';

interface ConnectionsFooterProps {
  totalConnections: number;
  activeConnections: number;
}

export function ConnectionsFooter({ totalConnections, activeConnections }: ConnectionsFooterProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs">
        {totalConnections} connection{totalConnections !== 1 ? 's' : ''}
      </span>
      <span className="px-2 py-0.5 bg-green-500/10 text-green-600 rounded-full text-xs">
        {activeConnections} active
      </span>
    </div>
  );
}
