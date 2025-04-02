
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Edit, Trash2 } from "lucide-react";
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
      <div className="text-center py-6">
        <p className="text-muted-foreground">No iCal connections found</p>
        <p className="text-sm text-muted-foreground mt-2">
          Add connections to sync calendars from other platforms
        </p>
      </div>
    );
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Platform</TableHead>
          <TableHead>URL</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last Synced</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {connections.map((connection) => (
          <TableRow key={connection._id}>
            <TableCell>
              <Badge variant="outline">{connection.platform}</Badge>
            </TableCell>
            <TableCell className="max-w-xs truncate">{connection.ical_url}</TableCell>
            <TableCell>
              <Badge
                variant={connection.status === ConnectionStatus.ACTIVE ? "outline" : 
                  connection.status === ConnectionStatus.ERROR ? "destructive" : "default"}
                className={connection.status === ConnectionStatus.ACTIVE ? "border-green-500 text-green-500" : ""}
              >
                {connection.status}
              </Badge>
            </TableCell>
            <TableCell>{connection.last_synced ? new Date(connection.last_synced).toLocaleString() : 'Never'}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => onTest(connection)}
                  title="Test Connection"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => onEdit(connection)}
                  title="Edit Connection"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
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
  );
}
