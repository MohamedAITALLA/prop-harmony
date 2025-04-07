
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { icalConnectionService } from '@/services/ical-connection-service';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ICalConnection } from "@/types/api-responses";
import { Loader2, Trash2, Calendar, Link2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
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
  const [eventAction, setEventAction] = useState<'keep' | 'convert' | 'deactivate'>('keep');
  
  // Delete connection mutation
  const deleteMutation = useMutation({
    mutationFn: ({ connectionId, eventAction }: {
      connectionId: string;
      eventAction: 'keep' | 'convert' | 'deactivate';
    }) => {
      // Always use preserve history true
      return icalConnectionService.deleteConnection(
        propertyId, 
        connectionId, 
        true, // Always preserve history
        eventAction
      );
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [`property-ical-connections-${propertyId}`] });
      onOpenChange(false);
      
      const action = response.data.meta?.action || "removed";
      const platform = response.data.meta?.platform || connection?.platform || "Calendar";
      
      toast.success(`${platform} connection ${action}`, {
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
    deleteMutation.mutate({
      connectionId: connection._id,
      eventAction
    });
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
            This will remove the connection while preserving related events. Choose how you want to handle existing events.
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
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Event Handling
            </Label>
            <RadioGroup value={eventAction} onValueChange={(value) => setEventAction(value as 'keep' | 'convert' | 'deactivate')}>
              <div className="flex items-center space-x-2 rounded-md border p-2">
                <RadioGroupItem value="keep" id="keep" />
                <Label htmlFor="keep" className="flex-1 cursor-pointer">Keep all events</Label>
              </div>
              
              <div className="flex items-center space-x-2 rounded-md border p-2">
                <RadioGroupItem value="convert" id="convert" />
                <Label htmlFor="convert" className="flex-1 cursor-pointer">Convert to manual events</Label>
              </div>
              
              <div className="flex items-center space-x-2 rounded-md border p-2">
                <RadioGroupItem value="deactivate" id="deactivate" />
                <Label htmlFor="deactivate" className="flex-1 cursor-pointer">Deactivate events</Label>
              </div>
            </RadioGroup>
            
            <p className="text-xs text-muted-foreground mt-2">
              {eventAction === 'keep' && "All existing events from this connection will be preserved in your calendar. Future updates from this source will no longer be synced."}
              {eventAction === 'convert' && "Existing events will be converted to manual events, disconnecting them from the original calendar source."}
              {eventAction === 'deactivate' && "Events will be marked as inactive but preserved in the system for historical reference."}
            </p>
          </div>
        </div>
        
        <AlertDialogFooter className="gap-2 mt-4">
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
