
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import api from "@/lib/api";

export function usePropertyConflicts(id: string | undefined) {
  const { 
    data: conflictsData,
    isLoading: conflictsLoading,
    error: conflictsError,
    isError: isConflictsError,
    refetch: refetchConflicts
  } = useQuery({
    queryKey: ["property-conflicts", id],
    queryFn: async () => {
      if (!id) return { conflicts: [] };
      try {
        console.log("Fetching conflicts for property ID:", id);
        const response = await api.get(`/properties/${id}/conflicts`);
        console.log("Conflicts response:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching conflicts:", error);
        return { conflicts: [] };
      }
    },
    enabled: !!id,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const hasConflicts = useMemo(() => {
    return conflictsData && conflictsData.conflicts && conflictsData.conflicts.length > 0;
  }, [conflictsData]);

  return {
    conflictsData,
    hasConflicts,
    conflictsLoading,
    conflictsError,
    isConflictsError,
    refetchConflicts
  };
}
