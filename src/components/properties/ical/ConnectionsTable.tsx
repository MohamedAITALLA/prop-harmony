
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link2, Edit2, Trash2, ExternalLink } from "lucide-react";
import { ICalConnection } from "@/types/api-responses";
import { formatDistanceToNow, parseISO } from 'date-fns';
import { SyncStatusBadge } from '@/components/ui/sync-status-badge';

interface ConnectionsTableProps {
  connections: ICalConnection[];
  onEdit: (connection: ICalConnection) => void;
  onDelete: (connection: ICalConnection) => void;
  onTest: (connection: ICalConnection) => void;
}

export function ConnectionsTable({ connections, onEdit, onDelete, onTest }: ConnectionsTableProps) {
  const formatLastSync = (lastSync: string | null) => {
    if (!lastSync) return 'Never';
    try {
      return formatDistanceToNow(parseISO(lastSync), { addSuffix: true });
    } catch {
      return 'Invalid date';
    }
  };

  if (connections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border rounded-md bg-muted/10">
        <div className="bg-primary/10 rounded-full p-3 mb-3">
          <Link2 className="h-6 w-6 text-primary/70" />
        </div>
        <h3 className="font-medium mb-1">No connections yet</h3>
        <p className="text-muted-foreground text-sm max-w-md mb-4">
          Add your first external calendar connection to sync availability and bookings
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/5 hover:bg-muted/5">
            <TableHead className="w-[180px]">Platform</TableHead>
            <TableHead className="hidden md:table-cell w-[300px]">iCal URL</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead className="hidden md:table-cell">Last Synced</TableHead>
            <TableHead className="hidden md:table-cell">Frequency</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {connections.map((connection) => (
            <TableRow key={connection._id}>
              <TableCell className="font-medium">
                {connection.platform}
                <div className="md:hidden flex items-center text-xs text-muted-foreground mt-1">
                  <SyncStatusBadge 
                    status={connection.status} 
                    lastSync={connection.last_synced} 
                    className="mt-0"
                  />
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell truncate max-w-[300px]">
                <span title={connection.ical_url} className="hover:text-primary cursor-default">
                  {connection.ical_url}
                </span>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <SyncStatusBadge 
                  status={connection.status} 
                  lastSync={connection.last_synced} 
                  message={connection.error_message} 
                />
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground">
                {formatLastSync(connection.last_synced)}
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground">
                {connection.sync_frequency} hour{connection.sync_frequency !== 1 ? 's' : ''}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    onClick={() => onTest(connection)} 
                    variant="outline" 
                    size="sm"
                    className="hidden md:flex"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="sr-only">Test</span>
                  </Button>
                  <Button 
                    onClick={() => onEdit(connection)} 
                    variant="outline" 
                    size="sm"
                    className="text-primary"
                  >
                    <Edit2 className="h-4 w-4" />
                    <span className="sr-only md:not-sr-only md:ml-2">Edit</span>
                  </Button>
                  <Button 
                    onClick={() => onDelete(connection)}
                    variant="outline"
                    size="sm"
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only md:not-sr-only md:ml-2">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
