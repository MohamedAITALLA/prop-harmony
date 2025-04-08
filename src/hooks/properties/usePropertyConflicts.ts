
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { conflictService } from "@/services/api-service";
import { toast } from "sonner";
import { useState } from "react";

export function usePropertyConflicts(propertyId: string | undefined) {
  const [statusFilter, setStatusFilter] = useState<'active' | 'resolved' | 'ignored' | undefined>('active');
  const queryClient = useQueryClient();

  const {
    data: conflictsResponse,
    isLoading: conflictsLoading,
    error: conflictsError,
    refetch: refetchConflicts,
  } = useQuery({
    queryKey: ["property-conflicts", propertyId, statusFilter],
    queryFn: async () => {
      if (!propertyId) throw new Error("Property ID is required");
      return await conflictService.getConflicts(propertyId, statusFilter);
    },
    enabled: !!propertyId,
  });

  const deleteConflictMutation = useMutation({
    mutationFn: async ({ propertyId, conflictId }: { propertyId: string; conflictId: string }) => {
      return await conflictService.deleteConflict(propertyId, conflictId);
    },
    onSuccess: (data) => {
      toast.success(data.message || "Conflict removed successfully");
      queryClient.invalidateQueries({ queryKey: ["property-conflicts", propertyId] });
    },
    onError: (error: any) => {
      toast.error(`Failed to remove conflict: ${error.message || "Unknown error"}`);
    },
  });

  const handleDeleteConflict = async (conflictId: string) => {
    if (!propertyId) {
      toast.error("Property ID is required");
      return;
    }
    deleteConflictMutation.mutate({ propertyId, conflictId });
  };

  return {
    conflicts: conflictsResponse?.data || [],
    conflictsMeta: conflictsResponse?.meta,
    conflictsLoading,
    conflictsError,
    refetchConflicts,
    statusFilter,
    setStatusFilter,
    deleteConflict: handleDeleteConflict,
    isDeletingConflict: deleteConflictMutation.isPending,
  };
}
