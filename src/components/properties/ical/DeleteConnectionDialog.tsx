
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { icalConnectionService } from '@/services/ical-connection-service';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ICalConnection } from "@/types/api-responses";
import { Loader2, Trash2, Calendar, Link2 } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
      // Always send preserve_history=true
      return icalConnectionService.deleteConnection(propertyId, connectionId, true);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [`property-ical-connections-${propertyId}`] });
      onOpenChange(false);
      
      const action = response.data.meta?.action || "removed";
      const platform = response.data.meta?.platform || connection?.platform || "Calendar";
      
      toast.success(`${platform} connection removed`, {
        description: response.data.message || "Connection deleted successfully"
      });
      
      if (onDeleted) onDeleted();
    },
    onError: (error) => {
      toast.error("Failed to delete connection", {
        description: "There was a problem removing the calendar connection."
      });
      console.error("Error deleting connection:", error);
    }
  });

  const handleDeleteConnection = () => {
    if (!connection) return;
    deleteMutation.mutate(connection._id);
  };
  
  if (!connection) return null;
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[450px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center text-destructive gap-2">
            <Trash2 className="h-5 w-5" />
            Delete Calendar Connection
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            connection and remove all synced data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="my-4 bg-destructive/5 rounded-lg p-4 border border-destructive/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-destructive/10 p-2 rounded-md">
              <Calendar className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <h4 className="font-medium">{connection.platform}</h4>
              <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                <Link2 className="h-3 w-3" />
                <span className="truncate max-w-[300px]">{connection.ical_url}</span>
              </div>
            </div>
          </div>
        </div>
        
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel asChild>
            <Button variant="outline">Cancel</Button>
          </AlertDialogCancel>
          <Button 
            variant="destructive" 
            onClick={handleDeleteConnection}
            disabled={deleteMutation.isPending}
            className="gap-2"
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete Connection
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
