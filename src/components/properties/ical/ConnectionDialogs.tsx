
import React from 'react';
import { ICalConnection } from "@/types/api-responses";
import { AddConnectionDialog } from './AddConnectionDialog';
import { EditConnectionDialog } from './EditConnectionDialog';
import { DeleteConnectionDialog } from './DeleteConnectionDialog';
import { TestConnectionDialog } from './TestConnectionDialog';

interface ConnectionDialogsProps {
  propertyId: string;
  isAddDialogOpen: boolean; 
  setIsAddDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  isTestDialogOpen: boolean;
  setIsTestDialogOpen: (open: boolean) => void;
  selectedConnection: ICalConnection | null;
  setSelectedConnection: (connection: ICalConnection | null) => void;
}

export function ConnectionDialogs({
  propertyId,
  isAddDialogOpen,
  setIsAddDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  isTestDialogOpen,
  setIsTestDialogOpen,
  selectedConnection,
  setSelectedConnection
}: ConnectionDialogsProps) {
  return (
    <>
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
    </>
  );
}
