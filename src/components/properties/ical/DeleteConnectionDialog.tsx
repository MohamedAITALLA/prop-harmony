
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { icalConnectionService } from '@/services/ical-connection-service';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ICalConnection } from "@/types/api-responses";
import { Loader2, Trash2, Calendar, Link2, AlertTriangle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  const [preserveHistory, setPreserveHistory] = useState(true);
  const [eventAction, setEventAction] = useState<'delete' | 'deactivate' | 'convert' | 'keep'>('keep');
  
  // Delete connection mutation
  const deleteMutation = useMutation({
    mutationFn: ({ connectionId, preserveHistory, eventAction }: {
      connectionId: string;
      preserveHistory: boolean;
      eventAction: 'delete' | 'deactivate' | 'convert' | 'keep';
    }) => {
      return icalConnectionService.deleteConnection(
        propertyId, 
        connectionId, 
        preserveHistory,
        eventAction
      );
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [`property-ical-connections-${propertyId}`] });
      onOpenChange(false);
      
      const action = response.data.meta?.action || "removed";
      const platform = response.data.meta?.platform || connection?.platform || "Calendar";
      const eventsAffected = response.data.meta?.events_affected || 0;
      
      let description = response.data.message || "Connection deleted successfully";
      if (eventsAffected > 0) {
        description += ` ${eventsAffected} events were ${eventAction === 'keep' ? 'kept' : eventAction + 'd'}.`;
      }
      
      toast.success(`${platform} connection ${action}`, {
        description
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
      preserveHistory,
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
            This action cannot be undone. This will remove the connection and handle related events according to your settings below.
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
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <Label htmlFor="preserve-history" className="text-sm font-medium">
                Preserve Connection History
              </Label>
              <span className="text-xs text-muted-foreground">
                Keeps the connection in the database but marks it as inactive
              </span>
            </div>
            <Switch 
              id="preserve-history" 
              checked={preserveHistory}
              onCheckedChange={setPreserveHistory}
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Event Handling
            </Label>
            <RadioGroup value={eventAction} onValueChange={(value: any) => setEventAction(value)}>
              <div className="flex items-center space-x-2 rounded-md border p-2">
                <RadioGroupItem value="keep" id="keep" />
                <Label htmlFor="keep" className="flex-1 cursor-pointer">Keep all events</Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border p-2">
                <RadioGroupItem value="deactivate" id="deactivate" />
                <Label htmlFor="deactivate" className="flex-1 cursor-pointer">Deactivate events</Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border p-2">
                <RadioGroupItem value="convert" id="convert" />
                <Label htmlFor="convert" className="flex-1 cursor-pointer">Convert to manual events</Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border p-2">
                <RadioGroupItem value="delete" id="delete" />
                <Label htmlFor="delete" className="flex-1 cursor-pointer text-destructive font-medium">Delete all events</Label>
              </div>
            </RadioGroup>
            
            {eventAction === 'delete' && (
              <div className="flex items-center gap-2 bg-yellow-50 text-yellow-800 p-2 rounded-md border border-yellow-200 mt-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="text-xs">Warning: This will permanently delete all events from this connection.</span>
              </div>
            )}
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
