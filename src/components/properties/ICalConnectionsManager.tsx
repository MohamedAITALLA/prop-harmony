
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { icalConnectionService } from '@/services/api-service';
import { Button } from "@/components/ui/button";
import { Plus, AlertTriangle } from "lucide-react";
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
    return <div className="flex items-center justify-center p-4">Loading iCal connections...</div>;
  }

  if (isError) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>iCal Connections</CardTitle>
          <CardDescription>Connect external calendars via iCal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4 text-red-500">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Failed to load iCal connections. Please try again later.
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => refetch()}>
            Retry
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const connections = data?.data || [];
  const connectionsMeta = data?.meta || { total: 0, active_connections: 0 };

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>iCal Connections</CardTitle>
            <CardDescription>Connect external calendars via iCal</CardDescription>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Connection
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ConnectionsTable 
          connections={connections}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onTest={handleTestClick}
        />
      </CardContent>
      <CardFooter>
        <div className="text-sm text-muted-foreground">
          {connectionsMeta.total} connection{connectionsMeta.total !== 1 ? 's' : ''} • 
          {connectionsMeta.active_connections} active
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
