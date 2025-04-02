
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { syncService } from "@/services/api-service";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SyncStatusBadge } from "@/components/ui/sync-status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Calendar, Check, Clock, RefreshCw, Timer } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Platform } from "@/types/enums";

interface PropertySyncProps {
  propertyId: string;
}

export function PropertySync({ propertyId }: PropertySyncProps) {
  const [isSyncing, setIsSyncing] = useState(false);

  const { 
    data: syncStatus, 
    isLoading: isLoadingSyncStatus, 
    error: syncStatusError,
    refetch: refetchSyncStatus 
  } = useQuery({
    queryKey: ['property-sync-status', propertyId],
    queryFn: async () => {
      const response = await syncService.getPropertySyncStatus(propertyId);
      return response.data.syncStatus;
    },
    refetchInterval: 60000, // Refetch every minute
  });

  const { 
    data: syncLogsResponse, 
    isLoading: isLoadingSyncLogs,
    refetch: refetchSyncLogs
  } = useQuery({
    queryKey: ['property-sync-logs', propertyId],
    queryFn: async () => {
      const response = await syncService.getPropertySyncLogs(propertyId, {
        limit: 5
      });
      return response.data;
    },
  });

  // Access the logs array from the response
  const syncLogs = syncLogsResponse?.logs || [];

  const handleSync = async () => {
    if (isSyncing) return;

    setIsSyncing(true);
    try {
      await syncService.syncProperty(propertyId);
      toast.success("Synchronization initiated");
      // Refetch data after a small delay to allow sync to process
      setTimeout(() => {
        refetchSyncStatus();
        refetchSyncLogs();
      }, 2000);
    } catch (error) {
      console.error("Sync error:", error);
      toast.error("Failed to synchronize property");
    } finally {
      setIsSyncing(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Never";
    try {
      return format(parseISO(dateString), "MMM d, yyyy 'at' h:mm a");
    } catch (error) {
      return dateString;
    }
  };

  const renderPlatformIcon = (platform: string) => {
    const platformLower = platform.toLowerCase();
    
    if (platformLower === "airbnb") {
      return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Airbnb</Badge>;
    }
    
    if (platformLower === "vrbo" || platformLower === "homeaway") {
      return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">VRBO</Badge>;
    }
    
    if (platformLower === "booking.com" || platformLower === "booking") {
      return <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-200">Booking.com</Badge>;
    }
    
    return <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">{platform}</Badge>;
  };
  
  if (syncStatusError) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-red-500">
            <AlertCircle className="h-5 w-5" />
            <p>Failed to load synchronization status</p>
          </div>
          <Button onClick={() => refetchSyncStatus()} variant="outline" className="mt-4">
            <RefreshCw className="mr-2 h-4 w-4" /> Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sync Status Overview */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Synchronization Status</CardTitle>
            <Button onClick={handleSync} disabled={isSyncing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? "Syncing..." : "Sync Now"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingSyncStatus ? (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full rounded-md" />
              <Skeleton className="h-16 w-full rounded-md" />
            </div>
          ) : syncStatus ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <div className="mt-1">
                        <SyncStatusBadge 
                          status={syncStatus.health_status || 'unknown'} 
                          lastSync={syncStatus.last_synced} 
                        />
                      </div>
                    </div>
                    {syncStatus.health_percentage !== undefined && (
                      <div className="text-2xl font-bold">
                        {syncStatus.health_percentage}%
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-4 border rounded-md">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Last Synced</span>
                  </div>
                  <p className="font-medium">
                    {formatDate(syncStatus.last_synced)}
                  </p>
                </div>
                
                <div className="p-4 border rounded-md">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Next Scheduled Sync</span>
                  </div>
                  <p className="font-medium">
                    {syncStatus.next_sync ? formatDate(syncStatus.next_sync) : "Not scheduled"}
                  </p>
                </div>
              </div>
              
              {syncStatus.active_connections > 0 && (
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">Connected Platforms</h3>
                  <div className="flex flex-wrap gap-2">
                    {syncStatus.platforms && Object.keys(syncStatus.platforms).map(platform => (
                      <div key={platform} className="flex items-center">
                        {renderPlatformIcon(platform)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No synchronization data available</p>
              <Button onClick={handleSync} variant="outline" className="mt-4">
                <RefreshCw className="mr-2 h-4 w-4" /> Sync Now
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Recent Sync Activity */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Recent Sync Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingSyncLogs ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-16 w-full rounded-md" />
              ))}
            </div>
          ) : syncLogs.length > 0 ? (
            <div className="space-y-2">
              {syncLogs.map((log, index) => (
                <div 
                  key={log._id || index} 
                  className="p-3 border rounded-md flex justify-between items-center"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      {renderPlatformIcon(log.platform)}
                      <span className="font-medium">{log.action || "Sync"}</span>
                    </div>
                    {log.results && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {log.results.events_processed !== undefined 
                          ? `Processed ${log.results.events_processed} events` 
                          : "Sync completed"}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="mb-1">
                      <SyncStatusBadge status={log.status} />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(log.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No recent sync activities found</p>
            </div>
          )}
          
          <div className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => refetchSyncLogs()} 
              className="w-full"
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh Log
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
