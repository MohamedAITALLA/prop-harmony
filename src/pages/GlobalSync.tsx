
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { syncService } from "@/services/sync-service";
import { Progress } from "@/components/ui/progress";
import { formatRelativeTime, formatDateTime, getHealthColor, getHealthBgColor } from "@/utils/sync-helpers";
import { PlatformIcon } from "@/components/ui/platform-icon";
import { Badge } from "@/components/ui/badge";
import { SyncStatusBadge } from "@/components/ui/sync-status-badge";
import { GlobalSyncButton } from "@/components/sync/GlobalSyncButton";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, AlertTriangle, CheckCircle2, Calendar, RefreshCw } from "lucide-react";
import { SyncDialog } from "@/components/ui/sync-dialog";
import { SyncScheduleChart } from "@/components/sync/SyncScheduleChart";
import { Button } from "@/components/ui/button";

export default function GlobalSync() {
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  
  const { data: syncStatus, isLoading, error, refetch } = useQuery({
    queryKey: ["sync", "status"],
    queryFn: async () => {
      const response = await syncService.getSyncStatus();
      return response.data?.data;
    }
  });
  
  const healthPercentage = syncStatus?.summary?.health_percentage || 0;
  const healthColor = getHealthColor(healthPercentage);
  const healthBgColor = getHealthBgColor(healthPercentage);
  
  const handleSyncComplete = () => {
    refetch();
  };
  
  // Extract sync history for the chart
  const syncHistory = syncStatus?.sync_history?.map(item => ({
    date: item._id,
    count: item.count
  })) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar Synchronization</h1>
          <p className="text-muted-foreground">
            Manage and monitor your calendar connections and synchronization status
          </p>
        </div>
        <GlobalSyncButton 
          variant="default" 
          onSyncComplete={handleSyncComplete}
          onSyncStart={() => setSyncDialogOpen(true)}
        />
      </div>
      
      {isLoading ? (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="h-64" />
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      ) : error ? (
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle size={18} />
              Error Loading Sync Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Failed to load synchronization status. Please try refreshing the page.</p>
            <Button variant="outline" className="mt-4" onClick={() => refetch()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Stats overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Health Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <div className="flex items-baseline justify-between">
                    <span className={`text-3xl font-bold ${healthColor}`}>
                      {healthPercentage}%
                    </span>
                    <Badge variant="outline" className={healthBgColor}>
                      {syncStatus?.summary?.health_status || "Unknown"}
                    </Badge>
                  </div>
                  <Progress 
                    value={healthPercentage} 
                    className="mt-2 h-2" 
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    {syncStatus?.summary?.active_connections || 0} of {syncStatus?.summary?.total_connections || 0} connections healthy
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Properties</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-bold">
                      {syncStatus?.summary?.total_properties || 0}
                    </span>
                    {syncStatus?.summary?.properties_with_errors > 0 && (
                      <Badge variant="destructive">
                        {syncStatus.summary.properties_with_errors} with errors
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {syncStatus?.summary?.total_connections || 0} total connections
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Last Sync</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-muted-foreground" />
                    <span className="text-lg font-bold">
                      {formatRelativeTime(syncStatus?.summary?.last_system_sync)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {syncStatus?.summary?.last_system_sync ? 
                      formatDateTime(syncStatus.summary.last_system_sync) : 
                      "No recent sync"}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Platforms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <div className="flex flex-wrap gap-1">
                    {syncStatus?.platforms && Object.keys(syncStatus.platforms).length > 0 ? (
                      Object.keys(syncStatus.platforms).map(platform => (
                        <Badge key={platform} variant="outline" className="flex items-center gap-1">
                          <PlatformIcon platform={platform} size={12} />
                          <span className="capitalize">{platform}</span>
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground">No platforms connected</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sync history chart */}
          <Card>
            <CardHeader>
              <CardTitle>Sync Activity</CardTitle>
              <CardDescription>Number of synchronizations per day</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <SyncScheduleChart data={syncHistory} />
            </CardContent>
          </Card>
          
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {/* Recent failures */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle size={18} className="text-red-500" />
                  Recent Sync Issues
                </CardTitle>
                <CardDescription>
                  {syncStatus?.recent_failures?.length > 0 
                    ? `${syncStatus.recent_failures.length} properties with recent sync failures` 
                    : "No recent sync issues detected"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {syncStatus?.recent_failures && syncStatus.recent_failures.length > 0 ? (
                  <div className="space-y-3">
                    {syncStatus.recent_failures.map((failure, index) => (
                      <div key={index} className="p-3 rounded-md bg-red-50 border border-red-100">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-2">
                            <PlatformIcon platform={failure.platform} />
                            <span className="font-medium capitalize">{failure.platform}</span>
                          </div>
                          <SyncStatusBadge status="error" lastSync={failure.last_error_time} />
                        </div>
                        <p className="text-sm text-red-600 mt-1">
                          {failure.error_message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatRelativeTime(failure.last_error_time)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                    <CheckCircle2 size={36} className="text-green-500 mb-2" />
                    <p>All synchronizations are working properly</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Upcoming syncs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar size={18} className="text-blue-500" />
                  Upcoming Syncs
                </CardTitle>
                <CardDescription>
                  Next scheduled synchronizations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {syncStatus?.upcoming_syncs && syncStatus.upcoming_syncs.length > 0 ? (
                  <div className="space-y-3">
                    {syncStatus.upcoming_syncs.map((upcoming, index) => (
                      <div key={index} className="p-3 rounded-md bg-blue-50 border border-blue-100">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-2">
                            <PlatformIcon platform={upcoming.platform} />
                            <span className="font-medium capitalize">{upcoming.platform}</span>
                          </div>
                          <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                            {upcoming.minutes_until_next_sync <= 0 
                              ? "Now" 
                              : `In ${upcoming.minutes_until_next_sync} min`}
                          </Badge>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground mt-2 gap-4">
                          <span>Last sync: {formatRelativeTime(upcoming.last_synced)}</span>
                          <span>Next: {formatDateTime(upcoming.next_sync)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                    <Clock size={36} className="text-blue-400 mb-2" />
                    <p>No upcoming syncs scheduled</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Platform breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Status</CardTitle>
              <CardDescription>Health status by platform</CardDescription>
            </CardHeader>
            <CardContent>
              {syncStatus?.platforms && Object.keys(syncStatus.platforms).length > 0 ? (
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(syncStatus.platforms).map(([platform, stats]) => (
                    <div 
                      key={platform} 
                      className="p-4 rounded-md border"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <PlatformIcon platform={platform} size={20} />
                          <span className="font-medium capitalize">{platform}</span>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={
                            stats.error > 0 
                              ? "bg-red-50 border-red-200 text-red-600" 
                              : "bg-green-50 border-green-200 text-green-600"
                          }
                        >
                          {Math.round((stats.active / (stats.total || 1)) * 100)}% healthy
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 mt-3 text-sm">
                        <div className="text-center">
                          <div className="text-lg font-bold">{stats.total}</div>
                          <div className="text-xs text-muted-foreground">Total</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">{stats.active}</div>
                          <div className="text-xs text-muted-foreground">Active</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-red-600">{stats.error}</div>
                          <div className="text-xs text-muted-foreground">Error</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No platforms configured</p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
      
      <SyncDialog 
        open={syncDialogOpen} 
        onOpenChange={setSyncDialogOpen}
        onSyncComplete={handleSyncComplete}
      />
    </div>
  );
}
