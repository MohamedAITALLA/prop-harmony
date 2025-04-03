
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link2, Edit2, Trash2, ExternalLink, Copy, Check } from "lucide-react";
import { ICalConnection } from "@/types/api-responses";
import { formatDistanceToNow, parseISO } from 'date-fns';
import { SyncStatusBadge } from '@/components/ui/sync-status-badge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { toast } from "sonner";

interface ConnectionsTableProps {
  connections: ICalConnection[];
  onEdit: (connection: ICalConnection) => void;
  onDelete: (connection: ICalConnection) => void;
  onTest: (connection: ICalConnection) => void;
}

export function ConnectionsTable({ connections, onEdit, onDelete, onTest }: ConnectionsTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const formatLastSync = (lastSync: string | null) => {
    if (!lastSync) return 'Never';
    try {
      return formatDistanceToNow(parseISO(lastSync), { addSuffix: true });
    } catch {
      return 'Invalid date';
    }
  };

  const handleCopyUrl = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      toast.success("iCal URL copied to clipboard");
      
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch (err) {
      toast.error("Failed to copy URL");
    }
  };

  if (connections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg bg-muted/5">
        <div className="bg-primary/10 rounded-full p-4 mb-4">
          <Link2 className="h-7 w-7 text-primary/70" />
        </div>
        <h3 className="text-lg font-medium mb-2">No connections yet</h3>
        <p className="text-muted-foreground text-sm max-w-md mb-4 px-4">
          Add your first external calendar connection to sync availability and bookings
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/5 hover:bg-muted/5">
            <TableHead className="w-[180px] py-4">Platform</TableHead>
            <TableHead className="hidden md:table-cell w-[300px]">iCal URL</TableHead>
            <TableHead className="hidden md:table-cell w-[120px]">Status</TableHead>
            <TableHead className="hidden md:table-cell">Last Synced</TableHead>
            <TableHead className="hidden md:table-cell">Frequency</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {connections.map((connection) => (
            <TableRow key={connection._id} className="hover:bg-muted/5">
              <TableCell className="font-medium py-4">
                {connection.platform}
                <div className="md:hidden flex items-center text-xs text-muted-foreground mt-1">
                  <SyncStatusBadge 
                    status={connection.status} 
                    lastSync={connection.last_synced} 
                    className="mt-0"
                  />
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell max-w-[300px] group">
                <div className="flex items-center gap-2">
                  <div className="truncate text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {connection.ical_url}
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleCopyUrl(connection.ical_url, connection._id)}
                        >
                          {copiedId === connection._id ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy iCal URL</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <SyncStatusBadge 
                  status={connection.status} 
                  lastSync={connection.last_synced} 
                />
              </TableCell>
              <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                {formatLastSync(connection.last_synced)}
              </TableCell>
              <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                {connection.sync_frequency} hour{connection.sync_frequency !== 1 ? 's' : ''}
              </TableCell>
              <TableCell className="text-right pr-4">
                <div className="flex justify-end gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          onClick={() => onTest(connection)} 
                          variant="outline" 
                          size="sm"
                          className="hidden md:flex h-8"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Test connection</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          onClick={() => onEdit(connection)} 
                          variant="outline" 
                          size="sm"
                          className="text-primary h-8"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit connection</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          onClick={() => onDelete(connection)}
                          variant="outline"
                          size="sm"
                          className="text-destructive h-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete connection</p>
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
