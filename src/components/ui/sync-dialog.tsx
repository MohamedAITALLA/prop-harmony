
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
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { PlatformIcon } from "@/components/ui/platform-icon";
import { format } from "date-fns";

interface SyncDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId?: string;
  onSyncComplete?: () => void;
}

interface SyncPlatformResult {
  platform: string;
  success: boolean;
  events_synced: number;
  events_created: number;
  events_updated: number;
  events_cancelled: number;
  sync_duration_ms: number;
  conflicts: any[];
  last_synced: string;
  error?: string;
}

interface SyncResult {
  property_id: string;
  sync_results: SyncPlatformResult[];
  summary: {
    total_connections: number;
    successful_syncs: number;
    failed_syncs: number;
    total_events_synced: number;
    events_created: number;
    events_updated: number;
    events_cancelled: number;
    conflicts_detected: number;
    sync_completion_time: string;
  };
  next_sync: string;
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
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  
  const queryClient = useQueryClient();

  const handleSync = async () => {
    setSyncing(true);
    setError(null);
    setStatus("syncing");
    setSyncResult(null);
    
    try {
      let response;
      if (propertyId) {
        response = await syncService.syncProperty(propertyId);
        toast.success(`Property synced successfully`);
      } else {
        response = await syncService.syncAll();
        toast.success(`All properties synced successfully`);
      }
      
      setSyncComplete(true);
      setStatus("success");
      
      if (response.data && response.data.sync_results) {
        setSyncResult(response.data);
      }
      
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
      
      if (propertyId) {
        queryClient.invalidateQueries({
          queryKey: ["property-sync-status", propertyId],
        });
      }
      
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
    setSyncResult(null);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetDialog();
    }
    onOpenChange(open);
  };

  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPp");
    } catch (error) {
      return dateString;
    }
  };

  const renderSyncResults = () => {
    if (!syncResult) return null;
    
    return (
      <div className="mt-2 space-y-4">
        <div className="bg-muted/30 p-3 rounded-md">
          <h4 className="font-medium text-sm mb-1">Summary</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Total connections:</span>{" "}
              <span className="font-medium">{syncResult.summary.total_connections}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Successful syncs:</span>{" "}
              <span className="font-medium">{syncResult.summary.successful_syncs}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Failed syncs:</span>{" "}
              <span className="font-medium">{syncResult.summary.failed_syncs}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Total events synced:</span>{" "}
              <span className="font-medium">{syncResult.summary.total_events_synced}</span>
            </div>
            {syncResult.summary.conflicts_detected > 0 && (
              <div className="col-span-2">
                <span className="text-muted-foreground">Conflicts detected:</span>{" "}
                <Badge variant="destructive" className="ml-1">
                  {syncResult.summary.conflicts_detected}
                </Badge>
              </div>
            )}
            {syncResult.next_sync && (
              <div className="col-span-2 mt-1 text-xs text-muted-foreground">
                Next sync scheduled: {formatTime(syncResult.next_sync)}
              </div>
            )}
          </div>
        </div>
        
        {syncResult.sync_results.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Platform Results</h4>
            {syncResult.sync_results.map((result, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-md border ${
                  result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                }`}
              >
                <div className="flex justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <PlatformIcon platform={result.platform} size={16} />
                    <span className="font-medium">{result.platform}</span>
                  </div>
                  <Badge variant={result.success ? "outline" : "destructive"}>
                    {result.success ? "Success" : "Failed"}
                  </Badge>
                </div>
                
                {result.success ? (
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div>Events synced: {result.events_synced}</div>
                    <div>Created: {result.events_created}</div>
                    <div>Updated: {result.events_updated}</div>
                    <div>Cancelled: {result.events_cancelled}</div>
                    {result.conflicts.length > 0 && (
                      <div className="col-span-2 text-amber-700">
                        {result.conflicts.length} conflicts detected
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-red-600">{result.error}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
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
            <div className="space-y-3">
              <div className="flex flex-col items-center justify-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div className="text-center">
                  <p className="font-medium text-green-500">Sync completed successfully!</p>
                  {!syncResult && (
                    <p className="text-sm text-muted-foreground mt-1">
                      All calendars have been synchronized.
                    </p>
                  )}
                </div>
              </div>
              {renderSyncResults()}
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
