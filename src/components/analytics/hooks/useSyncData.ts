
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { syncService } from "@/services/api-service";
import React from "react";

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
        return response.data?.syncStatus || null;
      } catch (error) {
        console.error("Error fetching sync status:", error);
        return null; // Return null instead of undefined on error
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
        return null; // Return null instead of undefined on error
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
