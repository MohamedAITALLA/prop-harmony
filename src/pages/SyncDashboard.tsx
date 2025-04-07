
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { 
  Activity, AlertTriangle, BarChart2, Calendar, Check, Clock, 
  Info, Loader2, PieChart, RefreshCw, Server
} from "lucide-react";
import { toast } from "sonner";
import { format, parseISO, formatDistanceToNow } from "date-fns";
import { syncService } from "@/services/sync-service";
import { SyncStatusTable } from "@/components/dashboard/SyncStatusTable";
import { SyncStatusBadge } from "@/components/ui/sync-status-badge";
import { SyncScheduleChart } from "@/components/sync/SyncScheduleChart";
import { GlobalSyncStatusResponse } from "@/types/api-responses/sync-types";

export default function SyncDashboard() {
  const queryClient = useQueryClient();
  const [syncProgress, setSyncProgress] = useState(0);
  
  // First, define the mutation
  const syncAllMutation = useMutation({
    mutationFn: async () => {
      return await syncService.syncAll();
    },
    onSuccess: (response) => {
      setSyncProgress(100);
      
      if (response.data?.success && response.data?.data) {
        const result = response.data.data;
        toast.success(
          `Synchronization completed successfully`, 
          { description: `Synced ${result.summary.successful_syncs} of ${result.summary.total_connections} connections` }
        );
      } else {
        toast.success("Synchronization of all properties completed");
      }
      
      queryClient.invalidateQueries({ queryKey: ["sync", "status"] });
    },
    onError: (error) => {
      toast.error("Failed to complete synchronization", {
        description: (error as Error)?.message || "An unknown error occurred"
      });
    }
  });

  // Now use it in useEffect after it's been defined
  React.useEffect(() => {
    if (!syncAllMutation.isPending) {
      setSyncProgress(0);
      return;
    }
    
    let progressInterval: number;
    
    // Start with fast progress that slows down
    progressInterval = window.setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 90) return prev; // Cap at 90% until we get response
        return prev + (90 - prev) * 0.1; // Gradually approach 90%
      });
    }, 1000);
    
    return () => {
      clearInterval(progressInterval);
    };
  }, [syncAllMutation.isPending]);

  // Fetch sync status data
  const { data: syncStatusResponse, isLoading: isStatusLoading, refetch: refetchStatus } = useQuery({
    queryKey: ["sync", "status"],
    queryFn: async () => {
      try {
        const response = await syncService.getSyncStatus();
        if (response.data?.success && response.data?.data) {
          return response.data.data as GlobalSyncStatusResponse;
        }
        throw new Error("Invalid response format");
      } catch (error) {
        console.error("Error fetching sync status:", error);
        throw error;
      }
    }
  });

  const handleSyncAll = () => {
    syncAllMutation.mutate();
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return format(parseISO(dateString), "MMM d, yyyy HH:mm");
    } catch (e) {
      return dateString;
    }
  };

  const formatRelativeFromNow = (dateString?: string) => {
    if (!dateString) return "Never";
    try {
      const date = parseISO(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return "Unknown";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Synchronization Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and manage property synchronization status across all platforms
          </p>
        </div>
        
        <Button 
          onClick={handleSyncAll} 
          disabled={syncAllMutation.isPending}
          className="gap-2"
        >
          {syncAllMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Sync All Properties
            </>
          )}
        </Button>
      </div>

      {/* Sync progress indicator */}
      {syncAllMutation.isPending && (
        <Card className="mb-4">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                <h3 className="font-medium text-blue-700">Global synchronization in progress</h3>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-blue-100 rounded-full h-2.5 mb-1">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
                  style={{ width: `${syncProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-blue-600">
                Syncing all properties with their connected platforms...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {isStatusLoading ? (
        // Loading state
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !syncStatusResponse ? (
        // Error state
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 justify-center">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <h3 className="text-red-600">Unable to load synchronization status</h3>
            </div>
            <Button onClick={() => refetchStatus()} className="mt-4 mx-auto block">
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Overall Status Section */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Properties</CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {syncStatusResponse.summary.total_properties}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {syncStatusResponse.summary.properties_with_errors > 0 && 
                    `${syncStatusResponse.summary.properties_with_errors} with errors`}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Connections</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {syncStatusResponse.summary.active_connections} 
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    / {syncStatusResponse.summary.total_connections}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {syncStatusResponse.summary.error_connections > 0 && 
                    <span className="text-red-500">{syncStatusResponse.summary.error_connections} with errors</span>}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Health Status</CardTitle>
                <div>
                  {syncStatusResponse.summary.health_percentage >= 90 ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : syncStatusResponse.summary.health_percentage >= 70 ? (
                    <Info className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {syncStatusResponse.summary.health_percentage}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {syncStatusResponse.summary.health_status}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Last Global Sync</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-medium">
                  {formatRelativeFromNow(syncStatusResponse.summary.last_system_sync)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDateTime(syncStatusResponse.summary.last_system_sync)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Failures Section */}
          {syncStatusResponse.recent_failures.length > 0 && (
            <Card className="border-red-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Recent Sync Failures
                </CardTitle>
                <CardDescription>
                  Connections that failed during recent synchronization attempts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {syncStatusResponse.recent_failures.slice(0, 3).map((failure, index) => (
                    <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                      <div>
                        <p className="font-medium">{failure.platform} connection failed for property {failure.property_id}</p>
                        <p className="text-sm text-muted-foreground">{failure.error_message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatRelativeFromNow(failure.last_error_time)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              {syncStatusResponse.recent_failures.length > 3 && (
                <CardFooter className="pt-0">
                  <Button variant="link" className="ml-auto" onClick={() => window.location.href = '/sync/logs'}>
                    View all {syncStatusResponse.recent_failures.length} failures
                  </Button>
                </CardFooter>
              )}
            </Card>
          )}

          {/* Platforms Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-muted-foreground" />
                Platforms Overview
              </CardTitle>
              <CardDescription>
                Connection status across different calendar platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(syncStatusResponse.platforms).map(([platform, stats]) => (
                  <div key={platform} className="bg-muted/30 p-4 rounded-lg">
                    <h3 className="font-medium capitalize mb-2">{platform}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total Connections:</span>
                        <span>{stats.total}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Active:</span>
                        <span className="text-green-600">{stats.active}</span>
                      </div>
                      {stats.error > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Errors:</span>
                          <span className="text-red-600">{stats.error}</span>
                        </div>
                      )}
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-green-500 h-1.5 rounded-full" 
                          style={{ width: `${(stats.active / stats.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Syncs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                Upcoming Syncs
              </CardTitle>
              <CardDescription>
                The next scheduled synchronization tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              {syncStatusResponse.upcoming_syncs.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No upcoming scheduled syncs</p>
              ) : (
                <div className="space-y-4">
                  {syncStatusResponse.upcoming_syncs.slice(0, 5).map((sync, index) => (
                    <div key={index} className="flex justify-between items-center pb-3 border-b last:border-0">
                      <div>
                        <p className="font-medium capitalize">{sync.platform}</p>
                        <p className="text-sm text-muted-foreground">Property: {sync.property_id}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${sync.minutes_until_next_sync < 30 ? 'text-blue-600' : ''}`}>
                          In {sync.minutes_until_next_sync} minutes
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(sync.next_sync)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sync History Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <PieChart className="h-5 w-5 text-muted-foreground" />
                Sync Activity
              </CardTitle>
              <CardDescription>
                Historical synchronization activity over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <SyncScheduleChart 
                  data={syncStatusResponse.sync_history.map(item => ({
                    date: item._id,
                    count: item.count
                  }))}
                />
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
