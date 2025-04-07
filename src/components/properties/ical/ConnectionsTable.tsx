
import React from 'react';
import { ICalConnection } from "@/types/api-responses";
import { Button } from "@/components/ui/button";
import { SyncStatusBadge } from "@/components/ui/sync-status-badge";
import { formatDistanceToNow } from 'date-fns';
import { Edit, Trash2, Link2, RefreshCw } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  const formatLastSync = (date: string) => {
    if (!date) return 'Never';
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch (e) {
      return 'Unknown';
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
            <TableHead className="text-right w-[140px]">Actions</TableHead>
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
                  ? 'Every hour' 
                  : `Every ${connection.sync_frequency} hours`}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onTest(connection)}
                    title="Test Connection"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onEdit(connection)}
                    title="Edit Connection"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                    onClick={() => onDelete(connection)}
                    title="Delete Connection"
                  >
                    <Trash2 className="h-4 w-4" />
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
