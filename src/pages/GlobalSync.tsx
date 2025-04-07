
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GlobalSyncButton } from '@/components/sync/GlobalSyncButton';
import { syncService } from '@/services/sync-service';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { 
  Activity, AlertTriangle, BarChart2, Calendar, Check, 
  Clock, Info, Server, RefreshCw, Loader2
} from 'lucide-react';
import { SyncStatusBadge } from '@/components/ui/sync-status-badge';
import { SyncScheduleChart } from '@/components/sync/SyncScheduleChart';
import { PlatformsList } from '@/components/sync/PlatformsList';
import { GlobalSyncStatusResponse } from '@/types/api-responses/sync-types';
import { toast } from 'sonner';

export default function GlobalSync() {
  const [syncInProgress, setSyncInProgress] = useState(false);
  
  // Fetch global sync status
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

  const handleSyncStart = () => {
    setSyncInProgress(true);
  };

  const handleSyncComplete = () => {
    setSyncInProgress(false);
    refetchStatus();
    toast.success("Synchronization completed");
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "Never";
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
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Synchronization Dashboard</h1>
          <p className="text-muted-foreground">
            Manage and monitor property synchronization across all platforms
          </p>
        </div>
        
        <GlobalSyncButton 
          onSyncStart={handleSyncStart}
          onSyncComplete={handleSyncComplete}
        />
      </div>
      
      {syncInProgress && (
        <Card className="border-blue-100 bg-blue-50/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-4 py-4">
              <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
              <p className="text-blue-700 font-medium">
                Synchronizing all properties... This may take a few minutes.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      
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
                <Check className="h-4 w-4 text-green-500" />
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
            <CardTitle className="text-sm font-medium">Last Global Sync</CardTitle>
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
      
      <Tabs defaultValue="overview">
        <TabsList className="grid grid-cols-4 md:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="failures">Issues</TabsTrigger>
          <TabsTrigger value="upcoming">Schedule</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sync Activity</CardTitle>
                <CardDescription>Historical synchronization activity</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <SyncScheduleChart 
                  data={syncStatusData.sync_history.map(item => ({
                    date: item._id,
                    count: item.count
                  }))}
                />
              </CardContent>
            </Card>
            
            {syncStatusData.recent_failures.length > 0 && (
              <Card className="border-red-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Recent Failures
                  </CardTitle>
                  <CardDescription>
                    Connections that failed during recent synchronization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-[220px] overflow-y-auto">
                    {syncStatusData.recent_failures.map((failure, index) => (
                      <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
                        <p className="font-medium">{failure.platform} - Property {failure.property_id}</p>
                        <p className="text-sm text-red-600">{failure.error_message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatRelativeTime(failure.last_error_time)}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <a href="/sync/logs">View All Logs</a>
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="platforms" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Status</CardTitle>
              <CardDescription>Connection status across different calendar platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(syncStatusData.platforms).map(([platform, stats]) => (
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
        </TabsContent>
        
        <TabsContent value="failures" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Synchronization Issues</CardTitle>
              <CardDescription>Properties and platforms experiencing synchronization problems</CardDescription>
            </CardHeader>
            <CardContent>
              {syncStatusData.recent_failures.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Check className="h-16 w-16 text-green-500 mb-4" />
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
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{failure.platform}</p>
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
        
        <TabsContent value="upcoming" className="mt-4">
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
                    <div key={index} className="flex justify-between items-center pb-3 border-b last:border-0">
                      <div>
                        <p className="font-medium capitalize">{sync.platform}</p>
                        <p className="text-sm text-muted-foreground">Property: {sync.property_id}</p>
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
      
      <div className="flex justify-end">
        <Button variant="outline" className="mr-2" asChild>
          <a href="/sync/logs">View Sync Logs</a>
        </Button>
        <GlobalSyncButton 
          onSyncStart={handleSyncStart} 
          onSyncComplete={handleSyncComplete} 
        />
      </div>
    </div>
  );
}
