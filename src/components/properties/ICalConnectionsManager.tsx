
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { ConnectionsTable } from './ical/ConnectionsTable';
import { LoadingState } from './ical/LoadingState';
import { ErrorState } from './ical/ErrorState';
import { ConnectionDialogs } from './ical/ConnectionDialogs';
import { ConnectionsHeader } from './ical/ConnectionsHeader';
import { ConnectionsFooter } from './ical/ConnectionsFooter';
import { useConnectionDialogs } from '@/hooks/useConnectionDialogs';
import { useICalConnections } from '@/hooks/useICalConnections';

interface ICalConnectionsManagerProps {
  propertyId: string;
}

export function ICalConnectionsManager({ propertyId }: ICalConnectionsManagerProps) {
  const {
    isAddDialogOpen, setIsAddDialogOpen,
    isEditDialogOpen, setIsEditDialogOpen,
    isDeleteDialogOpen, setIsDeleteDialogOpen,
    isTestDialogOpen, setIsTestDialogOpen,
    selectedConnection, setSelectedConnection,
    handleEditClick, handleDeleteClick, handleTestClick
  } = useConnectionDialogs();

  const { connections, connectionsMeta, isLoading, isError, refetch } = useICalConnections(propertyId);

  const handleSyncComplete = () => {
    // Refetch the connections to get the updated data
    refetch();
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState onRetry={refetch} />;
  }

  return (
    <Card className="mb-8 shadow-md border-primary/10 overflow-hidden">
      <CardHeader className="bg-primary/5 border-b px-6">
        <ConnectionsHeader onAddClick={() => setIsAddDialogOpen(true)} />
      </CardHeader>
      <CardContent className="pt-6 px-6">
        <ConnectionsTable 
          connections={connections}
          propertyId={propertyId}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onTest={handleTestClick}
          onSyncComplete={handleSyncComplete}
        />
      </CardContent>
      <CardFooter className="bg-muted/10 border-t py-4 px-6 flex justify-between">
        <ConnectionsFooter 
          totalConnections={connectionsMeta.total}
          activeConnections={connectionsMeta.active_connections}
        />
      </CardFooter>

      {/* Connection Dialogs */}
      <ConnectionDialogs 
        propertyId={propertyId}
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        isTestDialogOpen={isTestDialogOpen}
        setIsTestDialogOpen={setIsTestDialogOpen}
        selectedConnection={selectedConnection}
        setSelectedConnection={setSelectedConnection}
      />
    </Card>
  );
}
