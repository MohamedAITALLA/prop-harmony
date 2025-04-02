
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import api from "@/lib/api";

export function usePropertyConflicts(id: string | undefined) {
  const { data: conflictsData } = useQuery({
    queryKey: ["property-conflicts", id],
    queryFn: async () => {
      if (!id) return { conflicts: [] };
      try {
        const response = await api.get(`/properties/${id}/conflicts`);
        return response.data;
      } catch (error) {
        console.error("Error fetching conflicts:", error);
        return { conflicts: [] };
      }
    },
    enabled: !!id,
  });

  const hasConflicts = useMemo(() => {
    return conflictsData && conflictsData.conflicts && conflictsData.conflicts.length > 0;
  }, [conflictsData]);

  return {
    conflictsData,
    hasConflicts
  };
}
