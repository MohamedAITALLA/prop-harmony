
import { useQuery } from '@tanstack/react-query';
import { icalConnectionService } from '@/services/ical-connection-service';
import { ICalConnection } from "@/types/api-responses";

interface ConnectionsResponse {
  data: ICalConnection[];
  meta?: {
    total: number;
    active_connections: number;
  };
}

export function useICalConnections(propertyId: string) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [`property-ical-connections-${propertyId}`],
    queryFn: async () => {
      const response = await icalConnectionService.getConnections(propertyId);
      return response.data as ConnectionsResponse;
    }
  });

  const connections = data?.data || [];
  const connectionsMeta = data?.meta || { total: 0, active_connections: 0 };

  return {
    connections,
    connectionsMeta,
    isLoading,
    isError,
    refetch
  };
}
