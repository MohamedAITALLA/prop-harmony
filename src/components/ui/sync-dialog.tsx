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
import { RefreshCw, CheckCircle, AlertCircle, Wifi, WifiOff, Loader2 } from "lucide-react";
import { SyncStatusBadge } from "@/components/ui/sync-status-badge";
import { syncService } from "@/services/api-service";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { PlatformIcon } from "@/components/ui/platform-icon";
import { format } from "date-fns";
import { PropertySyncResponse, PropertySyncResult } from "@/types/api-responses/sync-types";

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
  const [syncResult, setSyncResult] = useState<PropertySyncResponse | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncMessage, setSyncMessage] = useState<string>("Initializing sync...");
  const [timeoutWarning, setTimeoutWarning] = useState(false);
  
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (!syncing) return;
    
    let progressInterval: number;
    let timeoutWarningTimeout: number;
    
    progressInterval = window.setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 90) return prev;
        return prev + (90 - prev) * 0.1;
      });
      
      if (syncProgress < 30) {
        setSyncMessage("Connecting to platforms...");
      } else if (syncProgress < 60) {
        setSyncMessage("Fetching calendar data...");
      } else if (syncProgress < 80) {
        setSyncMessage("Processing events...");
      } else {
        setSyncMessage("Almost there...");
      }
    }, 1000);
    
    timeoutWarningTimeout = window.setTimeout(() => {
      setTimeoutWarning(true);
    }, 45000);
    
    return () => {
      clearInterval(progressInterval);
      clearTimeout(timeoutWarningTimeout);
    };
  }, [syncing, syncProgress]);

  const handleSync = async () => {
    setSyncing(true);
    setError(null);
    setStatus("syncing");
    setSyncResult(null);
    setSyncProgress(5);
    setSyncMessage("Initializing sync...");
    setTimeoutWarning(false);
    
    try {
      let response;
      if (propertyId) {
        console.log("Starting property sync for:", propertyId);
        response = await syncService.syncProperty(propertyId);
        console.log("Sync response received:", response);
        
        setSyncProgress(100);
        setSyncMessage("Sync completed!");
        
        if (response?.data?.success && response?.data?.data) {
          console.log("Sync completed successfully with data:", response.data.data);
          setSyncResult(response.data.data);
          toast.success(`Property synced successfully`);
        } else if (response?.data) {
          console.log("Sync completed with response:", response.data);
          setSyncResult(response.data);
          toast.success(`Property synced successfully`);
        } else {
          console.error("Unexpected sync response format:", response);
          throw new Error("Invalid sync response format");
        }
      } else {
        response = await syncService.syncAll();
        
        setSyncProgress(100);
        setSyncMessage("Sync completed!");
        
        if (response?.data?.success && response?.data?.data) {
          setSyncResult(response.data.data);
          toast.success(`All properties synced successfully`);
        } else if (response?.data) {
          setSyncResult(response.data);
          toast.success(`All properties synced successfully`);
        } else {
          console.error("Unexpected sync all response format:", response);
          throw new Error("Invalid sync response format");
        }
      }
      
      setSyncComplete(true);
      setStatus("success");
      
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
      
      if (propertyId) {
        queryClient.invalidateQueries({
          queryKey: ["property-sync-status", propertyId],
        });
        queryClient.invalidateQueries({
          queryKey: ["property", propertyId],
        });
        queryClient.invalidateQueries({
          queryKey: ["property-events", propertyId],
        });
        queryClient.invalidateQueries({
          queryKey: ["property-conflicts", propertyId],
        });
      }
      
      if (onSyncComplete) {
        onSyncComplete();
      }
    } catch (error) {
      console.error("Sync error:", error);
      let errorMessage = "Failed to sync. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes("Network Error") || 
            error.message.includes("ERR_CONNECTION") || 
            error.message.includes("timeout")) {
          errorMessage = "Network connection issue. Please check your internet connection and try again.";
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      setStatus("error");
      toast.error(errorMessage);
    } finally {
      setSyncing(false);
    }
  };

  const resetDialog = () => {
    setSyncComplete(false);
    setError(null);
    setStatus("idle");
    setSyncResult(null);
    setRetryCount(0);
    setSyncProgress(0);
    setSyncMessage("");
    setTimeoutWarning(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetDialog();
    }
    onOpenChange(open);
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    handleSync();
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
              <span className="font-medium">{syncResult.summary?.total_connections || 0}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Successful syncs:</span>{" "}
              <span className="font-medium">{syncResult.summary?.successful_syncs || 0}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Failed syncs:</span>{" "}
              <span className="font-medium">{syncResult.summary?.failed_syncs || 0}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Total events synced:</span>{" "}
              <span className="font-medium">{syncResult.summary?.total_events_synced || 0}</span>
            </div>
            {syncResult.summary?.conflicts_detected > 0 && (
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
        
        {syncResult.sync_results && syncResult.sync_results.length > 0 && (
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
                    {result.conflicts && result.conflicts.length > 0 && (
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
            <div className="flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <p className="text-center font-medium">
                {syncMessage}
              </p>
              
              <div className="w-full bg-muted rounded-full h-2.5 mb-1">
                <div 
                  className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-out" 
                  style={{ width: `${syncProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground">
                {propertyId ? "Syncing property with connected platforms..." : "Syncing all properties..."}
              </p>
              
              {timeoutWarning && (
                <div className="mt-2 text-sm text-amber-600 text-center max-w-md">
                  <p>Sync is taking longer than expected. Please be patient, this may take several minutes in some cases.</p>
                </div>
              )}
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
              {error?.includes("Network") || error?.includes("internet") ? (
                <WifiOff className="h-8 w-8 text-red-500" />
              ) : (
                <AlertCircle className="h-8 w-8 text-red-500" />
              )}
              <div className="text-center">
                <p className="font-medium text-red-500">Sync failed</p>
                <p className="text-sm text-muted-foreground mt-1">{error}</p>
                {retryCount > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">Retry attempt: {retryCount}</p>
                )}
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
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
                onClick={status === "error" ? handleRetry : handleSync} 
                disabled={syncing}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                {status === "error" ? "Retry" : "Sync Again"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
