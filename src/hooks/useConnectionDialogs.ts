
import { useState } from 'react';
import { ICalConnection } from "@/types/api-responses";

export function useConnectionDialogs() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<ICalConnection | null>(null);

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

  return {
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isTestDialogOpen,
    setIsTestDialogOpen,
    selectedConnection,
    setSelectedConnection,
    handleEditClick,
    handleDeleteClick,
    handleTestClick,
  };
}
