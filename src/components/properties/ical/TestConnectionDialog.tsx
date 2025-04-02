
import React from 'react';
import { useMutation } from '@tanstack/react-query';
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

interface TestConnectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId: string;
  connection: ICalConnection | null;
}

export function TestConnectionDialog({ 
  open, 
  onOpenChange, 
  propertyId,
  connection
}: TestConnectionDialogProps) {
  // Test connection mutation
  const testMutation = useMutation({
    mutationFn: (connectionId: string) => {
      return icalConnectionService.testConnection(propertyId, connectionId);
    },
    onSuccess: (data) => {
      // Check data.data (the actual response data) for the connection test result
      if (data.data.success) {
        toast.success("Connection test passed successfully");
      } else {
        toast.error(`Connection test failed: ${data.data.results?.error || 'Unknown error'}`);
      }
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error("Failed to test connection");
      console.error("Error testing connection:", error);
    }
  });

  const handleTestConnection = () => {
    if (!connection) return;
    testMutation.mutate(connection._id);
  };
  
  if (!connection) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Test Connection</DialogTitle>
          <DialogDescription>
            Test the connection to verify it's working properly
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="bg-muted p-3 rounded-md">
            <p><strong>Platform:</strong> {connection.platform}</p>
            <p className="truncate"><strong>URL:</strong> {connection.ical_url}</p>
            <p><strong>Status:</strong> {connection.status}</p>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleTestConnection}
            disabled={testMutation.isPending}
          >
            {testMutation.isPending ? "Testing..." : "Test Connection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
