
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { icalConnectionService } from '@/services/api-service';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ICalConnection } from "@/types/api-responses";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";

interface DeleteConnectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId: string;
  connection: ICalConnection | null;
  onDeleted?: () => void;
}

export function DeleteConnectionDialog({ 
  open, 
  onOpenChange, 
  propertyId,
  connection,
  onDeleted
}: DeleteConnectionDialogProps) {
  const queryClient = useQueryClient();
  
  // Delete connection mutation
  const deleteMutation = useMutation({
    mutationFn: (connectionId: string) => {
      return icalConnectionService.deleteConnection(propertyId, connectionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`property-ical-connections-${propertyId}`] });
      onOpenChange(false);
      toast.success("Connection deleted successfully");
      if (onDeleted) onDeleted();
    },
    onError: (error) => {
      toast.error("Failed to delete connection");
      console.error("Error deleting connection:", error);
    }
  });

  const handleDeleteConnection = () => {
    if (!connection) return;
    deleteMutation.mutate(connection._id);
  };
  
  if (!connection) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Delete Connection</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this connection? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="bg-muted p-3 rounded-md">
            <p><strong>Platform:</strong> {connection.platform}</p>
            <p className="truncate"><strong>URL:</strong> {connection.ical_url}</p>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleDeleteConnection}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete Connection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
