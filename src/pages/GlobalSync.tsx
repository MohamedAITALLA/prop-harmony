
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { syncService } from '@/services/sync-service';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { 
  Activity,
  AlertTriangle,
  BarChart2,
  CheckCircle,
  Clock,
  Database,
  Fingerprint,
  Info,
  ListFilter,
  Loader2,
  PlayCircle,
  RefreshCw,
  Server,
  Settings,
  Shield,
  Wifi,
  WifiOff,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { SyncStatusBadge } from '@/components/ui/sync-status-badge';
import { PlatformIcon } from '@/components/ui/platform-icon';
import { GlobalSyncStatusResponse } from '@/types/api-responses/sync-types';

export default function GlobalSync() {
  const queryClient = useQueryClient();
  const [syncProgress, setSyncProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Query for global sync status
  const { 
    data: syncStatusData, 
    isLoading, 
    error, 
    refetch: refetchStatus 
  } = useQuery({
    queryKey: ['sync', 'status'],
    queryFn: async () => {
      const response = await syncService.getSyncStatus();
      return response.data?.data as GlobalSyncStatusResponse;
    },
    staleTime: 60 * 1000, // 1 minute
  });

  // Mutation for triggering sync
  const syncMutation = useMutation({
    mutationFn: async () => {
      return await syncService.syncAll();
    },
    onMutate: () => {
      // Reset progress and show toast
      setSyncProgress(5);
      toast.info("Starting global synchronization...");
    },
    onSuccess: (response) => {
      setSyncProgress(100);
      
      // Extract data from the response
      if (response.data?.success && response.data?.data) {
        const result = response.data.data;
        toast.success(
          `Synchronization completed successfully`, 
          { description: `Synced ${result.summary.successful_syncs} of ${result.summary.total_connections} connections` }
        );
      } else {
        toast.success("Synchronization of all properties completed");
      }
      
      // Invalidate queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ["sync", "status"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
    onError: (error) => {
      setSyncProgress(0);
      toast.error("Failed to complete synchronization", {
        description: (error as Error)?.message || "An unknown error occurred"
      });
    }
  });

  // Progress bar animation
  useEffect(() => {
    if (!syncMutation.isPending) {
      if (syncProgress === 100) {
        // Reset progress after completion animation
        const timer = setTimeout(() => setSyncProgress(0), 2000);
        return () => clearTimeout(timer);
      }
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
  }, [syncMutation.isPending, syncProgress]);

  const handleSyncAll = () => {
    syncMutation.mutate();
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return format(parseISO(dateString), "MMM d, yyyy HH:mm");
    } catch (e) {
      return dateString;
    }
  };

  const formatRelativeTime = (dateString?: string) => {
    if (!dateString) return "Never";
    try {
      return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
    } catch (e) {
      return "Unknown";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading synchronization data...</span>
      </div>
    );
  }

  if (error || !syncStatusData) {
    return (
      <Card className="border-red-100">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <AlertTriangle className="h-16 w-16 text-red-500" />
            <h3 className="text-xl font-semibold text-red-700">Unable to load synchronization data</h3>
            <p className="text-muted-foreground text-center max-w-md">
              There was an error loading the synchronization status. Please try again.
            </p>
            <Button onClick={() => refetchStatus()} className="mt-2">Retry</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Synchronization Center</h1>
          <p className="text-muted-foreground">
            Manage and monitor property synchronization across all platforms
          </p>
        </div>
        
        <Button 
          onClick={handleSyncAll} 
          disabled={syncMutation.isPending}
          size="lg"
          className="gap-2"
        >
          {syncMutation.isPending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <RefreshCw className="h-5 w-5" />
              Sync All Properties
            </>
          )}
        </Button>
      </div>

      {/* Sync progress indicator */}
      {syncProgress > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {syncProgress < 100 ? (
                    <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                  <h3 className="font-medium">
                    {syncProgress < 100 ? "Synchronization in progress" : "Synchronization complete"}
                  </h3>
                </div>
                <Badge variant="outline" className={syncProgress < 100 ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}>
                  {syncProgress < 100 ? "In Progress" : "Complete"}
                </Badge>
              </div>
              
              <Progress value={syncProgress} className="h-2" />
              
              <p className="text-sm text-muted-foreground">
                {syncProgress < 100 
                  ? "Syncing all properties with their connected platforms. This may take a few minutes..."
                  : "All properties have been synchronized successfully."
                }
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Properties</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {syncStatusData.summary.total_properties}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {syncStatusData.summary.properties_with_errors > 0 && 
                `${syncStatusData.summary.properties_with_errors} with errors`}
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
              {syncStatusData.summary.active_connections} 
              <span className="text-sm font-normal text-muted-foreground ml-1">
                / {syncStatusData.summary.total_connections}
              </span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {syncStatusData.summary.error_connections > 0 && 
                <span className="text-red-500">{syncStatusData.summary.error_connections} with errors</span>}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Status</CardTitle>
            <div>
              {syncStatusData.summary.health_percentage >= 90 ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : syncStatusData.summary.health_percentage >= 70 ? (
                <Info className="h-4 w-4 text-yellow-500" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {syncStatusData.summary.health_percentage}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {syncStatusData.summary.health_status}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-medium">
              {formatRelativeTime(syncStatusData.summary.last_system_sync)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatDateTime(syncStatusData.summary.last_system_sync)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main content tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 md:w-[500px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {/* Platform Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Distribution</CardTitle>
                <CardDescription>Active connections by platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(syncStatusData.platforms).map(([platform, stats]) => (
                    <div key={platform} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <PlatformIcon platform={platform} className="mr-2" />
                          <span className="font-medium capitalize">{platform}</span>
                        </div>
                        <span className="text-sm">
                          {stats.active}/{stats.total} active
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={(stats.active / stats.total) * 100} 
                          className="h-2" 
                        />
                        <span className="text-sm w-12 text-right">
                          {Math.round((stats.active / stats.total) * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Issues */}
            <Card className={syncStatusData.recent_failures.length > 0 ? "border-red-100" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {syncStatusData.recent_failures.length > 0 ? (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  Recent Issues
                </CardTitle>
                <CardDescription>
                  {syncStatusData.recent_failures.length > 0 
                    ? "Properties experiencing synchronization problems" 
                    : "No synchronization issues detected"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {syncStatusData.recent_failures.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mb-3" />
                    <h3 className="text-lg font-medium text-green-700">All systems operational</h3>
                    <p className="text-muted-foreground max-w-md mt-2">
                      All property connections are working correctly. No errors have been detected.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[260px] overflow-y-auto">
                    {syncStatusData.recent_failures.map((failure, index) => (
                      <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium capitalize">{failure.platform}</p>
                              <SyncStatusBadge status="error" />
                            </div>
                            <p className="text-sm mt-1">Property ID: {failure.property_id}</p>
                            <p className="text-sm text-red-600 mt-1">{failure.error_message}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {formatRelativeTime(failure.last_error_time)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sync History / Upcoming Syncs */}
          <div className="mt-4 grid gap-4 grid-cols-1 md:grid-cols-2">
            {/* Sync History */}
            <Card>
              <CardHeader>
                <CardTitle>Sync Activity</CardTitle>
                <CardDescription>Recent synchronization activity</CardDescription>
              </CardHeader>
              <CardContent>
                {syncStatusData.sync_history.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No sync history available
                  </div>
                ) : (
                  <div className="space-y-4">
                    {syncStatusData.sync_history.map((item, index) => (
                      <div key={index} className="flex justify-between border-b pb-2 last:border-0">
                        <div>
                          <p className="font-medium">{item._id}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">{item.count} syncs</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Upcoming Syncs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  Upcoming Syncs
                </CardTitle>
                <CardDescription>
                  Next scheduled synchronization tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                {syncStatusData.upcoming_syncs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No upcoming scheduled syncs
                  </div>
                ) : (
                  <div className="space-y-4">
                    {syncStatusData.upcoming_syncs.slice(0, 5).map((sync, index) => (
                      <div key={index} className="flex justify-between border-b pb-3 last:border-0">
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
          </div>
        </TabsContent>
        
        {/* Platforms Tab */}
        <TabsContent value="platforms">
          <Card>
            <CardHeader>
              <CardTitle>Platform Status</CardTitle>
              <CardDescription>Connection status across different calendar platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(syncStatusData.platforms).map(([platform, stats]) => (
                  <div key={platform} className="bg-muted/30 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <PlatformIcon platform={platform} className="mr-2" />
                      <h3 className="font-medium capitalize">{platform}</h3>
                    </div>
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
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
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
        </TabsContent>
        
        {/* Issues Tab */}
        <TabsContent value="issues">
          <Card>
            <CardHeader>
              <CardTitle>Synchronization Issues</CardTitle>
              <CardDescription>Properties and platforms experiencing synchronization problems</CardDescription>
            </CardHeader>
            <CardContent>
              {syncStatusData.recent_failures.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                  <h3 className="text-xl font-medium text-green-700">No synchronization issues!</h3>
                  <p className="text-muted-foreground max-w-md mt-2">
                    All property connections are working correctly. No errors have been detected.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {syncStatusData.recent_failures.map((failure, index) => (
                    <div key={index} className="border border-red-100 bg-red-50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium capitalize">{failure.platform}</p>
                            <SyncStatusBadge status="error" />
                          </div>
                          <p className="text-sm mt-1">Property ID: {failure.property_id}</p>
                          <p className="text-sm text-red-600 mt-1">{failure.error_message}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Last error: {formatRelativeTime(failure.last_error_time)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" onClick={() => refetchStatus()} className="gap-1">
                <RefreshCw className="h-4 w-4" />
                Refresh Status
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Schedule Tab */}
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Synchronizations</CardTitle>
              <CardDescription>Next scheduled synchronization tasks</CardDescription>
            </CardHeader>
            <CardContent>
              {syncStatusData.upcoming_syncs.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                  No upcoming scheduled syncs
                </div>
              ) : (
                <div className="space-y-4">
                  {syncStatusData.upcoming_syncs.map((sync, index) => (
                    <div key={index} className="flex justify-between items-start pb-3 border-b last:border-0">
                      <div>
                        <div className="flex items-center">
                          <PlatformIcon platform={sync.platform} className="mr-2" />
                          <p className="font-medium capitalize">{sync.platform}</p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Property: {sync.property_id}</p>
                        <p className="text-xs text-muted-foreground">
                          Last synced: {formatRelativeTime(sync.last_synced)}
                        </p>
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
            <CardFooter className="flex justify-between">
              <p className="text-sm text-muted-foreground">
                Synchronizations are automatically scheduled
              </p>
              <Button size="sm" onClick={() => refetchStatus()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
