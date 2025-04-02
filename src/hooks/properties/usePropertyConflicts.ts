
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
        
        // Handle different response formats
        if (response.data?.success && response.data?.data) {
          return response.data.data;
        } else if (Array.isArray(response.data)) {
          return { conflicts: response.data };
        } else if (response.data && Array.isArray(response.data.conflicts)) {
          return response.data;
        }
        
        return { conflicts: [] };
      } catch (error) {
        console.error("Error fetching conflicts:", error);
        return { conflicts: [] };
      }
    },
    enabled: !!id,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const hasConflicts = useMemo(() => {
    if (!conflictsData) return false;
    
    // Handle different data structures
    if (Array.isArray(conflictsData)) {
      return conflictsData.length > 0;
    } else if (Array.isArray(conflictsData.conflicts)) {
      return conflictsData.conflicts.length > 0;
    }
    
    return false;
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
