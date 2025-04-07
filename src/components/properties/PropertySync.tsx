
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { syncService } from "@/services/sync-service";
import { Loader2, RefreshCw, AlertTriangle } from "lucide-react";
import { PropertySyncStatusResponse, PropertySyncResponse } from "@/types/api-responses/sync-types";
import { format, parseISO } from "date-fns";
import { SyncStatusBadge } from "@/components/ui/sync-status-badge";
import { PlatformsList } from "@/components/sync/PlatformsList";

interface PropertySyncProps {
  propertyId: string;
}

export function PropertySync({ propertyId }: PropertySyncProps) {
  const queryClient = useQueryClient();
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Fetch property sync status
  const { 
    data: syncStatusData, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: [`property-sync-status-${propertyId}`],
    queryFn: async () => {
      try {
        const response = await syncService.getPropertySyncStatus(propertyId);
        if (response.data?.success && response.data?.data) {
          return response.data.data;
        } else {
          throw new Error("Failed to fetch sync status");
        }
      } catch (err) {
        console.error("Error fetching property sync status:", err);
        throw err;
      }
    }
  });

  const syncMutation = useMutation({
    mutationFn: async () => {
      return await syncService.syncProperty(propertyId);
    },
    onSuccess: (response) => {
      if (response.data?.success && response.data?.data) {
        const syncData = response.data.data as PropertySyncResponse;
        
        // Update UI with sync results
        toast.success("Synchronization successful", {
          description: `Synced ${syncData.summary.successful_syncs} of ${syncData.summary.total_connections} connections`
        });
        
        // Update cache
        queryClient.invalidateQueries({ queryKey: [`property-sync-status-${propertyId}`] });
        queryClient.invalidateQueries({ queryKey: [`property-events-${propertyId}`] });
      } else {
        toast.error("Synchronization completed with issues");
      }
      
      setIsSyncing(false);
    },
    onError: (error) => {
      console.error("Sync error:", error);
      toast.error("Synchronization failed", {
        description: (error as Error)?.message || "An unknown error occurred"
      });
      setIsSyncing(false);
    }
  });

  const handleSync = () => {
    setIsSyncing(true);
    syncMutation.mutate();
  };

  // Helper to format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    try {
      return format(parseISO(dateString), "MMM d, yyyy HH:mm");
    } catch (error) {
      return "Invalid date";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Failed to load synchronization status
            </AlertDescription>
          </Alert>
          <Button onClick={() => refetch()} variant="outline" className="w-full">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const syncStatus = syncStatusData as PropertySyncStatusResponse;
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl">Synchronization Status</CardTitle>
          <Button 
            onClick={handleSync} 
            disabled={isSyncing || !syncStatus.connections.length}
            className="gap-2"
          >
            {isSyncing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Sync Now
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent>
          {syncStatus.connections.length === 0 ? (
            <div className="bg-muted p-4 rounded-md text-center">
              <p>No active connections found for this property.</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => {
                  // Navigate to iCal tab or open connection dialog
                  const event = new CustomEvent('openAddConnectionDialog');
                  window.dispatchEvent(event);
                }}
              >
                Add Connection
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted/50 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Overall Status:</span>
                      <SyncStatusBadge status={syncStatus.summary.overall_status} />
                    </div>
                    <div className="flex justify-between">
                      <span>Total Connections:</span>
                      <span>{syncStatus.summary.total_connections}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Connections:</span>
                      <span className="text-green-600">{syncStatus.summary.active_connections}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Error Connections:</span>
                      <span className="text-red-600">{syncStatus.summary.error_connections}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Health:</span>
                      <span>{syncStatus.summary.health_percentage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Sync:</span>
                      <span>{formatDate(syncStatus.summary.last_sync)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Next Sync:</span>
                      <span>{formatDate(syncStatus.summary.next_sync)}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-muted/50 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Event Counts</h3>
                  {syncStatus.event_counts.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No events tracked yet</p>
                  ) : (
                    <div className="space-y-2">
                      {syncStatus.event_counts.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="capitalize">{item.platform}:</span>
                          <span>{item.active_events} active / {item.total_events} total</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 border rounded-md">
                <div className="bg-muted px-4 py-2 border-b">
                  <h3 className="font-medium">Connection Details</h3>
                </div>
                <div className="p-4">
                  <PlatformsList connections={syncStatus.connections} />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
