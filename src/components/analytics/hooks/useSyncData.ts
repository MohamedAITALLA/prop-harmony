
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { syncService } from "@/services/api-service";
import React from "react";

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
  const [retryAttempt, setRetryAttempt] = React.useState(0);

  const { 
    data: syncStatus, 
    isLoading: isLoadingSyncStatus,
    refetch: refetchSyncStatus,
    error: syncError,
    isRefetching
  } = useQuery({
    queryKey: ["property-sync-status", propertyId, retryAttempt],
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
        
        // Enhanced error handling for network errors
        if (error.message && (
          error.message.includes("Network Error") || 
          error.message.includes("ERR_NETWORK") ||
          error.message.includes("timeout") ||
          error.message.includes("internet connection")
        )) {
          throw new Error("Network connection issue. Please check your internet connection and try again.");
        }
        
        throw error;
      }
    },
    enabled: !!propertyId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000), // Exponential backoff
  });

  const manualRetry = React.useCallback(() => {
    setRetryAttempt(prev => prev + 1);
  }, []);

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
    syncLogs,
    isLoadingSyncStatus,
    isLoadingSyncLogs,
    syncPerformanceData,
    refetchSyncStatus,
    syncError,
    isRefetching,
    manualRetry
  };
}
