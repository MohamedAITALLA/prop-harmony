
import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { icalConnectionService } from '@/services/api-service';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ICalConnection } from "@/types/api-responses";
import { AlertCircle, CheckCircle2, Globe, RefreshCw } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';

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

  const isLoading = testMutation.isPending;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Globe className="h-5 w-5 text-primary" />
            Test iCal Connection
          </DialogTitle>
          <DialogDescription>
            Verify that your iCal connection is working properly and accessible
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="bg-muted/30 p-4 rounded-lg border border-border/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Platform</span>
              <Badge variant="outline" className="capitalize">
                {connection.platform}
              </Badge>
            </div>
            
            <div className="space-y-1">
              <span className="text-sm font-medium">URL</span>
              <div className="p-2 bg-muted/50 rounded border border-border/50 break-all text-sm">
                {connection.ical_url}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status</span>
              <div className="flex items-center gap-1.5">
                {connection.status === "active" ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                )}
                <span className="capitalize">{connection.status}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-primary/5 p-3 rounded-md text-sm">
            <p>Testing will verify that the iCal feed URL is accessible and contains valid calendar data.</p>
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            type="button"
            className="gap-2"
            onClick={handleTestConnection}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Testing Connection...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Test Connection
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
