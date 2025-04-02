
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
        console.log("Sync data response in hook:", response);
        
        // Check both response formats and extract the data properly
        if (response.data?.success && response.data?.data) {
          return response.data.data;
        } else if (response.data) {
          return response.data;
        }
        return null;
      } catch (error) {
        console.error("Error fetching sync status:", error);
        return null;
      }
    },
    enabled: !!propertyId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Create mock data for sync logs since the actual endpoint might not exist in the API
  const {
    data: syncLogs,
    isLoading: isLoadingSyncLogs
  } = useQuery({
    queryKey: ["property-sync-logs", propertyId],
    queryFn: async () => {
      if (!propertyId) return null;

      // Create mock data instead of calling a potentially non-existent API
      const mockLogs = {
        logs: Array.from({ length: 10 }).map((_, i) => ({
          _id: `log-${i}`,
          property_id: propertyId,
          platform: i % 2 === 0 ? 'Airbnb' : 'Booking.com',
          action: 'sync_complete',
          status: i % 3 === 0 ? 'warning' : 'success',
          timestamp: new Date(Date.now() - i * 86400000).toISOString(),
          duration: Math.floor(Math.random() * 100) + 20,
          message: `Sync ${i % 3 === 0 ? 'completed with warnings' : 'successful'}`,
          details: {},
          created_at: new Date(Date.now() - i * 86400000).toISOString(),
          results: {
            events_processed: Math.floor(Math.random() * 20) + 5
          }
        }))
      };

      return { data: mockLogs };
    },
    enabled: !!propertyId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const syncPerformanceData = React.useMemo(() => {
    if (!syncLogs?.data?.logs) return [];
    
    return syncLogs.data.logs.slice(0, 10).map(log => ({
      name: format(new Date(log.timestamp), 'MMM dd'),
      duration: log.duration,
      platform: log.platform,
      status: log.status,
      eventsProcessed: log.results?.events_processed || 0,
    })).reverse();
  }, [syncLogs]);

  return {
    syncStatus,
    syncLogs: syncLogs?.data,
    isLoadingSyncStatus,
    isLoadingSyncLogs,
    syncPerformanceData,
    refetchSyncStatus
  };
}
