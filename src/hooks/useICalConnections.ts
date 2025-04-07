
import { useQuery } from '@tanstack/react-query';
import { icalConnectionService } from '@/services/ical-connection-service';
import { ICalConnection, ICalConnectionsResponse } from "@/types/api-responses/ical-types";

export function useICalConnections(propertyId: string) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [`property-ical-connections-${propertyId}`],
    queryFn: async () => {
      const response = await icalConnectionService.getConnections(propertyId);
      return response.data;
    },
    enabled: !!propertyId
  });

  const connections = data?.data || [];
  const connectionsMeta = data?.meta || { 
    total: 0, 
    active_connections: 0,
    status_breakdown: {},
    platform_breakdown: {}
  };

  return {
    connections,
    connectionsMeta,
    isLoading,
    isError,
    refetch
  };
}
