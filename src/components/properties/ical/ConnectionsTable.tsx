
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Edit, Trash2, Link2 } from "lucide-react";
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
      <div className="text-center py-10 border border-dashed border-muted rounded-lg bg-muted/10">
        <Link2 className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
        <p className="text-lg font-medium">No iCal connections found</p>
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
          Connect external calendars to automatically sync reservations between different booking platforms.
        </p>
      </div>
    );
  }
  
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/20">
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
                <Badge variant="outline" className="font-medium capitalize">{connection.platform}</Badge>
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
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="secondary" 
                          size="icon" 
                          onClick={() => onTest(connection)}
                          className="bg-primary/10 hover:bg-primary/20 text-primary"
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
                          variant="outline" 
                          size="icon" 
                          onClick={() => onEdit(connection)}
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
                          variant="outline" 
                          size="icon"
                          onClick={() => onDelete(connection)}
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
