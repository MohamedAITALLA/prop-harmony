
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { icalConnectionService } from '@/services/ical-connection-service';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ICalConnection } from "@/types/api-responses";
import { Loader2, Calendar } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { ConnectionStatusBadge } from './connection-form/ConnectionStatusBadge';
import { ConnectionFormFields } from './connection-form/ConnectionFormFields';
import { useConnectionFormValidation } from '@/hooks/useConnectionFormValidation';

interface EditConnectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId: string;
  connection: ICalConnection | null;
  onConnectionChange: (connection: ICalConnection) => void;
}

export function EditConnectionDialog({ 
  open, 
  onOpenChange, 
  propertyId,
  connection,
  onConnectionChange
}: EditConnectionDialogProps) {
  const queryClient = useQueryClient();
  const { errors, validateForm } = useConnectionFormValidation();

  // Update connection mutation
  const updateMutation = useMutation({
    mutationFn: (data: { 
      connectionId: string; 
      connectionData: Partial<{ 
        platform: string; 
        ical_url: string; 
        sync_frequency: number;
      }> 
    }) => {
      return icalConnectionService.updateConnection(propertyId, data.connectionId, data.connectionData);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [`property-ical-connections-${propertyId}`] });
      onOpenChange(false);
      
      // Safely access the meta property and updated_fields
      const meta = response.data.meta;
      const updatedFields = meta.updated_fields || [];
      const fieldText = updatedFields.length > 0 
        ? `Updated ${updatedFields.join(', ')}` 
        : 'Connection updated';
        
      toast.success(fieldText, {
        description: response.data.message || "Connection updated successfully"
      });
    },
    onError: (error) => {
      toast.error("Failed to update connection", {
        description: "There was a problem updating the calendar connection."
      });
      console.error("Error updating connection:", error);
    }
  });

  const handleUpdateConnection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!connection) return;
    
    if (!validateForm(connection)) return;

    updateMutation.mutate({
      connectionId: connection._id,
      connectionData: {
        ical_url: connection.ical_url,
        sync_frequency: connection.sync_frequency,
        platform: connection.platform
      }
    });
  };
  
  if (!connection) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Edit iCal Connection
          </DialogTitle>
          <DialogDescription>
            Update your external calendar connection settings
          </DialogDescription>
        </DialogHeader>
        
        <ConnectionStatusBadge connection={connection} />
        
        <form onSubmit={handleUpdateConnection}>
          <ConnectionFormFields 
            connection={connection}
            onConnectionChange={onConnectionChange}
            errors={errors}
          />
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={updateMutation.isPending}
              className="gap-2"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : "Update Connection"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
