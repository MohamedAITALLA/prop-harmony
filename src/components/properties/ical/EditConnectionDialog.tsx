import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { icalConnectionService } from '@/services/ical-connection-service';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ICalConnection } from "@/types/api-responses";
import { Loader2, AlertCircle, Link2, Calendar, Clock } from "lucide-react";
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
  const [errors, setErrors] = useState<{ical_url?: string}>({});

  // Update connection mutation
  const updateMutation = useMutation({
    mutationFn: (data: { connectionId: string; connectionData: Partial<{ platform: string; ical_url: string; sync_frequency: number; }> }) => {
      return icalConnectionService.updateConnection(propertyId, data.connectionId, data.connectionData);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [`property-ical-connections-${propertyId}`] });
      onOpenChange(false);
      
      const updatedFields = response.data.meta?.updated_fields || [];
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

  const validateForm = () => {
    const newErrors: {ical_url?: string} = {};
    let isValid = true;
    
    if (!connection?.ical_url || !connection.ical_url.trim()) {
      newErrors.ical_url = "iCal URL is required";
      isValid = false;
    } else if (!connection.ical_url.startsWith('http')) {
      newErrors.ical_url = "URL must start with http:// or https://";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleUpdateConnection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!connection) return;
    
    if (!validateForm()) return;

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
        
        <div className="bg-muted/30 rounded-lg p-3 border mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium text-sm">{connection.platform}</div>
            {/* Keep status display but remove editing capability */}
            <div className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              {connection.status}
            </div>
          </div>
          {connection.last_synced && (
            <div className="flex items-center text-xs text-muted-foreground gap-1.5">
              <Clock className="h-3 w-3" />
              <span>Last synced: {new Date(connection.last_synced).toLocaleString()}</span>
            </div>
          )}
        </div>
        
        <form onSubmit={handleUpdateConnection}>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="edit-platform">
                <div className="flex items-center gap-1.5 mb-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Platform Name
                </div>
              </Label>
              <Input
                id="edit-platform"
                value={connection.platform}
                onChange={(e) => onConnectionChange({ ...connection, platform: e.target.value })}
                placeholder="e.g. Airbnb, Booking.com"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Name of the platform or service providing this calendar
              </p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-ical_url">
                <div className="flex items-center gap-1.5 mb-1">
                  <Link2 className="h-3.5 w-3.5" />
                  iCal URL
                </div>
              </Label>
              <Input
                id="edit-ical_url"
                value={connection.ical_url}
                onChange={(e) => onConnectionChange({ ...connection, ical_url: e.target.value })}
                placeholder="https://example.com/ical/calendar.ics"
                className={errors.ical_url ? "border-red-500" : ""}
              />
              {errors.ical_url && (
                <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3 w-3" /> {errors.ical_url}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Enter the full URL to your external calendar's iCal feed
              </p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-sync_frequency">
                <div className="flex items-center gap-1.5 mb-1">
                  <Clock className="h-3.5 w-3.5" />
                  Sync Frequency
                </div>
              </Label>
              <Select
                value={String(connection.sync_frequency)}
                onValueChange={(value) => onConnectionChange({ ...connection, sync_frequency: parseInt(value) })}
              >
                <SelectTrigger id="edit-sync_frequency">
                  <SelectValue placeholder="Select Frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">Every 15 hours</SelectItem>
                  <SelectItem value="30">Every 30 hours</SelectItem>
                  <SelectItem value="45">Every 45 hours</SelectItem>
                  <SelectItem value="60">Every 60 hours</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                How often should we check for updates from this calendar
              </p>
            </div>
          </div>
          
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
