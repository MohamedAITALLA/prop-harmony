
import React, { useState } from 'react';
import { ICalConnection } from "@/types/api-responses";
import { Button } from "@/components/ui/button";
import { SyncStatusBadge } from "@/components/ui/sync-status-badge";
import { toast } from "sonner";
import { formatDistanceToNow } from 'date-fns';
import { Edit, Trash2, Link2, RefreshCw, Loader2 } from "lucide-react";
import { icalConnectionService } from "@/services/ical-connection-service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ConnectionsTableProps {
  connections: ICalConnection[];
  propertyId: string;
  onEdit: (connection: ICalConnection) => void;
  onDelete: (connection: ICalConnection) => void;
  onTest: (connection: ICalConnection) => void;
  onSyncComplete?: () => void;
}

export function ConnectionsTable({ 
  connections, 
  propertyId,
  onEdit, 
  onDelete, 
  onTest,
  onSyncComplete
}: ConnectionsTableProps) {
  const [syncingConnectionId, setSyncingConnectionId] = useState<string | null>(null);

  const formatLastSync = (date: string) => {
    if (!date) return 'Never';
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch (e) {
      return 'Unknown';
    }
  };

  const handleSyncConnection = async (connection: ICalConnection) => {
    if (!propertyId || !connection._id) return;
    
    setSyncingConnectionId(connection._id);
    
    try {
      const response = await icalConnectionService.syncConnection(propertyId, connection._id);
      
      if (response.data.success) {
        const syncData = response.data.data;
        toast.success(`Synced ${connection.platform} calendar successfully`, {
          description: `Processed ${syncData.events_synced} events (${syncData.events_created} created, ${syncData.events_updated} updated)`,
        });
        
        // Notify parent component that sync is complete
        if (onSyncComplete) {
          onSyncComplete();
        }
      } else {
        toast.error(`Failed to sync ${connection.platform} calendar`);
      }
    } catch (error) {
      console.error("Error syncing connection:", error);
      toast.error(`Error syncing ${connection.platform} calendar`, {
        description: (error as Error)?.message || "Unknown error occurred"
      });
    } finally {
      setSyncingConnectionId(null);
    }
  };

  if (connections.length === 0) {
    return (
      <div className="border rounded-md p-8 text-center">
        <h3 className="text-lg font-medium text-muted-foreground mb-2">No iCal Connections</h3>
        <p className="max-w-md mx-auto text-sm text-muted-foreground">
          You haven't added any external calendar connections yet. Add your first one by clicking the "Add Connection" button above.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Platform</TableHead>
            <TableHead>iCal URL</TableHead>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead className="w-[120px]">Last Sync</TableHead>
            <TableHead className="w-[100px]">Frequency</TableHead>
            <TableHead className="text-right w-[180px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {connections.map((connection) => (
            <TableRow key={connection._id}>
              <TableCell className="font-medium">
                {connection.platform}
              </TableCell>
              <TableCell className="max-w-[300px] truncate">
                <div className="flex items-center gap-1.5">
                  <Link2 className="h-3.5 w-3.5 text-muted-foreground/70" />
                  <span className="truncate" title={connection.ical_url}>
                    {connection.ical_url}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <SyncStatusBadge 
                  status={connection.status} 
                  lastSync={connection.last_synced} 
                  message={connection.error_message} 
                />
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatLastSync(connection.last_synced)}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {connection.sync_frequency === 1 
                  ? 'Every minute' 
                  : `Every ${connection.sync_frequency} minutes`}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleSyncConnection(connection)}
                          disabled={syncingConnectionId === connection._id}
                        >
                          {syncingConnectionId === connection._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Sync Now</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => onTest(connection)}
                        >
                          <RefreshCw className="h-4 w-4 text-blue-500" />
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
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                          onClick={() => onDelete(connection)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete</p>
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
