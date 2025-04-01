
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { SyncStatusBadge } from "@/components/ui/sync-status-badge";
import { syncService } from "@/services/api-service";
import { toast } from "sonner";

interface SyncDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId?: string;
  onSyncComplete?: () => void;
}

export function SyncDialog({ 
  open, 
  onOpenChange, 
  propertyId,
  onSyncComplete 
}: SyncDialogProps) {
  const [syncing, setSyncing] = useState(false);
  const [syncComplete, setSyncComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "syncing" | "success" | "error">("idle");

  const handleSync = async () => {
    setSyncing(true);
    setError(null);
    setStatus("syncing");
    
    try {
      let response;
      if (propertyId) {
        // Sync specific property
        response = await syncService.syncProperty(propertyId);
        toast.success(`Property synced successfully`);
      } else {
        // Sync all properties
        response = await syncService.syncAll();
        toast.success(`All properties synced successfully`);
      }
      
      setSyncComplete(true);
      setStatus("success");
      
      // Notify parent component that sync is complete
      if (onSyncComplete) {
        onSyncComplete();
      }
    } catch (error) {
      console.error("Sync error:", error);
      setError("Failed to sync. Please try again.");
      setStatus("error");
      toast.error("Sync failed. Please try again.");
    } finally {
      setSyncing(false);
    }
  };

  const resetDialog = () => {
    setSyncComplete(false);
    setError(null);
    setStatus("idle");
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetDialog();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {propertyId ? "Sync Property Calendar" : "Sync All Properties"}
          </DialogTitle>
          <DialogDescription>
            {propertyId
              ? "Sync this property's calendar with all connected platforms."
              : "Sync calendars for all properties with their connected platforms."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {status === "idle" && (
            <div className="text-center text-muted-foreground">
              Click the sync button to start synchronization.
            </div>
          )}
          
          {status === "syncing" && (
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              <p className="text-center">
                {propertyId 
                  ? "Syncing property calendar..."
                  : "Syncing all properties..."}
              </p>
            </div>
          )}
          
          {status === "success" && (
            <div className="flex flex-col items-center justify-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="text-center">
                <p className="font-medium text-green-500">Sync completed successfully!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  All calendars have been synchronized.
                </p>
              </div>
            </div>
          )}
          
          {status === "error" && (
            <div className="flex flex-col items-center justify-center gap-3">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <div className="text-center">
                <p className="font-medium text-red-500">Sync failed</p>
                <p className="text-sm text-muted-foreground mt-1">{error}</p>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          {status === "idle" && (
            <Button onClick={handleSync}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Start Sync
            </Button>
          )}
          
          {status === "syncing" && (
            <Button disabled>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Syncing...
            </Button>
          )}
          
          {(status === "success" || status === "error") && (
            <>
              <Button 
                variant="outline" 
                onClick={() => handleOpenChange(false)}
              >
                Close
              </Button>
              <Button 
                onClick={handleSync} 
                disabled={syncing}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Sync Again
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
