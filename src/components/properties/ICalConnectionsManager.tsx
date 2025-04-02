
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { icalConnectionService } from '@/services/api-service';
import { Button } from "@/components/ui/button";
import { Plus, AlertTriangle, Link2, RefreshCw } from "lucide-react";
import { ICalConnection } from "@/types/api-responses";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConnectionsTable } from './ical/ConnectionsTable';
import { AddConnectionDialog } from './ical/AddConnectionDialog';
import { EditConnectionDialog } from './ical/EditConnectionDialog';
import { DeleteConnectionDialog } from './ical/DeleteConnectionDialog';
import { TestConnectionDialog } from './ical/TestConnectionDialog';

interface ICalConnectionsManagerProps {
  propertyId: string;
}

interface ConnectionsResponse {
  data: ICalConnection[];
  meta?: {
    total: number;
    active_connections: number;
  };
}

export function ICalConnectionsManager({ propertyId }: ICalConnectionsManagerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<ICalConnection | null>(null);

  // Fetch all connections
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [`property-ical-connections-${propertyId}`],
    queryFn: async () => {
      const response = await icalConnectionService.getConnections(propertyId);
      return response.data as ConnectionsResponse;
    }
  });

  const handleEditClick = (connection: ICalConnection) => {
    setSelectedConnection(connection);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (connection: ICalConnection) => {
    setSelectedConnection(connection);
    setIsDeleteDialogOpen(true);
  };

  const handleTestClick = (connection: ICalConnection) => {
    setSelectedConnection(connection);
    setIsTestDialogOpen(true);
  };

  if (isLoading) {
    return (
      <Card className="mb-8 shadow-sm border-primary/10">
        <CardHeader className="bg-muted/30">
          <CardTitle>External iCal Connections</CardTitle>
          <CardDescription>Connect external calendars via iCal</CardDescription>
        </CardHeader>
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading iCal connections...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="mb-8 shadow-sm border-destructive/30">
        <CardHeader className="bg-destructive/5">
          <CardTitle>External iCal Connections</CardTitle>
          <CardDescription>Connect external calendars via iCal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-destructive/80">
            <AlertTriangle className="w-10 h-10 mb-3" />
            <p className="text-lg font-medium mb-1">Failed to load iCal connections</p>
            <p className="text-sm text-muted-foreground mb-4">We encountered a problem fetching your connections. Please try again.</p>
            <Button onClick={() => refetch()} variant="outline" className="border-destructive/30 hover:border-destructive/60">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const connections = data?.data || [];
  const connectionsMeta = data?.meta || { total: 0, active_connections: 0 };

  return (
    <Card className="mb-8 shadow-sm border-primary/10">
      <CardHeader className="bg-primary/5 border-b">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link2 className="h-5 w-5 text-primary" />
              <CardTitle>External iCal Connections</CardTitle>
            </div>
            <CardDescription>Connect external calendars via iCal</CardDescription>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="gap-1">
            <Plus className="w-4 h-4" /> Add Connection
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <ConnectionsTable 
          connections={connections}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onTest={handleTestClick}
        />
      </CardContent>
      <CardFooter className="bg-muted/10 border-t py-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs">
            {connectionsMeta.total} connection{connectionsMeta.total !== 1 ? 's' : ''}
          </span>
          <span className="px-2 py-0.5 bg-green-500/10 text-green-600 rounded-full text-xs">
            {connectionsMeta.active_connections} active
          </span>
        </div>
      </CardFooter>

      {/* Connection Dialogs */}
      <AddConnectionDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen} 
        propertyId={propertyId} 
      />
      
      <EditConnectionDialog 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen} 
        propertyId={propertyId}
        connection={selectedConnection}
        onConnectionChange={setSelectedConnection}
      />
      
      <DeleteConnectionDialog 
        open={isDeleteDialogOpen} 
        onOpenChange={setIsDeleteDialogOpen} 
        propertyId={propertyId}
        connection={selectedConnection}
        onDeleted={() => setSelectedConnection(null)}
      />
      
      <TestConnectionDialog 
        open={isTestDialogOpen} 
        onOpenChange={setIsTestDialogOpen} 
        propertyId={propertyId}
        connection={selectedConnection}
      />
    </Card>
  );
}
