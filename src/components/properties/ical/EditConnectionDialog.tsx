
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { icalConnectionService } from '@/services/api-service';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ConnectionStatus } from "@/types/enums";
import { ICalConnection } from "@/types/api-responses";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";

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

  // Update connection mutation
  const updateMutation = useMutation({
    mutationFn: (data: { connectionId: string; connectionData: Partial<{ platform: string; ical_url: string; sync_frequency: number; status: string; }> }) => {
      return icalConnectionService.updateConnection(propertyId, data.connectionId, data.connectionData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`property-ical-connections-${propertyId}`] });
      onOpenChange(false);
      toast.success("Connection updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update connection");
      console.error("Error updating connection:", error);
    }
  });

  const handleUpdateConnection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!connection) return;

    updateMutation.mutate({
      connectionId: connection._id,
      connectionData: {
        ical_url: connection.ical_url,
        sync_frequency: connection.sync_frequency,
        platform: connection.platform,
        status: connection.status
      }
    });
  };
  
  if (!connection) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit iCal Connection</DialogTitle>
          <DialogDescription>
            Update external calendar connection
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleUpdateConnection}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-platform">Platform</Label>
              <Input id="edit-platform" value={connection.platform} disabled />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-ical_url">iCal URL</Label>
              <Input
                id="edit-ical_url"
                value={connection.ical_url}
                onChange={(e) => onConnectionChange({ ...connection, ical_url: e.target.value })}
                placeholder="https://example.com/ical/calendar.ics"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-sync_frequency">Sync Frequency (hours)</Label>
              <Select
                value={String(connection.sync_frequency)}
                onValueChange={(value) => onConnectionChange({ ...connection, sync_frequency: parseInt(value) })}
              >
                <SelectTrigger id="edit-sync_frequency">
                  <SelectValue placeholder="Select Frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Every hour</SelectItem>
                  <SelectItem value="3">Every 3 hours</SelectItem>
                  <SelectItem value="6">Every 6 hours</SelectItem>
                  <SelectItem value="12">Every 12 hours</SelectItem>
                  <SelectItem value="24">Once a day</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={connection.status}
                onValueChange={(value) => onConnectionChange({ ...connection, status: value as ConnectionStatus })}
              >
                <SelectTrigger id="edit-status">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ConnectionStatus.ACTIVE}>Active</SelectItem>
                  <SelectItem value={ConnectionStatus.INACTIVE}>Inactive</SelectItem>
                  <SelectItem value={ConnectionStatus.ERROR}>Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Updating..." : "Update Connection"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
