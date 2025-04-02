
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminProfileService, adminUserService } from "@/services/api-service";
import { toast } from "sonner";

export function useAdminProfiles() {
  const queryClient = useQueryClient();

  const getProfiles = (page = 1, limit = 10) => {
    return useQuery({
      queryKey: ["admin-profiles", page, limit],
      queryFn: async () => {
        const response = await adminProfileService.getUserProfiles({
          page,
          limit
        });
        return response.data;
      }
    });
  };

  const getProfile = (userId: string) => {
    return useQuery({
      queryKey: ["admin-profile", userId],
      queryFn: async () => {
        if (!userId) return null;
        const response = await adminProfileService.getUserProfile(userId);
        return response.data;
      },
      enabled: !!userId
    });
  };

  const updateProfileMutation = useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: any }) => {
      return adminProfileService.updateUserProfile(userId, data);
    },
    onSuccess: (response, variables) => {
      toast.success(response.data?.message || "Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-profile", variables.userId] });
      queryClient.invalidateQueries({ queryKey: ["admin-profiles"] });
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  });

  const resetProfileMutation = useMutation({
    mutationFn: async (userId: string) => {
      return adminProfileService.resetUserProfile(userId);
    },
    onSuccess: (response, userId) => {
      toast.success(response.data?.message || "Profile reset successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-profile", userId] });
      queryClient.invalidateQueries({ queryKey: ["admin-profiles"] });
    },
    onError: (error) => {
      console.error("Error resetting profile:", error);
      toast.error("Failed to reset profile");
    }
  });

  // User management related functions
  const getUsersMutation = useMutation({
    mutationFn: async ({ page = 1, limit = 10 }: { page: number; limit: number }) => {
      return adminUserService.getUsers({ page, limit });
    }
  });

  const getUserDetails = (userId: string) => {
    return useQuery({
      queryKey: ["admin-user", userId],
      queryFn: async () => {
        if (!userId) return null;
        const response = await adminUserService.getUser(userId);
        return response.data;
      },
      enabled: !!userId
    });
  };

  return {
    getProfiles,
    getProfile,
    updateProfile: (userId: string, data: any) => updateProfileMutation.mutate({ userId, data }),
    resetProfile: (userId: string) => resetProfileMutation.mutate(userId),
    isUpdating: updateProfileMutation.isPending,
    isResetting: resetProfileMutation.isPending,
    getUsers: ({ page = 1, limit = 10 }: { page: number; limit: number }) => getUsersMutation.mutate({ page, limit }),
    getUserDetails,
  };
}
