
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { icalConnectionService } from '@/services/api-service';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Platform } from "@/types/enums";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";

interface AddConnectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId: string;
}

export function AddConnectionDialog({ open, onOpenChange, propertyId }: AddConnectionDialogProps) {
  const [newConnection, setNewConnection] = React.useState({
    platform: Platform.AIRBNB,
    ical_url: '',
    sync_frequency: 15
  });
  
  const queryClient = useQueryClient();
  
  // Create connection mutation
  const createMutation = useMutation({
    mutationFn: (connectionData: { platform: string; ical_url: string; sync_frequency?: number }) => {
      return icalConnectionService.createConnection(propertyId, connectionData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`property-ical-connections-${propertyId}`] });
      onOpenChange(false);
      toast.success("Connection created successfully");
      resetForm();
    },
    onError: (error) => {
      toast.error("Failed to create connection");
      console.error("Error creating connection:", error);
    }
  });
  
  const handleAddConnection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConnection.platform || !newConnection.ical_url) {
      toast.error("Please fill in all required fields");
      return;
    }

    createMutation.mutate({
      platform: newConnection.platform,
      ical_url: newConnection.ical_url,
      sync_frequency: newConnection.sync_frequency
    });
  };
  
  const resetForm = () => {
    setNewConnection({
      platform: Platform.AIRBNB,
      ical_url: '',
      sync_frequency: 15
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add iCal Connection</DialogTitle>
          <DialogDescription>
            Connect an external calendar using iCal URL
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAddConnection}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="platform">Platform</Label>
              <Select
                value={newConnection.platform}
                onValueChange={(value) => setNewConnection(prev => ({ ...prev, platform: value as Platform }))}
              >
                <SelectTrigger id="platform">
                  <SelectValue placeholder="Select Platform" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Platform).map((platform) => (
                    <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ical_url">iCal URL</Label>
              <Input
                id="ical_url"
                value={newConnection.ical_url}
                onChange={(e) => setNewConnection(prev => ({ ...prev, ical_url: e.target.value }))}
                placeholder="https://example.com/ical/calendar.ics"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sync_frequency">Sync Frequency (minutes)</Label>
              <Select
                value={String(newConnection.sync_frequency)}
                onValueChange={(value) => setNewConnection(prev => ({ ...prev, sync_frequency: parseInt(value) }))}
              >
                <SelectTrigger id="sync_frequency">
                  <SelectValue placeholder="Select Frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">Every 15 minutes</SelectItem>
                  <SelectItem value="30">Every 30 minutes</SelectItem>
                  <SelectItem value="45">Every 45 minutes</SelectItem>
                  <SelectItem value="60">Every hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Adding..." : "Add Connection"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
