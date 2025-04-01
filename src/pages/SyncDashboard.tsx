
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SyncStatusTable } from "@/components/dashboard/SyncStatusTable";
import { SyncStatusBadge } from "@/components/ui/sync-status-badge";
import { SyncScheduleChart } from "@/components/sync/SyncScheduleChart";
import { syncService } from "@/services/api-service";

export default function SyncDashboard() {
  const queryClient = useQueryClient();

  // Fetch sync status data
  const { data: syncStatus, isLoading: isStatusLoading } = useQuery({
    queryKey: ["sync", "status"],
    queryFn: async () => {
      try {
        const response = await syncService.getSyncStatus();
        return response.data.syncStatus;
      } catch (error) {
        console.error("Error fetching sync status:", error);
        toast.error("Failed to load synchronization status");
        
        // Return mock data for development
        return getMockSyncStatus();
      }
    }
  });

  // Handle sync all properties
  const syncAllMutation = useMutation({
    mutationFn: async () => {
      return await syncService.syncAll();
    },
    onSuccess: () => {
      toast.success("Synchronization of all properties started");
      queryClient.invalidateQueries({ queryKey: ["sync", "status"] });
    },
    onError: () => {
      toast.error("Failed to start synchronization");
    }
  });

  const handleSyncAll = () => {
    syncAllMutation.mutate();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Synchronization Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and manage property synchronization status
          </p>
        </div>
        
        <Button 
          onClick={handleSyncAll} 
          disabled={syncAllMutation.isPending}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${syncAllMutation.isPending ? "animate-spin" : ""}`} />
          Sync All Properties
        </Button>
      </div>

      {/* Overall Status Section */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isStatusLoading ? (
                <div className="h-8 w-16 rounded animate-pulse bg-muted" />
              ) : (
                syncStatus?.total_properties || 0
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Synced Successfully</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-green-500">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {isStatusLoading ? (
                <div className="h-8 w-16 rounded animate-pulse bg-muted" />
              ) : (
                syncStatus?.synced_count || 0
              )}
            </div>
          </CardContent>
        </Card>

        {(syncStatus?.failed_count > 0 || isStatusLoading) && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sync Failures</CardTitle>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-red-500">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {isStatusLoading ? (
                  <div className="h-8 w-16 rounded animate-pulse bg-muted" />
                ) : (
                  syncStatus?.failed_count || 0
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Global Sync</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-medium">
              {isStatusLoading ? (
                <div className="h-6 w-32 rounded animate-pulse bg-muted" />
              ) : (
                formatRelativeTime(syncStatus?.last_sync)
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Property Sync Status Table */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Property Sync Status</h2>
        <SyncStatusTable action="Sync All Properties" />
      </div>

      {/* Sync Schedule Chart */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Sync Schedule</h2>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-4">Visualization of upcoming synchronization tasks</p>
            <div className="h-[300px]">
              <SyncScheduleChart />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper function to format relative time
function formatRelativeTime(dateString?: string) {
  if (!dateString) return "Never";
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  } catch (error) {
    return "Unknown";
  }
}

// Mock data function for development purposes
function getMockSyncStatus() {
  return {
    total_properties: 12,
    synced_count: 9,
    failed_count: 2,
    last_sync: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    sync_in_progress: 1
  };
}
