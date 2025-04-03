
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Edit, Trash2, Link2, ExternalLink } from "lucide-react";
import { ConnectionStatus } from "@/types/enums";
import { ICalConnection } from "@/types/api-responses";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SyncStatusBadge } from "@/components/ui/sync-status-badge";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface ConnectionsTableProps {
  connections: ICalConnection[];
  onEdit: (connection: ICalConnection) => void;
  onDelete: (connection: ICalConnection) => void;
  onTest: (connection: ICalConnection) => void;
}

export function ConnectionsTable({ 
  connections, 
  onEdit, 
  onDelete, 
  onTest 
}: ConnectionsTableProps) {
  if (connections.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-muted rounded-lg bg-muted/10">
        <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-4">
          <Link2 className="h-8 w-8 text-primary opacity-70" />
        </div>
        <h3 className="text-lg font-medium">No iCal connections found</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
          Connect external calendars to automatically sync reservations between different booking platforms.
        </p>
      </div>
    );
  }
  
  const formatLastSynced = (date: string | null) => {
    if (!date) return 'Never';
    
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch (e) {
      return 'Unknown';
    }
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/20 sticky top-0">
          <TableRow>
            <TableHead className="w-1/5">Platform</TableHead>
            <TableHead className="w-2/5">URL</TableHead>
            <TableHead className="w-1/5">Status</TableHead>
            <TableHead className="w-1/5">Last Synced</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {connections.map((connection) => (
            <TableRow 
              key={connection._id}
              className="group hover:bg-primary/5"
            >
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant="outline" 
                    className="font-medium capitalize px-2 py-0.5 bg-primary/10 text-primary border-primary/20"
                  >
                    {connection.platform}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="max-w-xs">
                <div className="flex items-center space-x-2">
                  <div className="truncate text-sm font-mono text-muted-foreground">
                    {connection.ical_url}
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => window.open(connection.ical_url, '_blank')}
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Open URL</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableCell>
              <TableCell>
                <SyncStatusBadge
                  status={connection.status}
                  lastSync={connection.last_synced}
                  message={connection.error_message || undefined}
                />
              </TableCell>
              <TableCell>
                <span className={cn(
                  "text-sm",
                  !connection.last_synced && "text-muted-foreground italic"
                )}>
                  {formatLastSynced(connection.last_synced)}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-1.5">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => onTest(connection)}
                          className="bg-primary/5 hover:bg-primary/15 text-primary border border-primary/10 h-8 w-8"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Test Connection</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => onEdit(connection)}
                          className="hover:bg-muted border border-border/80 h-8 w-8"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit Connection</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => onDelete(connection)}
                          className="hover:bg-destructive/10 text-destructive border border-destructive/20 h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete Connection</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
