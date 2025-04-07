
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { syncService } from "@/services/api-service";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SyncStatusBadge } from "@/components/ui/sync-status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Calendar, Check, Clock, Loader2, RefreshCw, Timer, Wifi, WifiOff } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Platform } from "@/types/enums";
import { CircularProgress } from "@/components/ui/circular-progress";
import { PropertySyncStatusResponse } from "@/types/api-responses/sync-types";

interface PropertySyncProps {
  propertyId: string;
}

export function PropertySync({ propertyId }: PropertySyncProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [retryCount, setRetryCount] = useState(0);
  const [syncProgress, setSyncProgress] = useState(0);
  const [timeoutWarning, setTimeoutWarning] = useState(false);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (syncError?.includes("Network") || syncError?.includes("internet")) {
        setSyncError(null);
      }
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncError]);
  
  // Simulate progress when syncing is in progress
  React.useEffect(() => {
    if (!isSyncing) return;
    
    let progressInterval: number;
    let timeoutWarningTimeout: number;
    
    // Start with fast progress that slows down
    progressInterval = window.setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 90) return prev; // Cap at 90% until we get response
        return prev + (90 - prev) * 0.1; // Gradually approach 90%
      });
    }, 1000);
    
    // Show timeout warning after 45 seconds
    timeoutWarningTimeout = window.setTimeout(() => {
      setTimeoutWarning(true);
    }, 45000);
    
    return () => {
      clearInterval(progressInterval);
      clearTimeout(timeoutWarningTimeout);
    };
  }, [isSyncing]);

  const { 
    data: syncData, 
    isLoading: isLoadingSyncStatus, 
    error: syncStatusError,
    refetch: refetchSyncStatus,
    isRefetching
  } = useQuery({
    queryKey: ['property-sync-status', propertyId],
    queryFn: async () => {
      const response = await syncService.getPropertySyncStatus(propertyId);
      console.log('Raw sync status response:', response);
      if (response.data?.success && response.data?.data) {
        return response.data.data; // Return the actual sync status data
      } else if (response.data) {
        return response.data; // Return whatever data structure we have
      }
      throw new Error("Invalid sync status data format");
    },
    refetchInterval: 60000, // Refetch every minute
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
  });

  // Extract the sync status from the API response
  const syncStatus: PropertySyncStatusResponse | null = syncData || null;

  const handleSync = async () => {
    if (isSyncing) return;
    
    if (!isOnline) {
      toast.error("You appear to be offline. Please check your internet connection and try again.");
      setSyncError("Network connection issue. Please check your internet connection and try again.");
      return;
    }

    setIsSyncing(true);
    setSyncError(null);
    setRetryCount(prev => prev + 1);
    setSyncProgress(5);
    setTimeoutWarning(false);
    
    try {
      await syncService.syncProperty(propertyId);
      toast.success("Synchronization initiated");
      // Set progress to 100% on success
      setSyncProgress(100);
      // Refetch data after a small delay to allow sync to process
      setTimeout(() => {
        refetchSyncStatus();
      }, 2000);
    } catch (error) {
      console.error("Sync error:", error);
      
      // Extract meaningful error message
      let errorMessage = "Failed to synchronize property";
      if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      }
      
      setSyncError(errorMessage);
      toast.error(errorMessage);
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
            {syncStatusError instanceof Error && (syncStatusError.message.includes("Network") || 
               syncStatusError.message.includes("internet")) ? (
              <WifiOff className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <p>Failed to load synchronization status</p>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {syncStatusError instanceof Error ? syncStatusError.message : "Unknown error occurred"}
          </p>
          <div className="flex gap-2 mt-4">
            <Button onClick={() => refetchSyncStatus()} variant="outline" className="mt-4">
              {isRefetching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" /> Retry
                </>
              )}
            </Button>
            {!isOnline && (
              <div className="flex items-center text-amber-600 text-sm mt-4">
                <WifiOff className="h-4 w-4 mr-1" /> You appear to be offline
              </div>
            )}
          </div>
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
            <div className="flex items-center gap-2">
              {!isOnline && (
                <div className="flex items-center text-amber-600 text-sm">
                  <WifiOff className="h-4 w-4 mr-1" /> Offline
                </div>
              )}
              <Button onClick={handleSync} disabled={isSyncing || !isOnline}>
                {isSyncing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Sync Now
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {syncError && (
            <div className="mb-4 p-3 border border-red-200 bg-red-50 rounded-md">
              <div className="flex items-center gap-2 text-red-700">
                {syncError.includes("Network") || syncError.includes("internet") ? (
                  <WifiOff className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <p className="font-medium">Sync Error</p>
              </div>
              <p className="text-sm text-red-600 mt-1">{syncError}</p>
              {(syncError.includes("Network") || syncError.includes("internet")) && (
                <div className="mt-2 text-xs text-red-600">
                  <p>Troubleshooting steps:</p>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Check your internet connection</li>
                    <li>Try refreshing the page</li>
                    <li>Check if the API server is reachable</li>
                  </ul>
                </div>
              )}
              {retryCount > 0 && (
                <p className="text-xs text-muted-foreground mt-2">Retry attempt: {retryCount}</p>
              )}
            </div>
          )}
          
          {isSyncing && (
            <div className="mb-4 p-4 border border-blue-100 bg-blue-50 rounded-md">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                  <h3 className="font-medium text-blue-700">Synchronization in progress</h3>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-blue-100 rounded-full h-2.5 mb-1">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
                    style={{ width: `${syncProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-blue-600">
                  Syncing property with connected platforms...
                </p>
                
                {timeoutWarning && (
                  <div className="mt-2 text-sm text-amber-600 text-center max-w-md">
                    <p>Sync is taking longer than expected. Please be patient.</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {isLoadingSyncStatus && !isSyncing ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                <p>Loading synchronization status...</p>
              </div>
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
                          status={syncStatus.summary.overall_status || 'unknown'} 
                          lastSync={syncStatus.summary.last_sync} 
                        />
                      </div>
                    </div>
                    {syncStatus.summary.health_percentage !== undefined && (
                      <div className="flex flex-col items-center">
                        <CircularProgress 
                          value={syncStatus.summary.health_percentage}
                          size={50}
                          showValue={true}
                          progressClassName={
                            syncStatus.summary.health_percentage > 80 
                              ? "stroke-green-500" 
                              : syncStatus.summary.health_percentage > 50 
                                ? "stroke-amber-500" 
                                : "stroke-red-500"
                          }
                          valueClassName={
                            syncStatus.summary.health_percentage > 80 
                              ? "text-green-600" 
                              : syncStatus.summary.health_percentage > 50 
                                ? "text-amber-600" 
                                : "text-red-600"
                          }
                        />
                        <span className="text-xs text-muted-foreground mt-1">Health</span>
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
                    {formatDate(syncStatus.summary.last_sync)}
                  </p>
                </div>
                
                <div className="p-4 border rounded-md">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Next Scheduled Sync</span>
                  </div>
                  <p className="font-medium">
                    {syncStatus.summary.next_sync ? formatDate(syncStatus.summary.next_sync) : "Not scheduled"}
                  </p>
                </div>
              </div>
              
              {syncStatus.connections && syncStatus.connections.length > 0 && (
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">Connected Platforms</h3>
                  <div className="flex flex-wrap gap-2">
                    {syncStatus.connections.map(connection => (
                      <div key={connection.id} className="flex items-center">
                        {renderPlatformIcon(connection.platform)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {syncStatus.event_counts && syncStatus.event_counts.length > 0 && (
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">Event Counts</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {syncStatus.event_counts.map((count, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {renderPlatformIcon(count.platform)}
                        </div>
                        <span className="text-sm font-medium">
                          {count.active_events} active / {count.total_events} total
                        </span>
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
                {isSyncing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" /> Sync Now
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
