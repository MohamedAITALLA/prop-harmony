
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { syncService } from "@/services/api-service";
import React from "react";

// Define types for the API response based on the provided endpoint documentation
export interface PropertySyncStatus {
  property_id: string;
  connections: Array<{
    _id: string;
    platform: string;
    status: string;
    last_synced: string;
    next_sync: string | null;
    error_message: string | null;
    last_error_time: string | null;
    sync_frequency_minutes: number;
    url_hash: string | null;
  }>;
  event_counts: Array<{
    platform: string;
    total_events: number;
    active_events: number;
  }>;
  summary: {
    last_sync: string | null;
    next_sync: string | null;
    overall_status: string;
    total_connections: number;
    active_connections: number;
    error_connections: number;
    health_percentage: number;
  };
}

export function useSyncData(propertyId?: string) {
  const { 
    data: syncStatus, 
    isLoading: isLoadingSyncStatus,
    refetch: refetchSyncStatus
  } = useQuery({
    queryKey: ["property-sync-status", propertyId],
    queryFn: async () => {
      if (!propertyId) return null;
      try {
        const response = await syncService.getPropertySyncStatus(propertyId);
        return response.data || null;
      } catch (error) {
        console.error("Error fetching sync status:", error);
        return null;
      }
    },
    enabled: !!propertyId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const {
    data: syncLogs,
    isLoading: isLoadingSyncLogs
  } = useQuery({
    queryKey: ["property-sync-logs", propertyId],
    queryFn: async () => {
      if (!propertyId) return null;
      try {
        const response = await syncService.getPropertySyncLogs(propertyId);
        return response.data || null;
      } catch (error) {
        console.error("Error fetching sync logs:", error);
        return null;
      }
    },
    enabled: !!propertyId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const syncPerformanceData = React.useMemo(() => {
    if (!syncLogs?.logs) return [];
    
    return syncLogs.logs.slice(0, 10).map(log => ({
      name: format(new Date(log.timestamp), 'MMM dd'),
      duration: log.duration,
      platform: log.platform,
      status: log.status,
      eventsProcessed: log.results?.events_processed || 0,
    })).reverse();
  }, [syncLogs]);

  return {
    syncStatus,
    syncLogs,
    isLoadingSyncStatus,
    isLoadingSyncLogs,
    syncPerformanceData,
    refetchSyncStatus
  };
}
